
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
    return new Date(dateString).toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'SYP') => {
    return `${amount.toLocaleString('ar-SY')} ل.س`;
  };

  return (
    <div dir="rtl">
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-3 text-blue-900">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            إدارة المدفوعات
          </CardTitle>
          <CardDescription className="text-blue-600">عرض ومراجعة جميع المعاملات المالية</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-blue-600 font-medium">جاري التحميل...</p>
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className={`border border-blue-100 rounded-lg p-4 bg-blue-50/30 hover:bg-blue-50/50 transition-colors ${isMobile ? 'space-y-3' : ''}`}>
                  <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}>
                    <div className={`${isMobile ? 'space-y-2' : 'flex items-center gap-4'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getPaymentIcon(payment.payment_method?.type)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{payment.payment_method?.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xl font-bold text-blue-700">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                            <Badge variant={getStatusColor(payment.status)} className="text-xs">
                              {getStatusText(payment.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-sm text-muted-foreground ${isMobile ? 'space-y-1' : 'text-left'}`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        <span>{formatDate(payment.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-blue-500" />
                        <span className="truncate max-w-[200px] font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {payment.user_id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {payment.description && (
                    <div className="text-sm text-muted-foreground bg-white p-3 rounded border border-blue-100">
                      <strong className="text-blue-700">الوصف:</strong> {payment.description}
                    </div>
                  )}
                  
                  {payment.reference_number && (
                    <div className="text-sm">
                      <strong className="text-blue-700">رقم المرجع:</strong> 
                      <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-xs font-mono">
                        {payment.reference_number}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد معاملات مالية</h3>
              <p className="text-gray-500">ستظهر المعاملات هنا عند إجرائها</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
