
import React, { useState, useEffect } from 'react';
import { PaymentMethods as PaymentMethodsComponent } from '@/components/PaymentMethods';
import { BackButton } from '@/components/BackButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface PaymentMethodsPageProps {
  language?: 'ar' | 'en';
}

const PaymentMethodsPage = ({ language: propLanguage }: PaymentMethodsPageProps) => {
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
        <PaymentMethodsComponent language={language} />
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
