
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [lawsCount, usersCount, consultationsCount, pendingUpdates] = await Promise.all([
        supabase.from('laws').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('consultations').select('id', { count: 'exact' }),
        supabase.from('law_updates').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      return {
        laws: lawsCount.count || 0,
        users: usersCount.count || 0,
        consultations: consultationsCount.count || 0,
        pendingUpdates: pendingUpdates.count || 0
      };
    }
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data } = await supabase
        .from('law_updates')
        .select(`
          id,
          update_type,
          submitted_at,
          status,
          laws(name),
          profiles(full_name)
        `)
        .order('submitted_at', { ascending: false })
        .limit(5);

      return data || [];
    }
  });

  const statCards = [
    {
      title: 'إجمالي القوانين',
      value: stats?.laws || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'المستخدمون النشطون',
      value: stats?.users || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'الاستشارات اليوم',
      value: stats?.consultations || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'التحديثات المعلقة',
      value: stats?.pendingUpdates || 0,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              النشاط الأخير
            </CardTitle>
            <CardDescription>آخر التحديثات والأنشطة في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.profiles?.full_name || 'مستخدم غير معروف'} - {activity.update_type}
                    </p>
                    <p className="text-xs text-gray-600">{activity.laws?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.submitted_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <Badge variant={
                    activity.status === 'approved' ? 'default' :
                    activity.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {activity.status === 'approved' ? 'موافق عليه' :
                     activity.status === 'pending' ? 'معلق' : 'مرفوض'}
                  </Badge>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">لا توجد أنشطة حديثة</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>الإجراءات السريعة</CardTitle>
            <CardDescription>روابط سريعة للمهام الشائعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">إضافة قانون جديد</p>
                </div>
              </Card>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">مراجعة التحديثات</p>
                </div>
              </Card>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium">إدارة المستخدمين</p>
                </div>
              </Card>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm font-medium">عرض التحليلات</p>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
