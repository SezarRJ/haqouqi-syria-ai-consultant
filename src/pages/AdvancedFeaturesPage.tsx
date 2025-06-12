
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wrench, Settings, Zap, Shield, Database, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const AdvancedFeaturesPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [features, setFeatures] = useState({
    autoSave: true,
    advancedSearch: false,
    collaboration: true,
    notifications: true,
    encryption: true,
    backups: false
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const texts = {
    ar: {
      title: 'الميزات المتقدمة',
      description: 'إعدادات وميزات متقدمة للنظام',
      backToHome: 'العودة للرئيسية',
      generalSettings: 'الإعدادات العامة',
      autoSave: 'الحفظ التلقائي',
      autoSaveDesc: 'حفظ تلقائي للمستندات والاستشارات',
      advancedSearch: 'البحث المتقدم',
      advancedSearchDesc: 'تفعيل خوارزميات البحث المتطورة',
      collaboration: 'أدوات التعاون',
      collaborationDesc: 'ميزات التعاون مع الزملاء',
      securitySettings: 'إعدادات الأمان',
      notifications: 'الإشعارات المتقدمة',
      notificationsDesc: 'إشعارات فورية للتحديثات المهمة',
      encryption: 'التشفير المتقدم',
      encryptionDesc: 'تشفير إضافي للملفات الحساسة',
      backups: 'النسخ الاحتياطية',
      backupsDesc: 'نسخ احتياطية تلقائية للبيانات'
    },
    en: {
      title: 'Advanced Features',
      description: 'Advanced system settings and features',
      backToHome: 'Back to Home',
      generalSettings: 'General Settings',
      autoSave: 'Auto Save',
      autoSaveDesc: 'Automatically save documents and consultations',
      advancedSearch: 'Advanced Search',
      advancedSearchDesc: 'Enable advanced search algorithms',
      collaboration: 'Collaboration Tools',
      collaborationDesc: 'Collaboration features with colleagues',
      securitySettings: 'Security Settings',
      notifications: 'Advanced Notifications',
      notificationsDesc: 'Real-time notifications for important updates',
      encryption: 'Advanced Encryption',
      encryptionDesc: 'Additional encryption for sensitive files',
      backups: 'Automatic Backups',
      backupsDesc: 'Automatic data backup system'
    }
  };

  const t = texts[language];

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature as keyof typeof prev]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className={`flex items-center gap-4 mb-6 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-blue-600" />
                {t.generalSettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="auto-save" className="text-base font-medium">
                    {t.autoSave}
                  </Label>
                  <p className="text-sm text-gray-600">{t.autoSaveDesc}</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={features.autoSave}
                  onCheckedChange={() => handleFeatureToggle('autoSave')}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="advanced-search" className="text-base font-medium">
                    {t.advancedSearch}
                  </Label>
                  <p className="text-sm text-gray-600">{t.advancedSearchDesc}</p>
                </div>
                <Switch
                  id="advanced-search"
                  checked={features.advancedSearch}
                  onCheckedChange={() => handleFeatureToggle('advancedSearch')}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="collaboration" className="text-base font-medium">
                    {t.collaboration}
                  </Label>
                  <p className="text-sm text-gray-600">{t.collaborationDesc}</p>
                </div>
                <Switch
                  id="collaboration"
                  checked={features.collaboration}
                  onCheckedChange={() => handleFeatureToggle('collaboration')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                {t.securitySettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="notifications" className="text-base font-medium">
                    {t.notifications}
                  </Label>
                  <p className="text-sm text-gray-600">{t.notificationsDesc}</p>
                </div>
                <Switch
                  id="notifications"
                  checked={features.notifications}
                  onCheckedChange={() => handleFeatureToggle('notifications')}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="encryption" className="text-base font-medium">
                    {t.encryption}
                  </Label>
                  <p className="text-sm text-gray-600">{t.encryptionDesc}</p>
                </div>
                <Switch
                  id="encryption"
                  checked={features.encryption}
                  onCheckedChange={() => handleFeatureToggle('encryption')}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="backups" className="text-base font-medium">
                    {t.backups}
                  </Label>
                  <p className="text-sm text-gray-600">{t.backupsDesc}</p>
                </div>
                <Switch
                  id="backups"
                  checked={features.backups}
                  onCheckedChange={() => handleFeatureToggle('backups')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeaturesPage;
