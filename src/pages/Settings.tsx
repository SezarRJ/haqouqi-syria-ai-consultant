
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { UserBalance } from '@/components/UserBalance';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    profile: {
      displayName: 'محمد أحمد',
      email: 'user@example.com',
      phone: '+966501234567',
      bio: 'محامي متخصص في القانون التجاري'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReport: false,
      legalUpdates: true
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analyticsTracking: true
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

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <span className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                الملف الشخصي
              </span>
            </TabsTrigger>
            <TabsTrigger value="balance">
              <span className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                الرصيد
              </span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <span className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                الإشعارات
              </span>
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                الخصوصية
              </span>
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                المظهر
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الملف الشخصي</CardTitle>
                <CardDescription>إدارة معلوماتك الشخصية والمهنية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName">الاسم المعروض</Label>
                    <Input
                      id="displayName"
                      value={settings.profile.displayName}
                      onChange={(e) => updateSetting('profile', 'displayName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={settings.profile.phone}
                      onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">نبذة تعريفية</Label>
                  <Textarea
                    id="bio"
                    value={settings.profile.bio}
                    onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={() => handleSave('الملف الشخصي')} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Balance Settings */}
          <TabsContent value="balance">
            <UserBalance />
          </TabsContent>

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

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الخصوصية والأمان</CardTitle>
                <CardDescription>تحكم في خصوصية بياناتك وأمان حسابك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="profileVisibility">رؤية الملف الشخصي</Label>
                  <Select 
                    value={settings.privacy.profileVisibility} 
                    onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">عام - يمكن لأي شخص رؤيته</SelectItem>
                      <SelectItem value="private">خاص - مخفي عن الآخرين</SelectItem>
                      <SelectItem value="contacts">جهات الاتصال فقط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataSharing">مشاركة البيانات</Label>
                    <p className="text-sm text-gray-500">السماح بمشاركة البيانات مع الشركاء</p>
                  </div>
                  <Switch
                    id="dataSharing"
                    checked={settings.privacy.dataSharing}
                    onCheckedChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analyticsTracking">تتبع التحليلات</Label>
                    <p className="text-sm text-gray-500">المساعدة في تحسين الخدمة من خلال التحليلات</p>
                  </div>
                  <Switch
                    id="analyticsTracking"
                    checked={settings.privacy.analyticsTracking}
                    onCheckedChange={(checked) => updateSetting('privacy', 'analyticsTracking', checked)}
                  />
                </div>
                
                <Button onClick={() => handleSave('الخصوصية')} className="flex items-center gap-2">
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
