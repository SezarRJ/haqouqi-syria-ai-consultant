import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { HomeHeader } from '@/components/home/HomeHeader';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { FeaturedProviders } from '@/components/home/FeaturedProviders';
// No need for Button or useNavigate here directly anymore, as FeaturedProviders handles navigation

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
    }

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <HomeHeader user={user} language={language} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <WelcomeSection user={user} language={language} />
        <ServicesGrid language={language} />
        {/* FeaturedProviders now internally handles navigation to the list or profile */}
        <FeaturedProviders language={language} />
      </div>
    </div>
  );
};

export default Index;
