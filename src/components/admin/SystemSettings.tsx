
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save } from 'lucide-react';
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
      
      // Convert array to object for easier access
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

  // Update form data when settings load
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
        <div>
          <h2 className="text-2xl font-bold">إعدادات النظام</h2>
          <p className="text-gray-600">إدارة الإعدادات العامة للتطبيق</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              الإعدادات العامة
            </CardTitle>
            <CardDescription>إعدادات التطبيق الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="app_name">اسم التطبيق</Label>
              <Input
                id="app_name"
                value={formData.app_name}
                onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                placeholder="المستشار القانوني السوري"
              />
            </div>
            
            <div>
              <Label htmlFor="legal_disclaimer">إخلاء المسؤولية القانونية</Label>
              <Textarea
                id="legal_disclaimer"
                value={formData.legal_disclaimer}
                onChange={(e) => setFormData({ ...formData, legal_disclaimer: e.target.value })}
                rows={4}
                placeholder="هذا التطبيق يقدم استشارات قانونية عامة..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">تفعيل الإشعارات</Label>
                <p className="text-sm text-gray-500">إرسال إشعارات للمستخدمين</p>
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
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الذكاء الاصطناعي</CardTitle>
            <CardDescription>إعدادات متقدمة لأداء النظام</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ai_threshold">حد الثقة للذكاء الاصطناعي</Label>
              <Input
                id="ai_threshold"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.ai_confidence_threshold}
                onChange={(e) => setFormData({ ...formData, ai_confidence_threshold: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                الحد الأدنى لدرجة الثقة في الإجابات (0.0 - 1.0)
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">معلومات النظام</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>حالة قاعدة البيانات: متصلة</p>
                <p>حالة الذكاء الاصطناعي: نشط</p>
                <p>آخر نسخ احتياطي: {new Date().toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
};
