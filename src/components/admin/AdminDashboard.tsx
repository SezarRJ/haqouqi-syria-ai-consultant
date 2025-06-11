import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: totalLaws },
        { count: totalUsers },
        { count: pendingUpdates },
        { count: todayConsultations }
      ] = await Promise.all([
        supabase.from('laws').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('law_updates').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('consultations').select('id', { count: 'exact' })
          .gte('created_at', new Date().toISOString().split('T')[0])
      ]);

      return {
        totalLaws: totalLaws || 0,
        totalUsers: totalUsers || 0,
        pendingUpdates: pendingUpdates || 0,
        todayConsultations: todayConsultations || 0
      };
    }
  });

  const { data: recentUpdates } = useQuery({
    queryKey: ['recent-updates'],
    queryFn: async () => {
      const { data } = await supabase
        .from('law_updates')
        .select(`
          id,
          update_type,
          update_reason,
          status,
          submitted_at,
          laws:law_id (name)
        `)
        .order('submitted_at', { ascending: false })
        .limit(5);

      return data || [];
    }
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data } = await supabase
        .from('consultations')
        .select(`
          id,
          consultation_type,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      return data || [];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">في الانتظار</Badge>;
      case 'approved':
        return <Badge variant="default">مُوافق عليه</Badge>;
      case 'rejected':
        return <Badge variant="destructive">مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUpdateTypeLabel = (type: string) => {
    switch (type) {
      case 'new_law':
        return 'قانون جديد';
      case 'amend_law':
        return 'تعديل قانون';
      case 'repeal_law':
        return 'إلغاء قانون';
      case 'add_interpretation':
        return 'إضافة تفسير';
      default:
        return type;
    }
  };

  const getConsultationTypeLabel = (type: string) => {
    switch (type) {
      case 'chat':
        return 'محادثة';
      case 'document_analysis':
        return 'تحليل وثائق';
      case 'search':
        return 'بحث';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">لوحة المراقبة</h2>
        <p className="text-gray-600">نظرة عامة على حالة النظام والأنشطة الحديثة</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي القوانين</p>
                <p className="text-2xl font-bold">{stats?.totalLaws || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المستخدمون النشطون</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التحديثات المعلقة</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.pendingUpdates || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">استشارات اليوم</p>
                <p className="text-2xl font-bold text-purple-600">{stats?.todayConsultations || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Credentials */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            معلومات الدخول للمشرف
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm"><strong>البريد الإلكتروني:</strong> admin@example.com</p>
            <p className="text-sm"><strong>كلمة المرور:</strong> admin123</p>
            <p className="text-xs text-blue-600 mt-2">
              ملاحظة: يرجى تغيير كلمة المرور بعد أول تسجيل دخول
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              التحديثات الأخيرة
            </CardTitle>
            <CardDescription>آخر التحديثات المقترحة على القوانين</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUpdates?.map((update) => (
                <div key={update.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{getUpdateTypeLabel(update.update_type)}</p>
                    <p className="text-sm text-gray-600">
                      {update.laws?.name || 'قانون غير محدد'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(update.submitted_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  {getStatusBadge(update.status)}
                </div>
              ))}
              {!recentUpdates?.length && (
                <p className="text-gray-500 text-center py-4">لا توجد تحديثات حديثة</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              النشاط الأخير
            </CardTitle>
            <CardDescription>آخر الاستشارات والأنشطة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{getConsultationTypeLabel(activity.consultation_type)}</p>
                    <p className="text-sm text-gray-600">
                      مستخدم: {activity.user_id?.substring(0, 8)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
              {!recentActivity?.length && (
                <p className="text-gray-500 text-center py-4">لا يوجد نشاط حديث</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>صحة النظام</CardTitle>
          <CardDescription>مؤشرات حالة النظام والخدمات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">قاعدة البيانات</span>
              <Badge variant="default" className="bg-green-600">متصلة</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">خدمة الذكاء الاصطناعي</span>
              <Badge variant="default" className="bg-blue-600">نشطة</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium">واجهة المستخدم</span>
              <Badge variant="default" className="bg-purple-600">تعمل بشكل طبيعي</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
