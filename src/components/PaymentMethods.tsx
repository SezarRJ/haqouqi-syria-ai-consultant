
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Building, Gift, Loader2, Banknote, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
}

interface PaymentMethodsProps {
  language?: 'ar' | 'en';
}

export const PaymentMethods = ({ language = 'ar' }: PaymentMethodsProps) => {
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
          description: `${language === 'ar' ? 'دفع عبر' : 'Payment via'} ${paymentMethods?.find(m => m.id === methodId)?.name}`,
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
        title: language === 'ar' ? "تم إرسال الطلب" : "Request Sent",
        description: language === 'ar' ? "تم إرسال طلب الدفع بنجاح وسيتم مراجعته قريباً" : "Payment request sent successfully and will be reviewed soon",
      });
    },
    onError: (error) => {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "فشل في إرسال طلب الدفع" : "Failed to send payment request",
        variant: "destructive",
      });
    }
  });

  const handlePayment = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال مبلغ صحيح" : "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMethod) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى اختيار طريقة الدفع" : "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    if (!referenceNumber.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال رقم المرجع" : "Please enter reference number",
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

  const getPaymentMethodName = (method: PaymentMethod) => {
    if (language === 'en') {
      switch (method.type) {
        case 'bank_transfer': return 'Bank Transfer';
        case 'credit_card': return 'Credit Card';
        case 'scratch_card': return 'Scratch Card';
        default: return method.name;
      }
    }
    
    switch (method.type) {
      case 'bank_transfer': return 'تحويل بنكي';
      case 'credit_card': return 'بطاقة ائتمانية';
      case 'scratch_card': return 'كرت شحن';
      default: return method.name;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="mr-2 text-blue-700">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 shadow-lg max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-3 text-blue-900">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          {language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}
        </CardTitle>
        <CardDescription className="text-blue-600 text-base">
          {language === 'ar' 
            ? 'اختر طريقة الدفع المناسبة لشحن رصيدك بسهولة وأمان' 
            : 'Choose the appropriate payment method to top up your balance easily and securely'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <div className="grid gap-6">
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-base font-semibold text-blue-900 flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              {language === 'ar' ? 'المبلغ (ريال سعودي)' : 'Amount (Saudi Riyal)'}
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder={language === 'ar' ? 'أدخل المبلغ' : 'Enter amount'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              className="h-14 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right text-lg font-medium"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="payment-method" className="text-base font-semibold text-blue-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
            </Label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="h-14 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder={language === 'ar' ? 'اختر طريقة الدفع' : 'Select payment method'} />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods?.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-3">
                      {getPaymentIcon(method.type)}
                      <span className="font-medium">{getPaymentMethodName(method)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="reference" className="text-base font-semibold text-blue-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {language === 'ar' ? 'رقم المرجع / رقم التحويل' : 'Reference Number / Transfer Number'}
            </Label>
            <Input
              id="reference"
              placeholder={language === 'ar' ? 'أدخل رقم المرجع أو رقم التحويل' : 'Enter reference or transfer number'}
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="h-14 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right text-lg"
            />
          </div>

          <Button 
            onClick={handlePayment}
            disabled={paymentMutation.isPending}
            className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl font-bold text-lg rounded-xl transition-all duration-200 hover:shadow-2xl"
            size={isMobile ? "lg" : "default"}
          >
            {paymentMutation.isPending ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin ml-2" />
                {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6 ml-2" />
                {language === 'ar' ? 'إرسال طلب الدفع' : 'Send Payment Request'}
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6 mt-10">
          <h4 className="font-bold text-blue-900 text-xl flex items-center gap-2">
            <Building className="h-5 w-5" />
            {language === 'ar' ? 'تعليمات الدفع:' : 'Payment Instructions:'}
          </h4>
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-blue-900 text-lg mb-2">
                  {language === 'ar' ? 'التحويل البنكي' : 'Bank Transfer'}
                </p>
                <p className="text-blue-700 leading-relaxed">
                  {language === 'ar' 
                    ? 'قم بتحويل المبلغ إلى الحساب البنكي المحدد وأدخل رقم التحويل في الخانة المخصصة'
                    : 'Transfer the amount to the specified bank account and enter the transfer number in the designated field'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-xl border-2 border-indigo-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-indigo-900 text-lg mb-2">
                  {language === 'ar' ? 'البطاقة الائتمانية' : 'Credit Card'}
                </p>
                <p className="text-indigo-700 leading-relaxed">
                  {language === 'ar' 
                    ? 'ادفع عبر نظام الدفع الآمن باستخدام بطاقتك الائتمانية أو مدى'
                    : 'Pay through the secure payment system using your credit card or debit card'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-900 text-lg mb-2">
                  {language === 'ar' ? 'كرت الشحن' : 'Scratch Card'}
                </p>
                <p className="text-green-700 leading-relaxed">
                  {language === 'ar' 
                    ? 'قم بشراء كرت الشحن وأدخل الرقم السري في خانة رقم المرجع'
                    : 'Purchase a scratch card and enter the secret number in the reference number field'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
