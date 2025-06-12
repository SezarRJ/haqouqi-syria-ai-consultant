
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { FeaturedProviders } from '@/components/home/FeaturedProviders';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      const validLanguage = savedLanguage as 'ar' | 'en';
      setLanguage(validLanguage);
      document.documentElement.dir = validLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = validLanguage;
    } else {
      const defaultLang: 'ar' | 'en' = 'en';
      setLanguage(defaultLang);
      localStorage.setItem('language', defaultLang);
      document.documentElement.dir = defaultLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = defaultLang;
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-medium text-gray-600 dark:text-gray-300">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider side={language === 'ar' ? 'right' : 'left'}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AppSidebar user={user} language={language} onLanguageChange={handleLanguageChange} />
        
        <SidebarInset className="flex-1 min-w-0">
          <div className="flex flex-col min-h-screen">
            <HomeHeader user={user} language={language} />
            <main className="flex-1">
              <HeroSection user={user} language={language} />
              <div className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
                <ServicesGrid language={language} />
                <FeaturedProviders language={language} />
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
