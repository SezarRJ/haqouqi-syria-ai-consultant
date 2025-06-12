import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { HomeHeader } from '@/components/home/HomeHeader';
// import { WelcomeSection } from '@/components/home/WelcomeSection'; // REMOVED
import { HeroSection } from '@/components/home/HeroSection'; // NEW
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { FeaturedProviders } from '@/components/home/FeaturedProviders';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Loader2 } from 'lucide-react'; // Import Loader2 for consistency

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Set a default language if none found
      localStorage.setItem('language', 'en'); // Default to English
      setLanguage('en');
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    // Directly update html dir and lang attributes here for immediate effect
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></Loader2>
        <span className="sr-only">Loading...</span> {/* A visual hidden text for accessibility */}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AppSidebar user={user} language={language} onLanguageChange={handleLanguageChange} />
        <SidebarInset className="flex-1"> {/* Added flex-1 for better layout management */}
          <HomeHeader user={user} language={language} />
          {/* Replaced WelcomeSection with HeroSection */}
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
