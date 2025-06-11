
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export const VoucherRedemption = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
      return data?.[0];
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['user-balance'] });
        queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
        setVoucherCode('');
        toast({
          title: "تم الاستخدام بنجاح!",
          description: `تم إضافة ${result.amount} ريال إلى رصيدك`,
        });
      } else {
        toast({
          title: "خطأ",
          description: result?.message || "رمز الكوبون غير صحيح",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء استخدام الكوبون",
        variant: "destructive",
      });
    }
  });

  const handleRedeem = () => {
    if (!voucherCode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رمز الكوبون",
        variant: "destructive",
      });
      return;
    }

    redeemMutation.mutate(voucherCode.trim().toUpperCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          استخدام كوبون الشحن
        </CardTitle>
        <CardDescription>أدخل رمز الكوبون لشحن رصيدك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="voucher-code">رمز الكوبون</Label>
          <Input
            id="voucher-code"
            placeholder="VC-XXXXXXXX"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            maxLength={20}
          />
        </div>

        <Button 
          onClick={handleRedeem}
          disabled={redeemMutation.isPending}
          className="w-full"
          size={isMobile ? "lg" : "default"}
        >
          {redeemMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              جاري التحقق...
            </>
          ) : (
            'استخدام الكوبون'
          )}
        </Button>

        <div className="text-sm text-muted-foreground">
          <p>• يجب أن يكون رمز الكوبون صحيحاً وغير مستخدم مسبقاً</p>
          <p>• سيتم إضافة قيمة الكوبون إلى رصيدك فوراً</p>
        </div>
      </CardContent>
    </Card>
  );
};
