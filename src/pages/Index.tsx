
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '@/components/AuthModal';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { EnhancedLegalConsultation } from '@/components/EnhancedLegalConsultation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Menu } from 'lucide-react';
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
      guestMode: "وضع الضيف"
    },
    en: {
      title: "Syrian Legal Advisor",
      subtitle: "Smart Legal Consultation System",
      welcome: isGuestMode ? "Welcome Guest" : "Welcome",
      description: "Comprehensive legal consultation platform",
      guestMode: "Guest Mode"
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <AppSidebar 
        user={user || { email: 'guest@example.com', user_metadata: { full_name: 'Guest User' } }} 
        language={language} 
        onLanguageChange={handleLanguageChange} 
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <SidebarTrigger className="md:hidden flex-shrink-0">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <h1 className="font-bold text-blue-900 text-sm sm:text-base lg:text-lg truncate">
                {t.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {isGuestMode && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-2 py-1">
                  {t.guestMode}
                </Badge>
              )}
              <div className="hidden sm:block">
                <LanguageSwitcher 
                  language={language} 
                  onLanguageChange={handleLanguageChange}
                />
              </div>
              <div className="sm:hidden">
                <LanguageSwitcher 
                  language={language} 
                  onLanguageChange={handleLanguageChange}
                  variant="compact"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              <div className="text-center space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900">
                  {t.welcome}
                </h2>
                <p className="text-blue-600 text-sm sm:text-base">
                  {t.description}
                </p>
              </div>

              <div className="w-full">
                <EnhancedLegalConsultation language={language} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
