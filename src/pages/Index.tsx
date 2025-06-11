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
  const [isGuestMode, setIsGuestMode] = useState(false);
  const { toast } = useToast();
  const { isNative, hapticFeedback, platform } = useCapacitor();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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

    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' || 'ar';
    const savedDirection = localStorage.getItem('direction') || 'rtl';
    setLanguage(savedLanguage);
    document.documentElement.dir = savedDirection;
    document.documentElement.lang = savedLanguage;

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', lang);
    localStorage.setItem('direction', direction);
    hapticFeedback(ImpactStyle.Light);
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;
  };

  const handleGuestAccess = () => {
    setIsGuestMode(true);
    setLoading(false);
    hapticFeedback(ImpactStyle.Medium);
  };

  const texts = {
    ar: {
      title: "المستشار القانوني",
      subtitle: "نظام ذكي للاستشارات القانونية",
      welcome: isGuestMode ? "أهلاً بك ضيفنا الكريم" : "أهلاً بك",
      description: "منصة شاملة للاستشارات القانونية في سوريا. ابدأ بطرح سؤالك أدناه.",
      guestMode: "ضيف",
      nativeApp: "تطبيق أصلي",
      loading: "جاري التحميل..."
    },
    en: {
      title: "Legal Advisor",
      subtitle: "Smart Legal Consultation System",
      welcome: isGuestMode ? "Welcome, Guest" : "Welcome",
      description: "A comprehensive platform for legal consultation in Syria. Start by asking your question below.",
      guestMode: "Guest",
      nativeApp: "Native App",
      loading: "Loading..."
    }
  };
  const t = texts[language];

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground">{t.loading}</p>
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

  // NOTE: The `EnhancedLegalConsultation` component is what renders the actual chat messages.
  // To apply the smaller font size, you must find the <p> tag that displays the message text
  // inside that component and add `className="chat-text"` to it.
  // For example: <p className="chat-text">{message.text}</p>
  // Without seeing that component's code, I cannot edit it directly for you.
  // The CSS rule is ready and waiting for you to apply it.

  return (
    <div
      className="flex h-screen w-full flex-col lg:flex-row bg-secondary"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <AppSidebar
        user={user || { email: 'guest@example.com', user_metadata: { full_name: 'Guest User' } }}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-background shadow-sm sticky top-0 z-40 safe-area-top mobile-header">
          <div className="flex items-center gap-3 overflow-hidden">
            <SidebarTrigger className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => hapticFeedback(ImpactStyle.Light)}
              >
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </SidebarTrigger>
            <div className="overflow-hidden">
              <h1 className="font-bold text-foreground truncate mobile-title">{t.title}</h1>
              <p className="text-muted-foreground truncate mobile-subtitle">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            {isGuestMode && (
              <Badge variant="outline">{t.guestMode}</Badge>
            )}
            <LanguageSwitcher
              language={language}
              onLanguageChange={handleLanguageChange}
              variant="compact"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar mobile-content-padding safe-area-bottom">
          <div className="mx-auto h-full max-w-6xl">
              <EnhancedLegalConsultation language={language} />
          </div>
        </main>
      </div>

      {!isNative && <PWAInstaller language={language} />}
    </div>
  );
};

export default Index;
