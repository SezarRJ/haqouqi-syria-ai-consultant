
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExplanationModeToggle } from '@/components/ExplanationModeToggle';
import { useNavigate } from 'react-router-dom';

const ExplanationsPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const texts = {
    ar: {
      title: 'الشروحات القانونية',
      description: 'شروحات مفصلة للمفاهيم والنصوص القانونية',
      backToHome: 'العودة للرئيسية'
    },
    en: {
      title: 'Legal Explanations',
      description: 'Detailed explanations of legal concepts and texts',
      backToHome: 'Back to Home'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
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
            <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="border-amber-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <CardTitle className="flex items-center gap-3 text-amber-900">
              <BookOpen className="h-5 w-5" />
              {t.title}
            </CardTitle>
            <CardDescription className="text-amber-600">
              {t.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ExplanationModeToggle language={language} content="Sample legal content for explanation" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExplanationsPage;
