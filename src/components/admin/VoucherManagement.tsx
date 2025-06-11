
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, Plus, Calendar, User, CheckCircle, XCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Voucher {
  id: string;
  code: string;
  amount: number;
  currency: string;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export const VoucherManagement = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [expiryDays, setExpiryDays] = useState('30');

  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['admin-vouchers'],
    queryFn: async (): Promise<Voucher[]> => {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    }
  });

  const createVoucherMutation = useMutation({
    mutationFn: async ({ amount, expiryDays }: { amount: number; expiryDays: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const expiresAt = expiryDays > 0 
        ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data, error } = await supabase.rpc('create_voucher', {
        p_amount: amount,
        p_expires_at: expiresAt,
        p_created_by: user.id
      });

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
      setAmount('');
      setExpiryDays('30');
      toast({
        title: "تم إنشاء الكوبون!",
        description: `رمز الكوبون: ${result?.voucher_code}`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الكوبون",
        variant: "destructive",
      });
    }
  });

  const handleCreateVoucher = () => {
    const amountNum = parseFloat(amount);
    const expiryNum = parseInt(expiryDays);

    if (!amountNum || amountNum <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    if (expiryNum < 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عدد أيام صحيح",
        variant: "destructive",
      });
      return;
    }

    createVoucherMutation.mutate({ amount: amountNum, expiryDays: expiryNum });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رمز الكوبون",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Voucher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء كوبون جديد
          </CardTitle>
          <CardDescription>قم بإنشاء كوبونات شحن للعملاء</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="space-y-2">
              <Label htmlFor="voucher-amount">قيمة الكوبون (ريال سعودي)</Label>
              <Input
                id="voucher-amount"
                type="number"
                placeholder="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry-days">مدة الصلاحية (أيام)</Label>
              <Input
                id="expiry-days"
                type="number"
                placeholder="30"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <Button 
            onClick={handleCreateVoucher}
            disabled={createVoucherMutation.isPending}
            className="w-full"
          >
            {createVoucherMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء كوبون'}
          </Button>
        </CardContent>
      </Card>

      {/* Vouchers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            قائمة الكوبونات
          </CardTitle>
          <CardDescription>إدارة كوبونات الشحن</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : vouchers && vouchers.length > 0 ? (
            <div className="space-y-4">
              {vouchers.map((voucher) => (
                <div key={voucher.id} className={`border rounded-lg p-4 ${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}>
                  <div className={`${isMobile ? 'space-y-2' : 'flex items-center gap-4'}`}>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {voucher.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(voucher.code)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{voucher.amount} {voucher.currency}</span>
                      <Badge variant={voucher.is_used ? "secondary" : "default"}>
                        {voucher.is_used ? (
                          <><CheckCircle className="h-3 w-3 ml-1" /> مستخدم</>
                        ) : (
                          <><XCircle className="h-3 w-3 ml-1" /> غير مستخدم</>
                        )}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className={`text-sm text-muted-foreground ${isMobile ? 'space-y-1' : ''}`}>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>أنشئ: {formatDate(voucher.created_at)}</span>
                    </div>
                    {voucher.expires_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>ينتهي: {formatDate(voucher.expires_at)}</span>
                      </div>
                    )}
                    {voucher.is_used && voucher.used_at && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>استُخدم: {formatDate(voucher.used_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد كوبونات
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
