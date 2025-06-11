import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '@/components/AuthModal';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { EnhancedLegalConsultation } from '@/components/EnhancedLegalConsultation';
import { CredentialsInfo } from '@/components/CredentialsInfo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Scale, Menu, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [showCredentials, setShowCredentials] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user just signed in and it's an admin account, ensure admin privileges
        if (event === 'SIGNED_IN' && session?.user?.email === 'admin@legaladvisor.com') {
          try {
            // Check if admin record exists, if not create it
            const { data: adminCheck } = await supabase
              .from('admin_users')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (!adminCheck) {
              await supabase.from('admin_users').insert({
                user_id: session.user.id,
                admin_role: 'super_admin',
                is_active: true
              });
              console.log('Admin privileges created for user');
            }
          } catch (error) {
            console.error('Error setting up admin privileges:', error);
          }
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Existing session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Quick login function for demo credentials with proper email formats
  const quickLogin = async (email: string, password: string, isAdmin = false) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', email);
      
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInData.user && !signInError) {
        console.log('Sign in successful:', signInData.user);
        toast({
          title: language === 'ar' ? "تم تسجيل الدخول بنجاح" : "Successfully signed in",
          description: language === 'ar' ? "مرحباً بك" : "Welcome back",
        });
        return;
      }

      console.log('Sign in failed, attempting sign up:', signInError);
      
      // If sign in fails, try to create the account
      if (signInError) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: isAdmin ? 'Admin User' : 'Demo User',
            },
            emailRedirectTo: window.location.origin
          },
        });

        if (signUpData.user && !signUpError) {
          console.log('Sign up successful:', signUpData.user);
          
          // For admin account, create admin privileges
          if (isAdmin) {
            try {
              await supabase.from('admin_users').insert({
                user_id: signUpData.user.id,
                admin_role: 'super_admin',
                is_active: true
              });
              console.log('Admin privileges created');
            } catch (adminError) {
              console.error('Error creating admin privileges:', adminError);
            }
          }

          toast({
            title: language === 'ar' ? "تم إنشاء الحساب وتسجيل الدخول" : "Account created and signed in",
            description: language === 'ar' ? 
              (signUpData.user.email_confirmed_at ? "مرحباً بك في النظام" : "يرجى تفقد بريدك الإلكتروني لتأكيد الحساب") : 
              (signUpData.user.email_confirmed_at ? "Welcome to the system" : "Please check your email to confirm your account"),
          });
        } else {
          console.error('Sign up failed:', signUpError);
          throw signUpError || new Error('Failed to create account');
        }
      } else {
        throw signInError;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: language === 'ar' ? "خطأ في تسجيل الدخول" : "Login Error",
        description: error.message || (language === 'ar' ? "حدث خطأ أثناء تسجيل الدخول" : "An error occurred during login"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal language={language} onLanguageChange={handleLanguageChange} quickLogin={quickLogin} />;
  }

  const texts = {
    ar: {
      title: "المستشار القانوني السوري",
      subtitle: "نظام ذكي للاستشارات القانونية",
      welcome: "مرحباً بك في المستشار القانوني المتطور",
      description: "منصة شاملة للاستشارات القانونية مع ميزات متقدمة للمحترفين",
      credentials: "بيانات الدخول",
      showCredentials: "عرض بيانات الدخول",
      hideCredentials: "إخفاء بيانات الدخول"
    },
    en: {
      title: "Syrian Legal Advisor",
      subtitle: "Smart Legal Consultation System",
      welcome: "Welcome to Advanced Legal Advisor",
      description: "Comprehensive legal consultation platform with advanced features for professionals",
      credentials: "Login Credentials",
      showCredentials: "Show Credentials",
      hideCredentials: "Hide Credentials"
    }
  };

  const t = texts[language];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AppSidebar user={user} language={language} onLanguageChange={handleLanguageChange} />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SidebarTrigger>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="font-bold text-blue-900">{t.title}</h1>
                    <p className="text-sm text-blue-600">{t.subtitle}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {showCredentials ? t.hideCredentials : t.showCredentials}
                  </span>
                </Button>
                <LanguageSwitcher 
                  language={language} 
                  onLanguageChange={handleLanguageChange}
                  variant="compact"
                />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 container mx-auto px-4 py-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Welcome Section */}
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
                  {t.welcome}
                </h2>
                <p className="text-blue-600 text-lg mb-4">
                  {t.description}
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-1">
                    الإصدار التجريبي - Beta Version
                  </Badge>
                </div>
              </div>

              {/* Credentials Section */}
              {showCredentials && (
                <div className="animate-fade-in">
                  <CredentialsInfo />
                </div>
              )}

              {/* Main Application */}
              <EnhancedLegalConsultation language={language} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
