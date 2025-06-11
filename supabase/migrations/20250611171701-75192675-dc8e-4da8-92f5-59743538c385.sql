
-- Create payment methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'credit_card', 'scratch_card')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create vouchers table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  admin_role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment_records table for tracking all payments
CREATE TABLE IF NOT EXISTS public.payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES public.payment_methods(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  reference_number TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can view their voucher usage" ON public.vouchers;
DROP POLICY IF EXISTS "Admins can manage vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Users can view their own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Users can view their payment records" ON public.payment_records;
DROP POLICY IF EXISTS "Admins can view all payment records" ON public.payment_records;

-- Create RLS policies for payment_methods
CREATE POLICY "Anyone can view payment methods" ON public.payment_methods FOR SELECT USING (true);

-- Create RLS policies for vouchers
CREATE POLICY "Users can view their voucher usage" ON public.vouchers FOR SELECT USING (used_by = auth.uid() OR auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));
CREATE POLICY "Admins can manage vouchers" ON public.vouchers FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

-- Create RLS policies for admin_users
CREATE POLICY "Users can view their own admin status" ON public.admin_users FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage admin users" ON public.admin_users FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

-- Create RLS policies for payment_records
CREATE POLICY "Users can view their payment records" ON public.payment_records FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all payment records" ON public.payment_records FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));
CREATE POLICY "Users can create their payment records" ON public.payment_records FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all payment records" ON public.payment_records FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

-- Insert default payment methods
INSERT INTO public.payment_methods (name, type) VALUES 
('Bank Transfer', 'bank_transfer'),
('Credit Card', 'credit_card'),
('Scratch Card', 'scratch_card')
ON CONFLICT DO NOTHING;

-- Function to redeem voucher
CREATE OR REPLACE FUNCTION public.redeem_voucher(p_code TEXT, p_user_id UUID)
RETURNS TABLE(success BOOLEAN, message TEXT, amount DECIMAL)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_voucher public.vouchers%ROWTYPE;
BEGIN
  -- Get voucher details
  SELECT * INTO v_voucher FROM public.vouchers 
  WHERE code = p_code AND NOT is_used 
  AND (expires_at IS NULL OR expires_at > now());
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Invalid or expired voucher code', 0.00::DECIMAL;
    RETURN;
  END IF;
  
  -- Mark voucher as used
  UPDATE public.vouchers 
  SET is_used = true, used_by = p_user_id, used_at = now()
  WHERE id = v_voucher.id;
  
  -- Add balance to user
  PERFORM public.add_user_balance(p_user_id, v_voucher.amount, 'Voucher redemption: ' || p_code);
  
  RETURN QUERY SELECT true, 'Voucher redeemed successfully', v_voucher.amount;
END;
$$;

-- Function to create voucher
CREATE OR REPLACE FUNCTION public.create_voucher(
  p_amount DECIMAL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS TABLE(voucher_code TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code TEXT;
BEGIN
  -- Generate unique voucher code
  v_code := 'VC-' || upper(substring(gen_random_uuid()::text from 1 for 8));
  
  -- Insert voucher
  INSERT INTO public.vouchers (code, amount, expires_at, created_by)
  VALUES (v_code, p_amount, p_expires_at, p_created_by);
  
  RETURN QUERY SELECT v_code;
END;
$$;

-- Function to get transaction history
CREATE OR REPLACE FUNCTION public.get_transaction_history(p_user_id UUID DEFAULT NULL, p_limit INTEGER DEFAULT 50)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  amount DECIMAL,
  type TEXT,
  description TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  payment_method TEXT,
  reference_number TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(t.id, pr.id) as id,
    COALESCE(t.user_id, pr.user_id) as user_id,
    COALESCE(t.amount, pr.amount) as amount,
    COALESCE(t.type, 'payment') as type,
    COALESCE(t.description, pr.description) as description,
    COALESCE(t.status, pr.status) as status,
    COALESCE(t.created_at, pr.created_at) as created_at,
    pm.name as payment_method,
    pr.reference_number
  FROM (
    SELECT id, user_id, amount, type, description, status, created_at, NULL::UUID as payment_method_id, NULL::TEXT as reference_number
    FROM public.transactions
    WHERE (p_user_id IS NULL OR user_id = p_user_id)
    UNION ALL
    SELECT id, user_id, amount, 'payment', description, status, created_at, payment_method_id, reference_number
    FROM public.payment_records
    WHERE (p_user_id IS NULL OR user_id = p_user_id)
  ) AS combined_data
  LEFT JOIN public.transactions t ON combined_data.id = t.id AND combined_data.payment_method_id IS NULL
  LEFT JOIN public.payment_records pr ON combined_data.id = pr.id AND combined_data.payment_method_id IS NOT NULL
  LEFT JOIN public.payment_methods pm ON pr.payment_method_id = pm.id
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

-- Create trigger to update payment_records updated_at
CREATE OR REPLACE FUNCTION public.update_payment_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_records_updated_at ON public.payment_records;
CREATE TRIGGER update_payment_records_updated_at
  BEFORE UPDATE ON public.payment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payment_records_updated_at();
