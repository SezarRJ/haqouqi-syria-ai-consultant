
import React, { useState, useEffect } from 'react';
import { UserBalance } from '@/components/UserBalance';
import { BackButton } from '@/components/BackButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft, Plus, Wallet, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface BalancePageProps {
  language?: 'ar' | 'en';
}

const BalancePage = ({ language: propLanguage }: BalancePageProps) => {
  const navigate = useNavigate();
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

  const { data: balance } = useQuery({
    queryKey: ['user-balance'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { balance: 0, currency: 'SAR' };

      const { data, error } = await supabase.rpc('get_user_balance', { 
        p_user_id: user.id 
      });

      if (error) {
        console.error('Balance fetch error:', error);
        return { balance: 0, currency: 'SAR' };
      }
      
      return data?.[0] || { balance: 0, currency: 'SAR' };
    }
  });

  const texts = {
    ar: {
      currentBalance: 'الرصيد الحالي',
      balanceDescription: 'إدارة رصيدك وحسابك المالي',
      totalDeposits: 'إجمالي الإيداعات',
      totalExpenses: 'إجمالي المصروفات',
      totalTransactions: 'عدد المعاملات',
      recentActivity: 'النشاط الأخير',
      recentDescription: 'آخر 5 معاملات مالية',
      financialTransaction: 'معاملة مالية',
      currency: 'ريال',
      addBalance: 'إضافة رصيد',
      paymentMethods: 'طرق الدفع',
      quickActions: 'الإجراءات السريعة',
      viewHistory: 'عرض السجل الكامل',
      managePayments: 'إدارة طرق الدفع'
    },
    en: {
      currentBalance: 'Current Balance',
      balanceDescription: 'Manage your balance and financial account',
      totalDeposits: 'Total Deposits',
      totalExpenses: 'Total Expenses',
      totalTransactions: 'Total Transactions',
      recentActivity: 'Recent Activity',
      recentDescription: 'Your last 5 financial transactions',
      financialTransaction: 'Financial Transaction',
      currency: 'SAR',
      addBalance: 'Add Balance',
      paymentMethods: 'Payment Methods',
      quickActions: 'Quick Actions',
      viewHistory: 'View Full History',
      managePayments: 'Manage Payment Methods'
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

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{t.currentBalance}</h1>
            <p className="text-blue-600">{t.balanceDescription}</p>
          </div>

          {/* Current Balance Display */}
          <Card className="border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-5xl font-bold text-blue-700 mb-2">
                {(balance?.balance || 0).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t.currency}
              </div>
              <p className="text-blue-600 text-lg">{t.balanceDescription}</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-900">{t.quickActions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate('/voucher')}
                  className="flex items-center gap-2 h-12"
                >
                  <Plus className="h-4 w-4" />
                  {t.addBalance}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/payment-methods')}
                  className="flex items-center gap-2 h-12"
                >
                  <CreditCard className="h-4 w-4" />
                  {t.paymentMethods}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/history')}
                  className="flex items-center gap-2 h-12"
                >
                  <TrendingUp className="h-4 w-4" />
                  {t.viewHistory}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-green-50 border-green-200">
              <div className="flex items-center justify-center mb-4">
                <ArrowDownLeft className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 font-medium mb-2">{t.totalDeposits}</p>
              <p className="text-3xl font-bold text-green-700">
                {recentTransactions?.filter(t => ['deposit', 'payment', 'voucher'].includes(t.type))
                  .reduce((sum, t) => sum + t.amount, 0).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US') || '0'} 
                {' '}{t.currency}
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-red-50 border-red-200">
              <div className="flex items-center justify-center mb-4">
                <ArrowUpRight className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-sm text-red-600 font-medium mb-2">{t.totalExpenses}</p>
              <p className="text-3xl font-bold text-red-700">
                {recentTransactions?.filter(t => ['withdrawal', 'usage'].includes(t.type))
                  .reduce((sum, t) => sum + t.amount, 0).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US') || '0'} 
                {' '}{t.currency}
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium mb-2">{t.totalTransactions}</p>
              <p className="text-3xl font-bold text-blue-700">
                {recentTransactions?.length || 0}
              </p>
            </Card>
          </div>

          {/* User Balance Component */}
          <UserBalance />
        </div>
      </div>
    </div>
  );
};

export default BalancePage;
