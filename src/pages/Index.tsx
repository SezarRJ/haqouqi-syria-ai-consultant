
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthModal } from '@/components/AuthModal';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { EnhancedLegalConsultation } from '@/components/EnhancedLegalConsultation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { PWAInstaller } from '@/components/PWAInstaller';
import { useCapacitor } from '@/hooks/useCapacitor';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ImpactStyle } from '@capacitor/haptics';

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
  const { isNative, hapticFeedback, platform } = useCapacitor();

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

    // Load saved language and direction
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    const savedDirection = localStorage.getItem('direction');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedDirection || (savedLanguage === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.lang = savedLanguage;
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    localStorage.setItem('direction', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Add haptic feedback for native apps
    hapticFeedback(ImpactStyle.Light);
    
    // Update document properties
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const handleGuestAccess = () => {
    setIsGuestMode(true);
    setLoading(false);
    hapticFeedback(ImpactStyle.Medium);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center safe-area-inset">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-600 arabic-text">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
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
      description: "منصة شاملة للاستشارات القانونية في سوريا",
      guestMode: "وضع الضيف",
      nativeApp: "تطبيق أصلي"
    },
    en: {
      title: "Syrian Legal Advisor",
      subtitle: "Smart Legal Consultation System",
      welcome: isGuestMode ? "Welcome Guest" : "Welcome",
      description: "Comprehensive legal consultation platform for Syria",
      guestMode: "Guest Mode",
      nativeApp: "Native App"
    }
  };

  const t = texts[language];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col lg:flex-row w-full safe-area-inset" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <AppSidebar 
        user={user || { email: 'guest@example.com', user_metadata: { full_name: 'Guest User' } }} 
        language={language} 
        onLanguageChange={handleLanguageChange} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm sticky top-0 z-40 safe-area-top">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <SidebarTrigger className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mobile-touch"
                  onClick={() => hapticFeedback(ImpactStyle.Light)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-blue-900 text-sm sm:text-base truncate arabic-heading">
                  {t.title}
                </h1>
                <p className="text-xs text-blue-600 truncate arabic-text">
                  {t.subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {isGuestMode && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs py-1 px-2 no-select mobile-hidden">
                  {t.guestMode}
                </Badge>
              )}
              
              {isNative && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs py-1 px-2 no-select mobile-hidden">
                  {t.nativeApp}
                </Badge>
              )}
              
              <LanguageSwitcher 
                language={language} 
                onLanguageChange={handleLanguageChange}
                variant="compact"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto custom-scrollbar safe-area-bottom">
          <div className="max-w-6xl mx-auto space-y-6 pb-4 sm:pb-8">
            <div className="text-center px-2">
              <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-2 sm:mb-3 arabic-heading">
                {t.welcome}
              </h2>
              <p className="text-sm sm:text-base text-blue-600 leading-relaxed arabic-text">
                {t.description}
              </p>
              
              {platform && (
                <p className="text-xs text-gray-500 mt-2">
                  {language === 'ar' ? `المنصة: ${platform}` : `Platform: ${platform}`}
                </p>
              )}
            </div>

            <EnhancedLegalConsultation language={language} />
          </div>
        </div>
      </main>

      {/* PWA Installer - only show on web */}
      {!isNative && <PWAInstaller language={language} />}
    </div>
  );
};

export default Index;
