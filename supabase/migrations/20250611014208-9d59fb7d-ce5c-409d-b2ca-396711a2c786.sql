
-- Create users profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'individual' CHECK (role IN ('individual', 'company', 'lawyer', 'judge')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked'))
);

-- Create admin roles table
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'content_editor', 'user_manager', 'reviewer');

CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_role admin_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, admin_role)
);

-- Create laws table
CREATE TABLE public.laws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  year INTEGER,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create law articles table
CREATE TABLE public.law_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  law_id UUID REFERENCES public.laws(id) ON DELETE CASCADE,
  article_number TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  chapter TEXT,
  section TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legal interpretations table
CREATE TABLE public.legal_interpretations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  reference_source TEXT,
  interpretation_type TEXT DEFAULT 'fiqh' CHECK (interpretation_type IN ('fiqh', 'fatwa')),
  related_law_id UUID REFERENCES public.laws(id),
  related_article_id UUID REFERENCES public.law_articles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create law updates table for tracking changes
CREATE TABLE public.law_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  law_id UUID REFERENCES public.laws(id),
  article_id UUID REFERENCES public.law_articles(id),
  update_type TEXT NOT NULL CHECK (update_type IN ('new_law', 'amend_law', 'repeal_law', 'add_interpretation')),
  old_content TEXT,
  new_content TEXT NOT NULL,
  update_reason TEXT NOT NULL,
  effective_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id) NOT NULL,
  reviewed_by UUID REFERENCES auth.users(id),
  review_comments TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create consultations table for tracking user consultations
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  consultation_type TEXT DEFAULT 'chat' CHECK (consultation_type IN ('chat', 'document_analysis', 'search')),
  query_text TEXT,
  ai_response TEXT,
  documents_uploaded TEXT[], -- array of document names/paths
  confidence_score DECIMAL(3,2),
  user_feedback INTEGER CHECK (user_feedback IN (-1, 1)), -- thumbs up/down
  consultation_duration INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('app_name', 'المستشار القانوني السوري', 'Application name'),
('legal_disclaimer', 'هذا التطبيق يقدم استشارات قانونية عامة وليس بديلاً عن الاستشارة القانونية المهنية', 'Legal disclaimer text'),
('notifications_enabled', 'true', 'Enable/disable notifications'),
('ai_confidence_threshold', '0.7', 'Minimum confidence score for AI responses');

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = is_admin.user_id 
    AND is_active = true
  );
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for admin_users
CREATE POLICY "Admins can manage admin users" ON public.admin_users
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for laws and articles
CREATE POLICY "Anyone can read laws" ON public.laws
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage laws" ON public.laws
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can read law articles" ON public.law_articles
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage law articles" ON public.law_articles
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for legal interpretations
CREATE POLICY "Anyone can read interpretations" ON public.legal_interpretations
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage interpretations" ON public.legal_interpretations
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for law updates
CREATE POLICY "Admins can manage updates" ON public.law_updates
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for consultations
CREATE POLICY "Users can view own consultations" ON public.consultations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create consultations" ON public.consultations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all consultations" ON public.consultations
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for system settings
CREATE POLICY "Anyone can read settings" ON public.system_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.system_settings
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_laws_updated_at BEFORE UPDATE ON public.laws
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_law_articles_updated_at BEFORE UPDATE ON public.law_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_interpretations_updated_at BEFORE UPDATE ON public.legal_interpretations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
