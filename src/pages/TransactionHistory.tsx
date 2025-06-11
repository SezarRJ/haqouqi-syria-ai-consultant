
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, ArrowUpRight, ArrowDownLeft, CreditCard, Gift } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  created_at: string;
  payment_method: string;
  reference_number: string;
}

interface TransactionHistoryProps {
  language?: 'ar' | 'en';
}

const TransactionHistory = ({ language = 'ar' }: TransactionHistoryProps) => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transaction-history'],
    queryFn: async (): Promise<Transaction[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_transaction_history', {
        p_user_id: user.id,
        p_limit: 50
      });

      if (error) throw error;
      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'ar') {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'pending': return 'قيد المعالجة';
        case 'failed': return 'فشل';
        case 'cancelled': return 'ملغي';
        default: return status;
      }
    }
    return status;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
      case 'usage':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'voucher':
        return <Gift className="h-4 w-4 text-purple-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-blue-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-blue-900">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <History className="h-4 w-4 text-white" />
              </div>
              {language === 'ar' ? 'سجل المعاملات' : 'Transaction History'}
            </CardTitle>
            <CardDescription className="text-blue-600">
              {language === 'ar' 
                ? 'عرض جميع معاملاتك المالية وحركات الرصيد' 
                : 'View all your financial transactions and balance movements'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!transactions || transactions.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'ar' ? 'لا توجد معاملات' : 'No Transactions'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ar' 
                    ? 'لم تقم بأي معاملات مالية حتى الآن' 
                    : 'You haven\'t made any financial transactions yet'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.description || (language === 'ar' ? 'معاملة مالية' : 'Financial Transaction')}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>
                            {format(new Date(transaction.created_at), 'PPp', { 
                              locale: language === 'ar' ? ar : undefined 
                            })}
                          </span>
                          {transaction.payment_method && (
                            <>
                              <span>•</span>
                              <span>{transaction.payment_method}</span>
                            </>
                          )}
                          {transaction.reference_number && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-xs">
                                {language === 'ar' ? 'المرجع:' : 'Ref:'} {transaction.reference_number}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'deposit' || transaction.type === 'payment' || transaction.type === 'voucher'
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'payment' || transaction.type === 'voucher' ? '+' : '-'}
                          {transaction.amount.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                        </div>
                        <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionHistory;
