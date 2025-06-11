
import React from 'react';
import { VoucherRedemption } from '@/components/VoucherRedemption';
import { BackButton } from '@/components/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

interface VoucherPageProps {
  language?: 'ar' | 'en';
}

const VoucherPage = ({ language = 'ar' }: VoucherPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Gift className="h-4 w-4 text-white" />
                </div>
                {language === 'ar' ? 'كوبون الشحن' : 'Voucher Redemption'}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {language === 'ar' 
                  ? 'أدخل كود الكوبون لشحن رصيدك' 
                  : 'Enter voucher code to add balance to your account'
                }
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
