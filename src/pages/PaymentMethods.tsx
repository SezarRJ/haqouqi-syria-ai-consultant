
import React from 'react';
import { PaymentMethods as PaymentMethodsComponent } from '@/components/PaymentMethods';
import { BackButton } from '@/components/BackButton';

interface PaymentMethodsPageProps {
  language?: 'ar' | 'en';
}

const PaymentMethodsPage = ({ language = 'ar' }: PaymentMethodsPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <PaymentMethodsComponent language={language} />
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
