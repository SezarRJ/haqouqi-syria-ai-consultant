
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CaseAnalysisEngine } from '@/components/ai/CaseAnalysisEngine';
import { useNavigate } from 'react-router-dom';

const CaseAnalysisPage = () => {
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
      title: 'محرك تحليل القضايا',
      description: 'تحليل متقدم للقضايا القانونية والسوابق القضائية',
      backToHome: 'العودة للرئيسية'
    },
    en: {
      title: 'Case Analysis Engine',
      description: 'Advanced analysis of legal cases and precedents',
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
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="border-indigo-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <CardTitle className="flex items-center gap-3 text-indigo-900">
              <BarChart3 className="h-5 w-5" />
              {t.title}
            </CardTitle>
            <CardDescription className="text-indigo-600">
              {t.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <CaseAnalysisEngine language={language} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseAnalysisPage;
