
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoucherRedemptionProps {
  language?: 'ar' | 'en';
}

export const VoucherRedemption = ({ language = 'ar' }: VoucherRedemptionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [voucherCode, setVoucherCode] = useState('');

  const redeemMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('redeem_voucher', {
        p_code: code,
        p_user_id: user.id
      });

      if (error) throw error;
      return data[0];
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['user-balance'] });
        queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
        setVoucherCode('');
        toast({
          title: language === 'ar' ? "تم تفعيل الكوبون بنجاح" : "Voucher Activated Successfully",
          description: `${language === 'ar' ? 'تم إضافة' : 'Added'} ${result.amount} ${language === 'ar' ? 'ريال إلى رصيدك' : 'SAR to your balance'}`,
        });
      } else {
        toast({
          title: language === 'ar' ? "خطأ في تفعيل الكوبون" : "Voucher Activation Error",
          description: result.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "حدث خطأ في تفعيل الكوبون" : "An error occurred while activating the voucher",
        variant: "destructive",
      });
    }
  });

  const handleRedeem = () => {
    if (!voucherCode.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال كود الكوبون" : "Please enter the voucher code",
        variant: "destructive",
      });
      return;
    }

    redeemMutation.mutate(voucherCode.trim());
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="voucher-code" className="text-base font-semibold text-blue-900 flex items-center gap-2">
          <Gift className="h-4 w-4" />
          {language === 'ar' ? 'كود الكوبون' : 'Voucher Code'}
        </Label>
        <Input
          id="voucher-code"
          type="text"
          placeholder={language === 'ar' ? 'أدخل كود الكوبون (مثال: VC-ABC12345)' : 'Enter voucher code (e.g., VC-ABC12345)'}
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
          className="h-14 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-center text-lg font-mono tracking-wider"
        />
      </div>

      <Button 
        onClick={handleRedeem}
        disabled={redeemMutation.isPending || !voucherCode.trim()}
        className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg font-bold text-lg rounded-xl"
      >
        {redeemMutation.isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin ml-2" />
            {language === 'ar' ? 'جاري التفعيل...' : 'Activating...'}
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5 ml-2" />
            {language === 'ar' ? 'تفعيل الكوبون' : 'Activate Voucher'}
          </>
        )}
      </Button>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
        <h4 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {language === 'ar' ? 'تعليمات استخدام الكوبون:' : 'Voucher Usage Instructions:'}
        </h4>
        <ul className="space-y-3 text-blue-700">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>
              {language === 'ar' 
                ? 'تأكد من إدخال كود الكوبون بشكل صحيح'
                : 'Make sure to enter the voucher code correctly'
              }
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>
              {language === 'ar' 
                ? 'يمكن استخدام كل كوبون مرة واحدة فقط'
                : 'Each voucher can only be used once'
              }
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>
              {language === 'ar' 
                ? 'تحقق من تاريخ انتهاء صلاحية الكوبون'
                : 'Check the voucher expiration date'
              }
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>
              {language === 'ar' 
                ? 'سيتم إضافة قيمة الكوبون إلى رصيدك فوراً عند التفعيل'
                : 'The voucher value will be added to your balance immediately upon activation'
              }
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
