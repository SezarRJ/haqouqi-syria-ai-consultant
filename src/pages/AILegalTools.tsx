
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AILegalSuite } from '@/components/ai/AILegalSuite';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const AILegalTools = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const texts = {
    ar: {
      backToHome: "العودة للرئيسية",
      title: "أدوات الذكاء الاصطناعي القانونية",
      subtitle: "مجموعة شاملة من الأدوات المتقدمة للممارسة القانونية"
    },
    en: {
      backToHome: "Back to Home",
      title: "AI Legal Tools",
      subtitle: "Comprehensive suite of advanced tools for legal practice"
    }
  };

  const t = texts[language];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className={`flex items-center gap-4 mb-6 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* AI Legal Suite */}
        <AILegalSuite language={language} />
      </div>
    </div>
  );
};

export default AILegalTools;
