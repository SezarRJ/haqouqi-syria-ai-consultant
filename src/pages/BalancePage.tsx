
import React from 'react';
import { UserBalance } from '@/components/UserBalance';
import { BackButton } from '@/components/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BalancePageProps {
  language?: 'ar' | 'en';
}

const BalancePage = ({ language = 'ar' }: BalancePageProps) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Balance Overview */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                {language === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {language === 'ar' 
                  ? 'عرض رصيدك الحالي ونشاطك المالي' 
                  : 'View your current balance and financial activity'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-6">
                <UserBalance showLabel={false} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <ArrowDownLeft className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    {language === 'ar' ? 'إجمالي الإيداعات' : 'Total Deposits'}
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {recentTransactions?.filter(t => ['deposit', 'payment', 'voucher'].includes(t.type))
                      .reduce((sum, t) => sum + t.amount, 0).toFixed(2) || '0.00'} 
                    {language === 'ar' ? ' ريال' : ' SAR'}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-center mb-2">
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-medium">
                    {language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {recentTransactions?.filter(t => ['withdrawal', 'usage'].includes(t.type))
                      .reduce((sum, t) => sum + t.amount, 0).toFixed(2) || '0.00'} 
                    {language === 'ar' ? ' ريال' : ' SAR'}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600 font-medium">
                    {language === 'ar' ? 'عدد المعاملات' : 'Total Transactions'}
                  </p>
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
                <CardTitle className="text-blue-900">
                  {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                </CardTitle>
                <CardDescription className="text-blue-600">
                  {language === 'ar' 
                    ? 'آخر 5 معاملات مالية' 
                    : 'Your last 5 financial transactions'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description || (language === 'ar' ? 'معاملة مالية' : 'Financial Transaction')}
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
                        {transaction.amount.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
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
