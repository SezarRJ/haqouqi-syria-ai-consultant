
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Building, Gift, Loader2, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
}

export const PaymentMethods = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async (): Promise<PaymentMethod[]> => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  const paymentMutation = useMutation({
    mutationFn: async ({ amount, methodId, referenceNumber }: { amount: number; methodId: string; referenceNumber: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('payment_records')
        .insert({
          user_id: user.id,
          payment_method_id: methodId,
          amount,
          reference_number: referenceNumber,
          description: `Payment via ${paymentMethods?.find(m => m.id === methodId)?.name}`,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-balance'] });
      queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
      setAmount('');
      setReferenceNumber('');
      setSelectedMethod('');
      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلب الدفع بنجاح وسيتم مراجعته قريباً",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في إرسال طلب الدفع",
        variant: "destructive",
      });
    }
  });

  const handlePayment = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMethod) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار طريقة الدفع",
        variant: "destructive",
      });
      return;
    }

    if (!referenceNumber.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم المرجع",
        variant: "destructive",
      });
      return;
    }

    paymentMutation.mutate({ 
      amount: amountNum, 
      methodId: selectedMethod, 
      referenceNumber: referenceNumber.trim() 
    });
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return <Building className="h-5 w-5" />;
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'scratch_card':
        return <Gift className="h-5 w-5" />;
      default:
        return <Banknote className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="mr-2 text-blue-700">جاري التحميل...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-3 text-blue-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          طرق الدفع
        </CardTitle>
        <CardDescription className="text-blue-600">اختر طريقة الدفع المناسبة لشحن رصيدك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-5">
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-blue-900">المبلغ (ريال سعودي)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="payment-method" className="text-sm font-semibold text-blue-900">طريقة الدفع</Label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods?.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-3">
                      {getPaymentIcon(method.type)}
                      <span>{method.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="reference" className="text-sm font-semibold text-blue-900">رقم المرجع / رقم التحويل</Label>
            <Input
              id="reference"
              placeholder="أدخل رقم المرجع أو رقم التحويل"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="h-11 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right"
            />
          </div>

          <Button 
            onClick={handlePayment}
            disabled={paymentMutation.isPending}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg font-semibold"
            size={isMobile ? "lg" : "default"}
          >
            {paymentMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin ml-2" />
                جاري المعالجة...
              </>
            ) : (
              'إرسال طلب الدفع'
            )}
          </Button>
        </div>

        <div className="space-y-4 mt-8">
          <h4 className="font-semibold text-blue-900 text-lg">تعليمات الدفع:</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Building className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">التحويل البنكي</p>
                <p className="text-sm text-blue-700 mt-1">أرسل المبلغ إلى الحساب المحدد وأدخل رقم التحويل</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <CreditCard className="h-5 w-5 mt-0.5 flex-shrink-0 text-indigo-600" />
              <div>
                <p className="font-medium text-indigo-900">البطاقة الائتمانية</p>
                <p className="text-sm text-indigo-700 mt-1">ادفع عبر نظام الدفع الآمن</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <Gift className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
              <div>
                <p className="font-medium text-green-900">كرت الشحن</p>
                <p className="text-sm text-green-700 mt-1">أدخل رقم كرت الشحن في خانة رقم المرجع</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
