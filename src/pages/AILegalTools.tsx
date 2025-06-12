import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react'; // ArrowLeft is no longer needed if using HomeHeader
import { Button } from '@/components/ui/button'; // Button might still be useful for other actions
import { AILegalSuite } from '@/components/ai/AILegalSuite';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { HomeHeader } from '@/components/home/HomeHeader'; // Import HomeHeader for consistent top navigation

const AILegalTools = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('en'); // Default to 'en' or as preferred

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Set a default language if not found
      localStorage.setItem('language', 'en');
      setLanguage('en');
    }
  }, []);

  const texts = {
    ar: {
      title: "أدوات الذكاء الاصطناعي القانونية",
      subtitle: "مجموعة شاملة من الأدوات المتقدمة للممارسة القانونية"
    },
    en: {
      title: "AI Legal Tools",
      subtitle: "Comprehensive suite of advanced tools for legal practice"
    }
  };

  const t = texts[language];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Use HomeHeader for consistent top navigation and user experience */}
      <HomeHeader user={user} language={language} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Title Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8 text-center md:text-left">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Brain className="h-9 w-9 text-white" />
          </div>
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              {t.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* AI Legal Suite Content */}
        <AILegalSuite language={language} />
      </div>
    </div>
  );
};

export default AILegalTools;
