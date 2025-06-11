
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, CreditCard, Plus, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethods } from './PaymentMethods';
import { VoucherRedemption } from './VoucherRedemption';

interface UserBalanceData {
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'subscription';
  description: string;
  created_at: string;
  status: string;
  stripe_payment_id?: string;
}

export const UserBalance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [topUpAmount, setTopUpAmount] = useState('');

  const { data: balance } = useQuery({
    queryKey: ['user-balance'],
    queryFn: async (): Promise<UserBalanceData> => {
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

  const { data: transactions } = useQuery({
    queryKey: ['user-transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase.rpc('get_user_transactions', { 
        p_user_id: user.id, 
        p_limit: 10 
      });

      if (error) {
        console.error('Transactions fetch error:', error);
        return [];
      }
      return (data || []).map(transaction => ({
        ...transaction,
        type: transaction.type as 'deposit' | 'withdrawal' | 'subscription'
      }));
    }
  });

  const topUpMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('add_user_balance', { 
        p_user_id: user.id, 
        p_amount: amount, 
        p_description: `إيداع رصيد - ${amount} ريال`
      });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-balance'] });
      queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
      setTopUpAmount('');
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الرصيد بنجاح",
      });
    },
    onError: (error) => {
      console.error('Top up error:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الرصيد",
        variant: "destructive",
      });
    }
  });

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }
    topUpMutation.mutate(amount);
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'withdrawal':
      case 'subscription':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionSign = (type: string) => {
    switch (type) {
      case 'deposit':
        return '+';
      case 'withdrawal':
      case 'subscription':
        return '-';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            الرصيد الحالي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">
              {balance?.balance?.toFixed(2) || '0.00'} {balance?.currency || 'ريال'}
            </p>
            <p className="text-gray-600 mt-2">الرصيد المتاح في حسابك</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            طرق الدفع
          </TabsTrigger>
          <TabsTrigger value="voucher" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            كوبون الشحن
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            السجل
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment">
          <PaymentMethods />
        </TabsContent>
        
        <TabsContent value="voucher">
          <VoucherRedemption />
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                سجل المعاملات
              </CardTitle>
              <CardDescription>آخر المعاملات المالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction: Transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                          {getTransactionSign(transaction.type)}{Math.abs(transaction.amount).toFixed(2)} ريال
                        </p>
                        <Badge 
                          variant={transaction.type === 'deposit' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {transaction.type === 'deposit' ? 'إيداع' : 
                           transaction.type === 'withdrawal' ? 'سحب' : 'اشتراك'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">لا توجد معاملات</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
