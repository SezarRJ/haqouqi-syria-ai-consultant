
-- Create service provider profiles table
CREATE TABLE public.service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('lawyer', 'judge')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  activities TEXT[] DEFAULT '{}',
  bio TEXT,
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_consultations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create service provider certificates table
CREATE TABLE public.provider_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
  certificate_name TEXT NOT NULL,
  certificate_url TEXT NOT NULL,
  issued_by TEXT,
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create paid consultations table
CREATE TABLE public.paid_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
  consultation_type TEXT DEFAULT 'chat',
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  rate DECIMAL(10,2) NOT NULL,
  platform_fee_percentage DECIMAL(5,2) DEFAULT 15.00,
  total_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  provider_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create consultation reviews table
CREATE TABLE public.consultation_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.paid_consultations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_providers
CREATE POLICY "Anyone can view verified providers" ON public.service_providers
  FOR SELECT USING (is_verified = true AND is_active = true);

CREATE POLICY "Providers can view own profile" ON public.service_providers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Providers can update own profile" ON public.service_providers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can create provider profile" ON public.service_providers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for provider_certificates
CREATE POLICY "Anyone can view certificates of verified providers" ON public.provider_certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.service_providers sp 
      WHERE sp.id = provider_certificates.provider_id 
      AND sp.is_verified = true
    )
  );

CREATE POLICY "Providers can manage own certificates" ON public.provider_certificates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.service_providers sp 
      WHERE sp.id = provider_certificates.provider_id 
      AND sp.user_id = auth.uid()
    )
  );

-- RLS Policies for paid_consultations
CREATE POLICY "Users can view own consultations" ON public.paid_consultations
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.service_providers sp 
      WHERE sp.id = paid_consultations.provider_id 
      AND sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create consultations" ON public.paid_consultations
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Providers can update consultations" ON public.paid_consultations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.service_providers sp 
      WHERE sp.id = paid_consultations.provider_id 
      AND sp.user_id = auth.uid()
    )
  );

-- RLS Policies for consultation_reviews
CREATE POLICY "Anyone can view reviews" ON public.consultation_reviews
  FOR SELECT USING (true);

CREATE POLICY "Clients can create reviews for their consultations" ON public.consultation_reviews
  FOR INSERT WITH CHECK (
    client_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.paid_consultations pc 
      WHERE pc.id = consultation_reviews.consultation_id 
      AND pc.client_id = auth.uid()
      AND pc.status = 'completed'
    )
  );

-- Function to update provider rating after review
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.service_providers 
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.consultation_reviews 
    WHERE provider_id = NEW.provider_id
  ),
  total_consultations = (
    SELECT COUNT(*)
    FROM public.paid_consultations 
    WHERE provider_id = NEW.provider_id 
    AND status = 'completed'
  )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating after new review
CREATE TRIGGER update_provider_rating_trigger
  AFTER INSERT ON public.consultation_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();

-- Function to calculate consultation amounts
CREATE OR REPLACE FUNCTION calculate_consultation_amounts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_amount = NEW.rate * (NEW.duration_minutes / 60.0);
  NEW.platform_fee = NEW.total_amount * (NEW.platform_fee_percentage / 100.0);
  NEW.provider_amount = NEW.total_amount - NEW.platform_fee;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate amounts before insert/update
CREATE TRIGGER calculate_consultation_amounts_trigger
  BEFORE INSERT OR UPDATE ON public.paid_consultations
  FOR EACH ROW
  EXECUTE FUNCTION calculate_consultation_amounts();
