
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, Plus, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'subscription';
  description: string;
  created_at: string;
}

export const UserBalance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [topUpAmount, setTopUpAmount] = useState('');

  // Mock balance data - in real implementation, this would come from your database
  const { data: balance } = useQuery({
    queryKey: ['user-balance'],
    queryFn: async () => {
      // Mock data - replace with actual database query
      return {
        current: 150.00,
        currency: 'SAR'
      };
    }
  });

  const { data: transactions } = useQuery({
    queryKey: ['user-transactions'],
    queryFn: async () => {
      // Mock data - replace with actual database query
      return [
        {
          id: '1',
          amount: 100.00,
          type: 'deposit',
          description: 'إيداع رصيد',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          amount: -50.00,
          type: 'subscription',
          description: 'اشتراك شهري - الخطة المتقدمة',
          created_at: '2024-01-10T09:00:00Z'
        }
      ] as Transaction[];
    }
  });

  const topUpMutation = useMutation({
    mutationFn: async (amount: number) => {
      // Mock payment processing - integrate with actual payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, newBalance: (balance?.current || 0) + amount };
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
    onError: () => {
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
              {balance?.current?.toFixed(2) || '0.00'} {balance?.currency || 'SAR'}
            </p>
            <p className="text-gray-600 mt-2">الرصيد المتاح في حسابك</p>
          </div>
        </CardContent>
      </Card>

      {/* Top Up */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            شحن الرصيد
          </CardTitle>
          <CardDescription>أضف رصيد إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="أدخل المبلغ"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleTopUp}
              disabled={topUpMutation.isPending}
              className="flex items-center gap-2"
            >
              {topUpMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  شحن الرصيد
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 200].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => setTopUpAmount(amount.toString())}
                className="text-sm"
              >
                {amount} ريال
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
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
            {transactions?.map((transaction) => (
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
            ))}
            {(!transactions || transactions.length === 0) && (
              <p className="text-gray-500 text-center py-4">لا توجد معاملات</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
