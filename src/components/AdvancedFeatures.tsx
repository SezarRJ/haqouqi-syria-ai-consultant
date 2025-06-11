
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Download, 
  CreditCard, 
  BarChart3, 
  Moon,
  Database,
  CheckCircle
} from 'lucide-react';

interface AdvancedFeaturesProps {
  language: 'ar' | 'en';
}

export const AdvancedFeatures = ({ language }: AdvancedFeaturesProps) => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [shariaCompliance, setShariaCompliance] = useState(true);
  const [anonymization, setAnonymization] = useState(true);

  const texts = {
    ar: {
      title: 'الميزات المتقدمة',
      subtitle: 'أدوات متطورة للمحترفين والمؤسسات',
      offlineMode: 'الوضع غير المتصل',
      shariaCompliance: 'فحص التوافق الشرعي',
      anonymization: 'إخفاء الهوية التلقائي',
      subscriptionTiers: 'باقات الاشتراك',
      analytics: 'لوحة التحليلات',
      downloadDb: 'تحميل قاعدة البيانات',
      free: 'مجاني',
      premium: 'مميز',
      enterprise: 'للمؤسسات',
      basicSearch: 'بحث أساسي',
      advancedAnalytics: 'تحليلات متقدمة',
      documentDrafting: 'صياغة الوثائق',
      prioritySupport: 'دعم أولوية',
      teamCollaboration: 'تعاون الفريق',
      apiAccess: 'الوصول للواجهة البرمجية',
      downloadSize: 'حجم التحميل: 2.5 جيجابايت',
      lastUpdate: 'آخر تحديث: منذ أسبوع',
      complianceCheck: 'فحص التوافق',
      piiRemoval: 'إزالة المعلومات الشخصية'
    },
    en: {
      title: 'Advanced Features',
      subtitle: 'Sophisticated tools for professionals and institutions',
      offlineMode: 'Offline Mode',
      shariaCompliance: 'Sharia Compliance Check',
      anonymization: 'Auto Anonymization',
      subscriptionTiers: 'Subscription Tiers',
      analytics: 'Analytics Dashboard',
      downloadDb: 'Download Database',
      free: 'Free',
      premium: 'Premium',
      enterprise: 'Enterprise',
      basicSearch: 'Basic Search',
      advancedAnalytics: 'Advanced Analytics',
      documentDrafting: 'Document Drafting',
      prioritySupport: 'Priority Support',
      teamCollaboration: 'Team Collaboration',
      apiAccess: 'API Access',
      downloadSize: 'Download Size: 2.5 GB',
      lastUpdate: 'Last Update: 1 week ago',
      complianceCheck: 'Compliance Check',
      piiRemoval: 'PII Removal'
    }
  };

  const t = texts[language];

  const subscriptionTiers = [
    {
      name: t.free,
      price: language === 'ar' ? 'مجاني' : 'Free',
      features: [
        t.basicSearch,
        language === 'ar' ? '5 استشارات شهرياً' : '5 consultations/month',
        language === 'ar' ? 'دعم أساسي' : 'Basic support'
      ],
      color: 'border-gray-200'
    },
    {
      name: t.premium,
      price: language === 'ar' ? '99 ريال/شهر' : '99 SAR/month',
      features: [
        t.advancedAnalytics,
        t.documentDrafting,
        t.prioritySupport,
        language === 'ar' ? 'استشارات غير محدودة' : 'Unlimited consultations'
      ],
      color: 'border-blue-200 bg-blue-50'
    },
    {
      name: t.enterprise,
      price: language === 'ar' ? 'حسب الطلب' : 'Custom pricing',
      features: [
        t.teamCollaboration,
        t.apiAccess,
        language === 'ar' ? 'تدريب مخصص' : 'Custom training',
        language === 'ar' ? 'إدارة مخصصة' : 'Dedicated management'
      ],
      color: 'border-purple-200 bg-purple-50'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </TabsTrigger>
            <TabsTrigger value="offline">
              {language === 'ar' ? 'غير متصل' : 'Offline'}
            </TabsTrigger>
            <TabsTrigger value="subscription">
              {language === 'ar' ? 'الاشتراكات' : 'Subscription'}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              {t.analytics}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">{t.shariaCompliance}</Label>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' 
                      ? 'فحص التوافق مع أحكام الشريعة الإسلامية'
                      : 'Check compliance with Islamic law principles'
                    }
                  </p>
                </div>
                <Switch 
                  checked={shariaCompliance} 
                  onCheckedChange={setShariaCompliance}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">{t.anonymization}</Label>
                  <p className="text-sm text-gray-600">
                    {language === 'ar'
                      ? 'إزالة المعلومات الشخصية تلقائياً من الوثائق'
                      : 'Automatically remove personal information from documents'
                    }
                  </p>
                </div>
                <Switch 
                  checked={anonymization} 
                  onCheckedChange={setAnonymization}
                />
              </div>

              {shariaCompliance && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">{t.complianceCheck}</span>
                  </div>
                  <p className="text-sm text-green-800">
                    {language === 'ar'
                      ? 'سيتم فحص جميع الاستشارات للتأكد من توافقها مع أحكام الشريعة'
                      : 'All consultations will be checked for Sharia compliance'
                    }
                  </p>
                </div>
              )}

              {anonymization && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{t.piiRemoval}</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {language === 'ar'
                      ? 'سيتم إزالة الأسماء وأرقام الهوية والمعلومات الحساسة تلقائياً'
                      : 'Names, ID numbers, and sensitive information will be automatically removed'
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="offline" className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="font-medium">{t.offlineMode}</Label>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'تحميل قاعدة بيانات القوانين للاستخدام بدون إنترنت'
                    : 'Download law database for offline use'
                  }
                </p>
              </div>
              <Switch 
                checked={offlineMode} 
                onCheckedChange={setOfflineMode}
              />
            </div>

            {offlineMode && (
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{t.downloadDb}</h4>
                    <p className="text-sm text-gray-600">{t.downloadSize}</p>
                    <p className="text-sm text-gray-600">{t.lastUpdate}</p>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'تحميل قاعدة البيانات' : 'Download Database'}
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionTiers.map((tier, index) => (
                <Card key={index} className={`p-4 ${tier.color}`}>
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg">{tier.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">{tier.price}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={index === 1 ? 'default' : 'outline'}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'اختيار الباقة' : 'Choose Plan'}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-bold text-2xl">1,234</h4>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'استشارات هذا الشهر' : 'Consultations this month'}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-bold text-2xl">98%</h4>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'دقة التحليل' : 'Analysis accuracy'}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-bold text-2xl">456</h4>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'قوانين محدثة' : 'Updated laws'}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h4 className="font-bold text-2xl">789</h4>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'وثائق مصاغة' : 'Documents drafted'}
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
