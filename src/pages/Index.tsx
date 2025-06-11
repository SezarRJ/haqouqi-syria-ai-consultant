
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '@/components/AuthModal';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { EnhancedLegalConsultation } from '@/components/EnhancedLegalConsultation';
import { CredentialsInfo } from '@/components/CredentialsInfo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Menu, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
} | null;

const Index = () => {
  const [user, setUser] = useState<User>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [showCredentials, setShowCredentials] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) setLanguage(savedLanguage);

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleGuestAccess = () => {
    setIsGuestMode(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user && !isGuestMode) {
    return (
      <AuthModal 
        language={language}
        onLanguageChange={handleLanguageChange}
        onGuestAccess={handleGuestAccess}
      />
    );
  }

  const texts = {
    ar: {
      title: "المستشار القانوني السوري",
      subtitle: "نظام ذكي للاستشارات القانونية",
      welcome: isGuestMode ? "مرحباً بك كضيف" : "مرحباً بك",
      description: "منصة شاملة للاستشارات القانونية",
      credentials: "بيانات الدخول",
      showCredentials: "عرض بيانات الدخول",
      hideCredentials: "إخفاء بيانات الدخول",
      guestMode: "وضع الضيف"
    },
    en: {
      title: "Syrian Legal Advisor",
      subtitle: "Smart Legal Consultation System",
      welcome: isGuestMode ? "Welcome Guest" : "Welcome",
      description: "Comprehensive legal consultation platform",
      credentials: "Login Credentials",
      showCredentials: "Show Credentials",
      hideCredentials: "Hide Credentials",
      guestMode: "Guest Mode"
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col lg:flex-row w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <AppSidebar 
        user={user || { email: 'guest@example.com', user_metadata: { full_name: 'Guest User' } }} 
        language={language} 
        onLanguageChange={handleLanguageChange} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm sticky top-0 z-10 safe-area-inset-top">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden touch-target">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="font-bold text-blue-900 text-base sm:text-lg truncate-mobile max-w-[calc(100vw-180px)]">
                {t.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {isGuestMode && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs py-1 px-2 no-select">
                  {t.guestMode}
                </Badge>
              )}
              <LanguageSwitcher 
                language={language} 
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto custom-scrollbar safe-area-inset-bottom">
          <div className="max-w-6xl mx-auto space-y-8 pb-4 sm:pb-8">
            <div className="text-center px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-3">
                {t.welcome}
              </h2>
              <p className="text-blue-600 text-sm sm:text-base leading-relaxed">
                {t.description}
              </p>
            </div>

            <EnhancedLegalConsultation language={language} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
