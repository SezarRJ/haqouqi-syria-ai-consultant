
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersManagement } from './UsersManagement';
import { LawsManagement } from './LawsManagement';
import { Analytics } from './Analytics';
import { SystemSettings } from './SystemSettings';
import { VoucherManagement } from './VoucherManagement';
import { PaymentManagement } from './PaymentManagement';
import { DatabaseManagement } from './DatabaseManagement';
import { Integrations } from './Integrations';
import { UpdatesManagement } from './UpdatesManagement';
import { ServiceProvidersManagement } from './ServiceProvidersManagement';
import { ArabicAIModelsConfig } from '../ai/ArabicAIModelsConfig';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Gift, 
  CreditCard, 
  Database, 
  Zap, 
  RefreshCw,
  UserCheck,
  Brain
} from 'lucide-react';

interface AdminDashboardProps {
  language: 'ar' | 'en';
}

export const AdminDashboard = ({ language }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const texts = {
    ar: {
      overview: 'نظرة عامة',
      users: 'المستخدمون',
      laws: 'القوانين',
      analytics: 'التحليلات',
      settings: 'الإعدادات',
      vouchers: 'قسائم الشحن',
      payments: 'المدفوعات',
      database: 'قاعدة البيانات',
      integrations: 'التكاملات',
      updates: 'التحديثات',
      serviceProviders: 'مقدمو الخدمات',
      aiModels: 'نماذج الذكاء الاصطناعي'
    },
    en: {
      overview: 'Overview',
      users: 'Users',
      laws: 'Laws',
      analytics: 'Analytics',
      settings: 'Settings',
      vouchers: 'Vouchers',
      payments: 'Payments',
      database: 'Database',
      integrations: 'Integrations',
      updates: 'Updates',
      serviceProviders: 'Service Providers',
      aiModels: 'AI Models'
    }
  };

  const t = texts[language];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t.overview}</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t.users}</span>
          </TabsTrigger>
          <TabsTrigger value="service-providers" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{t.serviceProviders}</span>
          </TabsTrigger>
          <TabsTrigger value="ai-models" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">{t.aiModels}</span>
          </TabsTrigger>
          <TabsTrigger value="laws" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t.laws}</span>
          </TabsTrigger>
          <TabsTrigger value="vouchers" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">{t.vouchers}</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">{t.payments}</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">{t.database}</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">{t.integrations}</span>
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">{t.updates}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{t.settings}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Analytics language={language} />
        </TabsContent>

        <TabsContent value="users">
          <UsersManagement language={language} />
        </TabsContent>

        <TabsContent value="service-providers">
          <ServiceProvidersManagement />
        </TabsContent>

        <TabsContent value="ai-models">
          <ArabicAIModelsConfig language={language} />
        </TabsContent>

        <TabsContent value="laws">
          <LawsManagement language={language} />
        </TabsContent>

        <TabsContent value="vouchers">
          <VoucherManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseManagement language={language} />
        </TabsContent>

        <TabsContent value="integrations">
          <Integrations language={language} />
        </TabsContent>

        <TabsContent value="updates">
          <UpdatesManagement language={language} />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
