
import React, { useState, useEffect } from 'react';
import { VoucherRedemption } from '@/components/VoucherRedemption';
import { BackButton } from '@/components/BackButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

interface VoucherPageProps {
  language?: 'ar' | 'en';
}

const VoucherPage = ({ language: propLanguage }: VoucherPageProps) => {
  const [language, setLanguage] = useState<'ar' | 'en'>(propLanguage || 'ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const texts = {
    ar: {
      title: 'كوبون الشحن',
      description: 'أدخل كود الكوبون لشحن رصيدك'
    },
    en: {
      title: 'Voucher Redemption',
      description: 'Enter voucher code to add balance to your account'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <BackButton />
          <LanguageSwitcher 
            language={language} 
            onLanguageChange={handleLanguageChange}
          />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Gift className="h-4 w-4 text-white" />
                </div>
                {t.title}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {t.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <VoucherRedemption language={language} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoucherPage;
