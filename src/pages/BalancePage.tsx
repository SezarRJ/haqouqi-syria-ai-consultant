
import React, { useState, useEffect } from 'react';
import { UserBalance } from '@/components/UserBalance';
import { BackButton } from '@/components/BackButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BalancePageProps {
  language?: 'ar' | 'en';
}

const BalancePage = ({ language: propLanguage }: BalancePageProps) => {
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

  const { data: recentTransactions } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_transaction_history', {
        p_user_id: user.id,
        p_limit: 5
      });

      if (error) throw error;
      return data || [];
    }
  });

  const texts = {
    ar: {
      currentBalance: 'الرصيد الحالي',
      balanceDescription: 'عرض رصيدك الحالي ونشاطك المالي',
      totalDeposits: 'إجمالي الإيداعات',
      totalExpenses: 'إجمالي المصروفات',
      totalTransactions: 'عدد المعاملات',
      recentActivity: 'النشاط الأخير',
      recentDescription: 'آخر 5 معاملات مالية',
      financialTransaction: 'معاملة مالية',
      currency: 'ريال'
    },
    en: {
      currentBalance: 'Current Balance',
      balanceDescription: 'View your current balance and financial activity',
      totalDeposits: 'Total Deposits',
      totalExpenses: 'Total Expenses',
      totalTransactions: 'Total Transactions',
      recentActivity: 'Recent Activity',
      recentDescription: 'Your last 5 financial transactions',
      financialTransaction: 'Financial Transaction',
      currency: 'SAR'
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
            variant="compact"
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Balance Overview */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                {t.currentBalance}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {t.balanceDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-6">
                <UserBalance />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <ArrowDownLeft className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600 font-medium">{t.totalDeposits}</p>
                  <p className="text-2xl font-bold text-green-700">
                    {recentTransactions?.filter(t => ['deposit', 'payment', 'voucher'].includes(t.type))
                      .reduce((sum, t) => sum + t.amount, 0).toFixed(2) || '0.00'} 
                    {' '}{t.currency}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-center mb-2">
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-medium">{t.totalExpenses}</p>
                  <p className="text-2xl font-bold text-red-700">
                    {recentTransactions?.filter(t => ['withdrawal', 'usage'].includes(t.type))
                      .reduce((sum, t) => sum + t.amount, 0).toFixed(2) || '0.00'} 
                    {' '}{t.currency}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600 font-medium">{t.totalTransactions}</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {recentTransactions?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {recentTransactions && recentTransactions.length > 0 && (
            <Card className="border-blue-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-blue-900">{t.recentActivity}</CardTitle>
                <CardDescription className="text-blue-600">
                  {t.recentDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description || t.financialTransaction}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                      <div className={`font-semibold ${
                        ['deposit', 'payment', 'voucher'].includes(transaction.type) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {['deposit', 'payment', 'voucher'].includes(transaction.type) ? '+' : '-'}
                        {transaction.amount.toFixed(2)} {t.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalancePage;
