
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, Globe, Zap, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Integrations = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState({
    openai: { enabled: false, apiKey: '', status: 'disconnected' },
    stripe: { enabled: false, apiKey: '', status: 'disconnected' },
    email: { enabled: true, apiKey: 'configured', status: 'connected' },
    storage: { enabled: true, apiKey: 'supabase', status: 'connected' }
  });

  const handleToggle = (service: string) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        enabled: !prev[service as keyof typeof prev].enabled
      }
    }));
  };

  const handleSaveApiKey = (service: string, apiKey: string) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        apiKey,
        status: apiKey ? 'connected' : 'disconnected'
      }
    }));
    
    toast({
      title: "تم الحفظ",
      description: `تم حفظ مفتاح API لخدمة ${service}`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">متصل</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">غير متصل</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">التكاملات</h2>
        <p className="text-gray-600">إدارة التكاملات مع الخدمات الخارجية</p>
      </div>

      {/* AI Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            الذكاء الاصطناعي (OpenAI)
          </CardTitle>
          <CardDescription>
            تكامل مع OpenAI لتقديم الاستشارات القانونية الذكية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(integrations.openai.status)}
              <span className="font-medium">حالة الاتصال</span>
            </div>
            {getStatusBadge(integrations.openai.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="openai-toggle">تفعيل الخدمة</Label>
            <Switch
              id="openai-toggle"
              checked={integrations.openai.enabled}
              onCheckedChange={() => handleToggle('openai')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="openai-key">مفتاح API</Label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                value={integrations.openai.apiKey}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  openai: { ...prev.openai, apiKey: e.target.value }
                }))}
              />
              <Button 
                onClick={() => handleSaveApiKey('openai', integrations.openai.apiKey)}
                size="sm"
              >
                حفظ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            المدفوعات (Stripe)
          </CardTitle>
          <CardDescription>
            تكامل مع Stripe لمعالجة المدفوعات والاشتراكات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(integrations.stripe.status)}
              <span className="font-medium">حالة الاتصال</span>
            </div>
            {getStatusBadge(integrations.stripe.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="stripe-toggle">تفعيل الخدمة</Label>
            <Switch
              id="stripe-toggle"
              checked={integrations.stripe.enabled}
              onCheckedChange={() => handleToggle('stripe')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stripe-key">مفتاح Stripe السري</Label>
            <div className="flex gap-2">
              <Input
                id="stripe-key"
                type="password"
                placeholder="sk_..."
                value={integrations.stripe.apiKey}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  stripe: { ...prev.stripe, apiKey: e.target.value }
                }))}
              />
              <Button 
                onClick={() => handleSaveApiKey('stripe', integrations.stripe.apiKey)}
                size="sm"
              >
                حفظ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            البريد الإلكتروني
          </CardTitle>
          <CardDescription>
            إرسال الإشعارات والتحديثات عبر البريد الإلكتروني
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(integrations.email.status)}
              <span className="font-medium">حالة الاتصال</span>
            </div>
            {getStatusBadge(integrations.email.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-toggle">تفعيل الخدمة</Label>
            <Switch
              id="email-toggle"
              checked={integrations.email.enabled}
              onCheckedChange={() => handleToggle('email')}
            />
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              خدمة البريد الإلكتروني مُفعلة ومتصلة عبر Supabase
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Storage Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            التخزين السحابي
          </CardTitle>
          <CardDescription>
            تخزين الملفات والوثائق في السحابة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(integrations.storage.status)}
              <span className="font-medium">حالة الاتصال</span>
            </div>
            {getStatusBadge(integrations.storage.status)}
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="storage-toggle">تفعيل الخدمة</Label>
            <Switch
              id="storage-toggle"
              checked={integrations.storage.enabled}
              onCheckedChange={() => handleToggle('storage')}
            />
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              التخزين السحابي مُفعل ومتصل عبر Supabase Storage
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
