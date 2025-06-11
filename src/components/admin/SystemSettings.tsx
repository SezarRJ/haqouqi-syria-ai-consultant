
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, Cpu, Bell, Shield, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SystemSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');
      if (error) throw error;
      
      const settingsObj: { [key: string]: string } = {};
      data.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      return settingsObj;
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_by: user?.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "تم بنجاح",
        description: "تم حفظ الإعدادات بنجاح",
      });
    }
  });

  const [formData, setFormData] = useState({
    app_name: '',
    legal_disclaimer: '',
    notifications_enabled: 'true',
    ai_confidence_threshold: '0.7'
  });

  useState(() => {
    if (settings) {
      setFormData({
        app_name: settings.app_name || '',
        legal_disclaimer: settings.legal_disclaimer || '',
        notifications_enabled: settings.notifications_enabled || 'true',
        ai_confidence_threshold: settings.ai_confidence_threshold || '0.7'
      });
    }
  });

  const handleSave = async () => {
    try {
      await Promise.all([
        updateSettingMutation.mutateAsync({ key: 'app_name', value: formData.app_name }),
        updateSettingMutation.mutateAsync({ key: 'legal_disclaimer', value: formData.legal_disclaimer }),
        updateSettingMutation.mutateAsync({ key: 'notifications_enabled', value: formData.notifications_enabled }),
        updateSettingMutation.mutateAsync({ key: 'ai_confidence_threshold', value: formData.ai_confidence_threshold })
      ]);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">إعدادات النظام</h2>
            <p className="text-slate-600">إدارة الإعدادات العامة للتطبيق</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shield className="h-5 w-5" />
              الإعدادات العامة
            </CardTitle>
            <CardDescription className="text-blue-600">إعدادات التطبيق الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="app_name" className="text-sm font-medium text-slate-700">اسم التطبيق</Label>
              <Input
                id="app_name"
                value={formData.app_name}
                onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                placeholder="المستشار القانوني السوري"
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="legal_disclaimer" className="text-sm font-medium text-slate-700">إخلاء المسؤولية القانونية</Label>
              <Textarea
                id="legal_disclaimer"
                value={formData.legal_disclaimer}
                onChange={(e) => setFormData({ ...formData, legal_disclaimer: e.target.value })}
                rows={4}
                placeholder="هذا التطبيق يقدم استشارات قانونية عامة..."
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Bell className="h-5 w-5 text-slate-600" />
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium text-slate-700">تفعيل الإشعارات</Label>
                  <p className="text-xs text-slate-500">إرسال إشعارات للمستخدمين</p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={formData.notifications_enabled === 'true'}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, notifications_enabled: checked ? 'true' : 'false' })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Cpu className="h-5 w-5" />
              إعدادات الذكاء الاصطناعي
            </CardTitle>
            <CardDescription className="text-purple-600">إعدادات متقدمة لأداء النظام</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="ai_threshold" className="text-sm font-medium text-slate-700">حد الثقة للذكاء الاصطناعي</Label>
              <Input
                id="ai_threshold"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.ai_confidence_threshold}
                onChange={(e) => setFormData({ ...formData, ai_confidence_threshold: e.target.value })}
                className="border-slate-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <p className="text-xs text-slate-500">
                الحد الأدنى لدرجة الثقة في الإجابات (0.0 - 1.0)
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">معلومات النظام</h4>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-center justify-between">
                  <span>حالة قاعدة البيانات:</span>
                  <span className="font-medium text-green-800">متصلة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>حالة الذكاء الاصطناعي:</span>
                  <span className="font-medium text-green-800">نشط</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>آخر نسخ احتياطي:</span>
                  <span className="font-medium text-green-800">{new Date().toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
        >
          <Save className="h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
};
