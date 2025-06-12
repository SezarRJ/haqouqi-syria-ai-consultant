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

    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    } else {
      const defaultLang = 'en';
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
        <Loader2 className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></Loader2>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Define sidebar width (adjust this value to match your actual sidebar width)
  const sidebarWidthClass = 'w-64'; // Example: w-64 for a 16rem sidebar

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* AppSidebar: Needs to be fixed to left/right based on language */}
        <AppSidebar user={user} language={language} onLanguageChange={handleLanguageChange} />

        {/* SidebarInset: Needs dynamic margin to push content beside sidebar */}
        <SidebarInset
          className={`flex-1 transition-all duration-300 ease-in-out
            ${language === 'ar' ? 'mr-64' : 'ml-64'} /* Apply margin based on sidebar width */
            `}
        >
          <HomeHeader user={user} language={language} />
          <HeroSection user={user} language={language} />
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <ServicesGrid language={language} />
            <FeaturedProviders language={language} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
