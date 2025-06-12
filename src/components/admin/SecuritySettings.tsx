
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettingsProps {
  language: 'ar' | 'en';
}

interface SecuritySetting {
  key: string;
  value: string;
  description: string;
}

export const SecuritySettings = ({ language }: SecuritySettingsProps) => {
  const [settings, setSettings] = useState<SecuritySetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const texts = {
    ar: {
      title: 'إعدادات الأمان',
      description: 'إدارة إعدادات النظام الأمنية والسياسات',
      save: 'حفظ',
      saved: 'تم الحفظ',
      error: 'خطأ في الحفظ',
      maxLoginAttempts: 'الحد الأقصى لمحاولات الدخول',
      sessionTimeout: 'انتهاء صلاحية الجلسة (دقيقة)',
      requireEmailVerification: 'تطلب تأكيد البريد الإلكتروني',
      enableTwoFactor: 'تفعيل التحقق المزدوج',
      passwordMinLength: 'الحد الأدنى لطول كلمة المرور',
      enableRateLimit: 'تفعيل تحديد المعدل',
      auditLogRetention: 'الاحتفاظ بسجلات التدقيق (أيام)',
      securityStatus: 'حالة الأمان'
    },
    en: {
      title: 'Security Settings',
      description: 'Manage system security settings and policies',
      save: 'Save',
      saved: 'Saved',
      error: 'Save Error',
      maxLoginAttempts: 'Max Login Attempts',
      sessionTimeout: 'Session Timeout (minutes)',
      requireEmailVerification: 'Require Email Verification',
      enableTwoFactor: 'Enable Two-Factor Auth',
      passwordMinLength: 'Minimum Password Length',
      enableRateLimit: 'Enable Rate Limiting',
      auditLogRetention: 'Audit Log Retention (days)',
      securityStatus: 'Security Status'
    }
  };

  const t = texts[language];

  const defaultSettings = [
    { key: 'max_login_attempts', value: '5', description: t.maxLoginAttempts },
    { key: 'session_timeout', value: '60', description: t.sessionTimeout },
    { key: 'require_email_verification', value: 'true', description: t.requireEmailVerification },
    { key: 'enable_two_factor', value: 'false', description: t.enableTwoFactor },
    { key: 'password_min_length', value: '8', description: t.passwordMinLength },
    { key: 'enable_rate_limit', value: 'true', description: t.enableRateLimit },
    { key: 'audit_log_retention', value: '90', description: t.auditLogRetention }
  ];

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .in('setting_key', defaultSettings.map(s => s.key));

      if (error) {
        console.error('Error fetching settings:', error);
        // Use default settings if fetch fails
        setSettings(defaultSettings);
        return;
      }

      // Merge with defaults for any missing settings
      const fetchedKeys = data?.map(d => d.setting_key) || [];
      const mergedSettings = [
        ...(data || []).map(d => ({
          key: d.setting_key,
          value: d.setting_value,
          description: defaultSettings.find(ds => ds.key === d.setting_key)?.description || d.description || ''
        })),
        ...defaultSettings.filter(ds => !fetchedKeys.includes(ds.key))
      ];

      setSettings(mergedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      setSaving(key);
      const setting = settings.find(s => s.key === key);
      
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          description: setting?.description || '',
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving setting:', error);
        toast({
          title: t.error,
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Update local state
      setSettings(prev => prev.map(s => 
        s.key === key ? { ...s, value } : s
      ));

      toast({
        title: t.saved,
        description: setting?.description,
      });
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSecurityScore = () => {
    let score = 0;
    const enabledFeatures = settings.filter(s => 
      (s.key.includes('enable') || s.key.includes('require')) && s.value === 'true'
    ).length;
    
    score += enabledFeatures * 20;
    
    const minPasswordLength = parseInt(settings.find(s => s.key === 'password_min_length')?.value || '8');
    if (minPasswordLength >= 8) score += 20;
    
    return Math.min(score, 100);
  };

  const securityScore = getSecurityScore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <Label className="font-medium">{setting.description}</Label>
                  <p className="text-sm text-gray-500 mt-1">{setting.key}</p>
                </div>
                <div className="flex items-center gap-3">
                  {setting.key.includes('enable') || setting.key.includes('require') ? (
                    <Switch
                      checked={setting.value === 'true'}
                      onCheckedChange={(checked) => 
                        saveSetting(setting.key, checked ? 'true' : 'false')
                      }
                      disabled={saving === setting.key}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        value={setting.value}
                        onChange={(e) => {
                          const newSettings = settings.map(s => 
                            s.key === setting.key ? { ...s, value: e.target.value } : s
                          );
                          setSettings(newSettings);
                        }}
                        className="w-20"
                        type="number"
                        min="1"
                      />
                      <Button
                        size="sm"
                        onClick={() => saveSetting(setting.key, setting.value)}
                        disabled={saving === setting.key}
                      >
                        {saving === setting.key ? '...' : t.save}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle>{t.securityStatus}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="relative">
                <div className={`text-4xl font-bold ${
                  securityScore >= 80 ? 'text-green-600' : 
                  securityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {securityScore}%
                </div>
                <div className="text-sm text-gray-500">Security Score</div>
              </div>
              
              <div className="space-y-2">
                {securityScore >= 80 ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {language === 'ar' ? 'أمان ممتاز' : 'Excellent Security'}
                  </Badge>
                ) : securityScore >= 60 ? (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {language === 'ar' ? 'أمان جيد' : 'Good Security'}
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {language === 'ar' ? 'يحتاج تحسين' : 'Needs Improvement'}
                  </Badge>
                )}
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>{language === 'ar' ? 'آخر تحديث:' : 'Last updated:'}</p>
                <p>{new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
