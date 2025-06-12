
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, Palette, Globe, Save } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReport: false,
      legalUpdates: true
    },
    appearance: {
      theme: 'light',
      language: 'ar',
      fontSize: 'medium'
    }
  });

  console.log('Settings component render');

  const handleSave = (section: string) => {
    toast({
      title: "تم الحفظ",
      description: `تم حفظ إعدادات ${section} بنجاح`,
    });
  };

  const updateSetting = (section: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
            <p className="text-gray-600">إدارة إعدادات حسابك وتفضيلاتك</p>
          </div>
          <BackButton />
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">
              <span className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                الإشعارات
              </span>
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                المظهر
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الإشعارات</CardTitle>
                <CardDescription>تحكم في أنواع الإشعارات التي تريد استلامها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-gray-500">استلام الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">الإشعارات الفورية</Label>
                    <p className="text-sm text-gray-500">إشعارات فورية على المتصفح</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReport">التقرير الأسبوعي</Label>
                    <p className="text-sm text-gray-500">ملخص أسبوعي لنشاطك</p>
                  </div>
                  <Switch
                    id="weeklyReport"
                    checked={settings.notifications.weeklyReport}
                    onCheckedChange={(checked) => updateSetting('notifications', 'weeklyReport', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="legalUpdates">التحديثات القانونية</Label>
                    <p className="text-sm text-gray-500">إشعارات عن التحديثات والقوانين الجديدة</p>
                  </div>
                  <Switch
                    id="legalUpdates"
                    checked={settings.notifications.legalUpdates}
                    onCheckedChange={(checked) => updateSetting('notifications', 'legalUpdates', checked)}
                  />
                </div>
                
                <Button onClick={() => handleSave('الإشعارات')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المظهر واللغة</CardTitle>
                <CardDescription>تخصيص مظهر التطبيق وتفضيلات اللغة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="theme">السمة</Label>
                  <Select 
                    value={settings.appearance.theme} 
                    onValueChange={(value) => updateSetting('appearance', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">فاتح</SelectItem>
                      <SelectItem value="dark">داكن</SelectItem>
                      <SelectItem value="auto">تلقائي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language">اللغة</Label>
                  <Select 
                    value={settings.appearance.language} 
                    onValueChange={(value) => updateSetting('appearance', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fontSize">حجم الخط</Label>
                  <Select 
                    value={settings.appearance.fontSize} 
                    onValueChange={(value) => updateSetting('appearance', 'fontSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={() => handleSave('المظهر')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
