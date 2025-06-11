
-- Create user_balances table
CREATE TABLE IF NOT EXISTS public.user_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'SAR',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'subscription'
  description TEXT,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on these tables
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view their own balance" ON public.user_balances;
DROP POLICY IF EXISTS "Users can update their own balance" ON public.user_balances;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.transactions;

-- Create RLS policies for user_balances
CREATE POLICY "Users can view their own balance" ON public.user_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own balance" ON public.user_balances FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to get user balance
CREATE OR REPLACE FUNCTION public.get_user_balance(p_user_id UUID)
RETURNS TABLE(balance DECIMAL, currency TEXT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(ub.balance, 0.00) as balance, COALESCE(ub.currency, 'SAR') as currency
  FROM public.user_balances ub
  WHERE ub.user_id = p_user_id
  UNION ALL
  SELECT 0.00 as balance, 'SAR' as currency
  WHERE NOT EXISTS (SELECT 1 FROM public.user_balances WHERE user_id = p_user_id)
  LIMIT 1;
$$;

-- Function to get user transactions
CREATE OR REPLACE FUNCTION public.get_user_transactions(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  amount DECIMAL,
  type TEXT,
  description TEXT,
  stripe_payment_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT t.id, t.user_id, t.amount, t.type, t.description, t.stripe_payment_id, t.status, t.created_at
  FROM public.transactions t
  WHERE t.user_id = p_user_id
  ORDER BY t.created_at DESC
  LIMIT p_limit;
$$;

-- Function to add user balance
CREATE OR REPLACE FUNCTION public.add_user_balance(p_user_id UUID, p_amount DECIMAL, p_description TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update user balance
  INSERT INTO public.user_balances (user_id, balance, currency)
  VALUES (p_user_id, p_amount, 'SAR')
  ON CONFLICT (user_id)
  DO UPDATE SET
    balance = user_balances.balance + p_amount,
    updated_at = now();
  
  -- Insert transaction record
  INSERT INTO public.transactions (user_id, amount, type, description, status)
  VALUES (p_user_id, p_amount, 'deposit', p_description, 'completed');
END;
$$;

-- Function to create admin user
CREATE OR REPLACE FUNCTION public.create_admin_user(p_user_id UUID, p_admin_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_users (user_id, admin_role, is_active)
  VALUES (p_user_id, p_admin_role::admin_role, true)
  ON CONFLICT (user_id, admin_role) DO NOTHING;
END;
$$;
