
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, FileText, AlertCircle, TrendingUp, Database, Shield, CheckCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: lawsCount },
        { count: usersCount },
        { count: consultationsCount },
        { count: pendingUpdatesCount }
      ] = await Promise.all([
        supabase.from('laws').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('consultations').select('*', { count: 'exact', head: true }),
        supabase.from('law_updates').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      return {
        laws: lawsCount || 0,
        users: usersCount || 0,
        consultations: consultationsCount || 0,
        pendingUpdates: pendingUpdatesCount || 0
      };
    }
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data } = await supabase
        .from('law_updates')
        .select('*, laws(name)')
        .order('submitted_at', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  const quickStats = [
    {
      title: 'إجمالي القوانين',
      value: stats?.laws || 0,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'في قاعدة البيانات'
    },
    {
      title: 'المستخدمون النشطون',
      value: stats?.users || 0,
      icon: Users,
      color: 'bg-green-500',
      description: 'مستخدم مسجل'
    },
    {
      title: 'الاستشارات',
      value: stats?.consultations || 0,
      icon: Activity,
      color: 'bg-purple-500',
      description: 'إجمالي الاستشارات'
    },
    {
      title: 'التحديثات المعلقة',
      value: stats?.pendingUpdates || 0,
      icon: AlertCircle,
      color: 'bg-orange-500',
      description: 'تحتاج مراجعة'
    }
  ];

  const systemHealth = [
    { name: 'قاعدة البيانات', status: 'متصلة', color: 'bg-green-500' },
    { name: 'نموذج الذكاء الاصطناعي', status: 'نشط', color: 'bg-green-500' },
    { name: 'آخر نسخ احتياطي', status: 'اليوم', color: 'bg-green-500' },
    { name: 'أداء النظام', status: 'ممتاز', color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 space-x-reverse">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">لوحة تحكم الإدارة</h2>
          <p className="text-slate-600">نظرة عامة على النشاط والإحصائيات</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-5 w-5" />
              النشاط الأخير
            </CardTitle>
            <CardDescription>آخر التحديثات والأنشطة في النظام</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity?.length === 0 ? (
              <p className="text-center text-slate-500 py-4">لا توجد أنشطة حديثة</p>
            ) : (
              recentActivity?.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      تحديث على: {activity.laws?.name || 'قانون غير محدد'}
                    </p>
                    <p className="text-xs text-slate-600">
                      نوع التحديث: {activity.update_type}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.submitted_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <Badge variant={activity.status === 'pending' ? 'outline' : 'default'}>
                    {activity.status === 'pending' ? 'معلق' : activity.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Shield className="h-5 w-5" />
              حالة النظام
            </CardTitle>
            <CardDescription>مؤشرات صحة وأداء النظام</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span className="font-medium text-slate-800">{item.name}</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Database className="h-5 w-5" />
            إجراءات سريعة
          </CardTitle>
          <CardDescription>الوصول السريع للمهام الشائعة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'إضافة قانون جديد', icon: FileText },
              { name: 'مراجعة التحديثات', icon: CheckCircle },
              { name: 'إدارة المستخدمين', icon: Users },
              { name: 'إعدادات النظام', icon: Shield }
            ].map((action, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-900">{action.name}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
