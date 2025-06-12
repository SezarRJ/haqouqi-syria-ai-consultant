import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UsersManagement } from './UsersManagement';
import { ServiceProvidersManagement } from './ServiceProvidersManagement';
import { LawsManagement } from './LawsManagement';
import { VoucherManagement } from './VoucherManagement';
import { PaymentManagement } from './PaymentManagement';
import { Analytics } from './Analytics';
import { SystemSettings } from './SystemSettings';
import { DatabaseManagement } from './DatabaseManagement';
import { UpdatesManagement } from './UpdatesManagement';
import { Integrations } from './Integrations';
import { Users, FileText, Settings, CreditCard, BarChart3, Database, Upload, Puzzle, Briefcase, Gift } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminDashboardProps {
  language: 'ar' | 'en';
}

export const AdminDashboard = ({ language }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalConsultations: 0,
    totalRevenue: 0,
  });

  const texts = {
    ar: {
      title: 'لوحة تحكم الإدارة',
      overview: 'نظرة عامة',
      users: 'إدارة المستخدمين',
      providers: 'إدارة مقدمي الخدمات',
      laws: 'إدارة القوانين',
      vouchers: 'إدارة القسائم',
      payments: 'إدارة المدفوعات',
      analytics: 'التحليلات',
      settings: 'إعدادات النظام',
      database: 'إدارة قاعدة البيانات',
      updates: 'إدارة التحديثات',
      integrations: 'التكاملات',
      totalUsers: 'إجمالي المستخدمين',
      totalProviders: 'إجمالي مقدمي الخدمات',
      totalConsultations: 'إجمالي الاستشارات',
      totalRevenue: 'إجمالي الإيرادات',
      systemHealth: 'حالة النظام',
      healthy: 'جيد',
      recentActivity: 'النشاط الأخير',
      quickActions: 'إجراءات سريعة',
      addUser: 'إضافة مستخدم',
      addProvider: 'إضافة مقدم خدمة',
      generateVoucher: 'إنشاء قسيمة',
      viewReports: 'عرض التقارير'
    },
    en: {
      title: 'Admin Dashboard',
      overview: 'Overview',
      users: 'User Management',
      providers: 'Service Providers',
      laws: 'Laws Management',
      vouchers: 'Voucher Management',
      payments: 'Payment Management',
      analytics: 'Analytics',
      settings: 'System Settings',
      database: 'Database Management',
      updates: 'Updates Management',
      integrations: 'Integrations',
      totalUsers: 'Total Users',
      totalProviders: 'Total Providers',
      totalConsultations: 'Total Consultations',
      totalRevenue: 'Total Revenue',
      systemHealth: 'System Health',
      healthy: 'Healthy',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      addUser: 'Add User',
      addProvider: 'Add Provider',
      generateVoucher: 'Generate Voucher',
      viewReports: 'View Reports'
    }
  }[language];

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch basic statistics
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: providersCount } = await supabase
        .from('service_providers')
        .select('*', { count: 'exact', head: true });

      const { count: consultationsCount } = await supabase
        .from('paid_consultations')
        .select('*', { count: 'exact', head: true });

      const { data: revenueData } = await supabase
        .from('paid_consultations')
        .select('total_amount')
        .eq('payment_status', 'paid');

      const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.total_amount || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalProviders: providersCount || 0,
        totalConsultations: consultationsCount || 0,
        totalRevenue,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: texts.totalUsers,
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: texts.totalProviders,
      value: stats.totalProviders,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: texts.totalConsultations,
      value: stats.totalConsultations,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: texts.totalRevenue,
      value: `${stats.totalRevenue.toFixed(2)} SAR`,
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{texts.title}</h1>
        <Badge variant="outline" className="text-green-600 border-green-600">
          {texts.systemHealth}: {texts.healthy}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full">
          <TabsTrigger value="overview" className="text-xs">{texts.overview}</TabsTrigger>
          <TabsTrigger value="users" className="text-xs">{texts.users}</TabsTrigger>
          <TabsTrigger value="providers" className="text-xs">{texts.providers}</TabsTrigger>
          <TabsTrigger value="laws" className="text-xs">{texts.laws}</TabsTrigger>
          <TabsTrigger value="vouchers" className="text-xs">{texts.vouchers}</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs">{texts.payments}</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">{texts.analytics}</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">{texts.settings}</TabsTrigger>
          <TabsTrigger value="database" className="text-xs">{texts.database}</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs">{texts.integrations}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${card.bgColor}`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{texts.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  {texts.addUser}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="mr-2 h-4 w-4" />
                  {texts.addProvider}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="mr-2 h-4 w-4" />
                  {texts.generateVoucher}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {texts.viewReports}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{texts.recentActivity}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• New user registration</p>
                  <p>• Service provider verified</p>
                  <p>• Payment processed</p>
                  <p>• System backup completed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="providers">
          <ServiceProvidersManagement />
        </TabsContent>

        <TabsContent value="laws">
          <LawsManagement />
        </TabsContent>

        <TabsContent value="vouchers">
          <VoucherManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseManagement />
        </TabsContent>

        <TabsContent value="integrations">
          <Integrations />
        </TabsContent>
      </Tabs>
    </div>
  );
};
