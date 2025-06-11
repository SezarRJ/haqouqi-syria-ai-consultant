
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building, Gift, Loader2 } from 'lucide-react';
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
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="mr-2">جاري التحميل...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          طرق الدفع
        </CardTitle>
        <CardDescription>اختر طريقة الدفع المناسبة لك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ (ريال سعودي)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">طريقة الدفع</Label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods?.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(method.type)}
                      <span>{method.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">رقم المرجع / رقم التحويل</Label>
            <Input
              id="reference"
              placeholder="أدخل رقم المرجع أو رقم التحويل"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          <Button 
            onClick={handlePayment}
            disabled={paymentMutation.isPending}
            className="w-full"
            size={isMobile ? "lg" : "default"}
          >
            {paymentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جاري المعالجة...
              </>
            ) : (
              'إرسال طلب الدفع'
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">تعليمات الدفع:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>التحويل البنكي:</strong> أرسل المبلغ إلى الحساب المحدد وأدخل رقم التحويل
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>البطاقة الائتمانية:</strong> ادفع عبر نظام الدفع الآمن
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Gift className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>كرت الشحن:</strong> أدخل رقم كرت الشحن في خانة رقم المرجع
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
