
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '@/components/AuthModal';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { EnhancedLegalConsultation } from '@/components/EnhancedLegalConsultation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Scale, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
    return <AuthModal language={language} onLanguageChange={handleLanguageChange} />;
  }

  const texts = {
    ar: {
      title: "المستشار القانوني السوري",
      subtitle: "نظام ذكي للاستشارات القانونية",
      welcome: "مرحباً بك في المستشار القانوني المتطور"
    },
    en: {
      title: "Syrian Legal Advisor",
      subtitle: "Smart Legal Consultation System",
      welcome: "Welcome to Advanced Legal Advisor"
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
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
                  {t.welcome}
                </h2>
                <p className="text-blue-600 text-lg">
                  {language === 'ar' 
                    ? 'منصة شاملة للاستشارات القانونية مع ميزات متقدمة للمحترفين' 
                    : 'Comprehensive legal consultation platform with advanced features for professionals'
                  }
                </p>
              </div>
              
              <EnhancedLegalConsultation language={language} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
