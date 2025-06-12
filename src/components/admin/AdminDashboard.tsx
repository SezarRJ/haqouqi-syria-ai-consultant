
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersManagement } from './UsersManagement';
import { SystemSettings } from './SystemSettings';
import { Analytics } from './Analytics';
import { PaymentManagement } from './PaymentManagement';
import { VoucherManagement } from './VoucherManagement';
import { LawsManagement } from './LawsManagement';
import { UpdatesManagement } from './UpdatesManagement';
import { DatabaseManagement } from './DatabaseManagement';
import { Integrations } from './Integrations';
import { Users, Settings, BarChart3, CreditCard, Gift, BookOpen, RefreshCw, Database, Plug } from 'lucide-react';

interface AdminDashboardProps {
  language: 'ar' | 'en';
}

export const AdminDashboard = ({ language }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('users');

  const texts = {
    ar: {
      users: 'إدارة المستخدمين',
      system: 'إعدادات النظام',
      analytics: 'التحليلات',
      payments: 'إدارة المدفوعات',
      vouchers: 'إدارة الكوبونات',
      laws: 'إدارة القوانين',
      updates: 'إدارة التحديثات',
      database: 'إدارة قاعدة البيانات',
      integrations: 'التكاملات'
    },
    en: {
      users: 'Users Management',
      system: 'System Settings',
      analytics: 'Analytics',
      payments: 'Payment Management',
      vouchers: 'Voucher Management',
      laws: 'Laws Management',
      updates: 'Updates Management',
      database: 'Database Management',
      integrations: 'Integrations'
    }
  };

  const t = texts[language];

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t.users}</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{t.system}</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t.analytics}</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">{t.payments}</span>
          </TabsTrigger>
          <TabsTrigger value="vouchers" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">{t.vouchers}</span>
          </TabsTrigger>
          <TabsTrigger value="laws" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t.laws}</span>
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">{t.updates}</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">{t.database}</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">{t.integrations}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="vouchers">
          <VoucherManagement />
        </TabsContent>

        <TabsContent value="laws">
          <LawsManagement />
        </TabsContent>

        <TabsContent value="updates">
          <UpdatesManagement />
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
