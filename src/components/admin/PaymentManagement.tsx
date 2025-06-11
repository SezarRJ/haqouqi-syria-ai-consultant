
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, CreditCard, Gift, Calendar, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentRecord {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  reference_number: string;
  created_at: string;
  payment_method: {
    name: string;
    type: string;
  };
}

export const PaymentManagement = () => {
  const isMobile = useIsMobile();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async (): Promise<PaymentRecord[]> => {
      const { data, error } = await supabase
        .from('payment_records')
        .select(`
          *,
          payment_method:payment_methods(name, type)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    }
  });

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return <Building className="h-4 w-4" />;
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'scratch_card':
        return <Gift className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد المراجعة';
      case 'failed':
        return 'فشل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          إدارة المدفوعات
        </CardTitle>
        <CardDescription>عرض ومراجعة جميع المعاملات المالية</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : payments && payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className={`border rounded-lg p-4 ${isMobile ? 'space-y-3' : ''}`}>
                <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}>
                  <div className={`${isMobile ? 'space-y-2' : 'flex items-center gap-4'}`}>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(payment.payment_method?.type)}
                      <span className="font-medium">{payment.payment_method?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">{payment.amount} {payment.currency}</span>
                      <Badge variant={getStatusColor(payment.status)}>
                        {getStatusText(payment.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className={`text-sm text-muted-foreground ${isMobile ? 'space-y-1' : 'text-right'}`}>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(payment.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">{payment.user_id}</span>
                    </div>
                  </div>
                </div>
                
                {payment.description && (
                  <div className="text-sm text-muted-foreground">
                    <strong>الوصف:</strong> {payment.description}
                  </div>
                )}
                
                {payment.reference_number && (
                  <div className="text-sm">
                    <strong>رقم المرجع:</strong> 
                    <code className="bg-gray-100 px-2 py-1 rounded mr-2 text-xs">
                      {payment.reference_number}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد معاملات مالية
          </div>
        )}
      </CardContent>
    </Card>
  );
};
