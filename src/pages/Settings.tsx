
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Moon, 
  Sun, 
  Globe,
  Save,
  Download,
  Trash2
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+963912345678',
    organization: 'مكتب المحاماة الأول',
    bio: 'محامي متخصص في القانون المدني والتجاري',

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    consultationReminders: true,
    systemUpdates: true,
    marketingEmails: false,

    // Privacy Settings
    profileVisibility: 'private',
    shareUsageData: false,
    twoFactorAuth: false,

    // Interface Settings
    language: 'ar',
    theme: 'light',
    fontSize: 'medium',
    consultationHistory: 'keep',

    // Advanced Settings
    dataRetention: '1year',
    apiAccess: false,
    webhookUrl: ''
  });

  const handleSave = (section: string) => {
    toast({
      title: "تم الحفظ",
      description: `تم حفظ إعدادات ${section} بنجاح`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "جارٍ التصدير",
      description: "سيتم إرسال بياناتك إلى بريدك الإلكتروني خلال دقائق",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "تحذير",
      description: "سيتم حذف حسابك وجميع بياناتك نهائياً. هذا الإجراء لا يمكن التراجع عنه.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-600">إدارة تفضيلاتك وإعدادات حسابك</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              الخصوصية
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              الواجهة
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              متقدم
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الحساب</CardTitle>
                  <CardDescription>إدارة بياناتك الشخصية الأساسية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <Input 
                      id="fullName"
                      value={settings.fullName}
                      onChange={(e) => setSettings({...settings, fullName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input 
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organization">المؤسسة</Label>
                    <Input 
                      id="organization"
                      value={settings.organization}
                      onChange={(e) => setSettings({...settings, organization: e.target.value})}
                    />
                  </div>
                  
                  <Button onClick={() => handleSave('الملف الشخصي')} className="w-full">
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>النبذة الشخصية</CardTitle>
                  <CardDescription>معلومات إضافية عنك ومجال عملك</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">نبذة تعريفية</Label>
                    <Textarea 
                      id="bio"
                      value={settings.bio}
                      onChange={(e) => setSettings({...settings, bio: e.target.value})}
                      rows={4}
                      placeholder="اكتب نبذة تعريفية عن نفسك ومجال عملك..."
                    />
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">إحصائيات الاستخدام</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">الاستشارات:</span>
                        <span className="font-bold mr-2">47</span>
                      </div>
                      <div>
                        <span className="text-blue-600">التقييم:</span>
                        <span className="font-bold mr-2">4.8/5</span>
                      </div>
                      <div>
                        <span className="text-blue-600">عضو منذ:</span>
                        <span className="font-bold mr-2">مارس 2024</span>
                      </div>
                      <div>
                        <span className="text-blue-600">الخطة:</span>
                        <Badge variant="default">المتقدم</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الإشعارات</CardTitle>
                <CardDescription>تحكم في الإشعارات التي تريد تلقيها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base font-medium">
                      إشعارات البريد الإلكتروني
                    </Label>
                    <p className="text-sm text-gray-600">تلقي إشعارات مهمة عبر البريد الإلكتروني</p>
                  </div>
                  <Switch 
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="text-base font-medium">
                      إشعارات SMS
                    </Label>
                    <p className="text-sm text-gray-600">تلقي رسائل نصية للإشعارات العاجلة</p>
                  </div>
                  <Switch 
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="consultationReminders" className="text-base font-medium">
                      تذكيرات الاستشارات
                    </Label>
                    <p className="text-sm text-gray-600">تذكير بمواعيد الاستشارات والمتابعات</p>
                  </div>
                  <Switch 
                    id="consultationReminders"
                    checked={settings.consultationReminders}
                    onCheckedChange={(checked) => setSettings({...settings, consultationReminders: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemUpdates" className="text-base font-medium">
                      تحديثات النظام
                    </Label>
                    <p className="text-sm text-gray-600">إشعارات حول التحديثات والميزات الجديدة</p>
                  </div>
                  <Switch 
                    id="systemUpdates"
                    checked={settings.systemUpdates}
                    onCheckedChange={(checked) => setSettings({...settings, systemUpdates: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails" className="text-base font-medium">
                      رسائل تسويقية
                    </Label>
                    <p className="text-sm text-gray-600">عروض وأخبار المنتج</p>
                  </div>
                  <Switch 
                    id="marketingEmails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                  />
                </div>

                <Button onClick={() => handleSave('الإشعارات')} className="w-full">
                  <Save className="h-4 w-4 ml-2" />
                  حفظ إعدادات الإشعارات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الخصوصية والأمان</CardTitle>
                  <CardDescription>إدارة خصوصيتك وأمان حسابك</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">مستوى الخصوصية</Label>
                    <Select value={settings.profileVisibility} onValueChange={(value) => setSettings({...settings, profileVisibility: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">عام - يمكن للجميع رؤية ملفك</SelectItem>
                        <SelectItem value="limited">محدود - المعلومات الأساسية فقط</SelectItem>
                        <SelectItem value="private">خاص - لا أحد يمكنه رؤية ملفك</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shareUsageData" className="text-base font-medium">
                        مشاركة بيانات الاستخدام
                      </Label>
                      <p className="text-sm text-gray-600">مساعدتنا في تحسين الخدمة</p>
                    </div>
                    <Switch 
                      id="shareUsageData"
                      checked={settings.shareUsageData}
                      onCheckedChange={(checked) => setSettings({...settings, shareUsageData: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth" className="text-base font-medium">
                        المصادقة الثنائية
                      </Label>
                      <p className="text-sm text-gray-600">حماية إضافية لحسابك</p>
                    </div>
                    <Switch 
                      id="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إدارة البيانات</CardTitle>
                  <CardDescription>تحكم في بياناتك الشخصية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleExportData} variant="outline" className="w-full">
                    <Download className="h-4 w-4 ml-2" />
                    تصدير بياناتي
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="consultationHistory">سجل الاستشارات</Label>
                    <Select value={settings.consultationHistory} onValueChange={(value) => setSettings({...settings, consultationHistory: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keep">الاحتفاظ بجميع السجلات</SelectItem>
                        <SelectItem value="30days">حذف بعد 30 يوم</SelectItem>
                        <SelectItem value="90days">حذف بعد 90 يوم</SelectItem>
                        <SelectItem value="1year">حذف بعد سنة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <Button onClick={handleDeleteAccount} variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف الحساب نهائياً
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      تحذير: هذا الإجراء لا يمكن التراجع عنه
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interface Settings */}
          <TabsContent value="interface">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الواجهة</CardTitle>
                <CardDescription>تخصيص شكل ومظهر التطبيق</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">اللغة</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">المظهر</Label>
                    <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
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

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">حجم الخط</Label>
                    <Select value={settings.fontSize} onValueChange={(value) => setSettings({...settings, fontSize: value})}>
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
                </div>

                <Button onClick={() => handleSave('الواجهة')} className="w-full">
                  <Save className="h-4 w-4 ml-2" />
                  حفظ إعدادات الواجهة
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الإعدادات المتقدمة</CardTitle>
                  <CardDescription>إعدادات للمستخدمين المتقدمين</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">فترة الاحتفاظ بالبيانات</Label>
                    <Select value={settings.dataRetention} onValueChange={(value) => setSettings({...settings, dataRetention: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3months">3 أشهر</SelectItem>
                        <SelectItem value="6months">6 أشهر</SelectItem>
                        <SelectItem value="1year">سنة واحدة</SelectItem>
                        <SelectItem value="forever">دائماً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="apiAccess" className="text-base font-medium">
                        الوصول للـ API
                      </Label>
                      <p className="text-sm text-gray-600">تفعيل واجهة برمجة التطبيقات</p>
                    </div>
                    <Switch 
                      id="apiAccess"
                      checked={settings.apiAccess}
                      onCheckedChange={(checked) => setSettings({...settings, apiAccess: checked})}
                    />
                  </div>

                  {settings.apiAccess && (
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">رابط الـ Webhook</Label>
                      <Input 
                        id="webhookUrl"
                        value={settings.webhookUrl}
                        onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                        placeholder="https://your-site.com/webhook"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>معلومات النظام</CardTitle>
                  <CardDescription>تفاصيل حول النظام والإصدار</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">إصدار التطبيق:</span>
                      <span className="font-medium">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">آخر تحديث:</span>
                      <span className="font-medium">15 ديسمبر 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المتصفح:</span>
                      <span className="font-medium">Chrome 120.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">النظام:</span>
                      <span className="font-medium">Windows 11</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Button variant="outline" className="w-full">
                      تحقق من التحديثات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
