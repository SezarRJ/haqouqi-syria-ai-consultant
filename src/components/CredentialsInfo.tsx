
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, User, Shield, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CredentialsInfo = () => {
  const [showPasswords, setShowPasswords] = useState(false);
  const { toast } = useToast();

  const credentials = {
    user: {
      email: 'user@example.com',
      password: 'user123456',
      role: 'مستخدم عادي'
    },
    admin: {
      email: 'admin@example.com',
      password: 'admin123456',
      role: 'مدير النظام'
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${type} إلى الحافظة`,
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="bg-green-100 border-b border-green-200">
          <CardTitle className="flex items-center gap-3 text-green-900">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Key className="h-4 w-4 text-white" />
            </div>
            بيانات الدخول للنظام
          </CardTitle>
          <CardDescription className="text-green-700">
            استخدم هذه البيانات للوصول إلى النظام وإدارة المحتوى
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">معلومات الحسابات</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center gap-2"
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPasswords ? 'إخفاء كلمات المرور' : 'عرض كلمات المرور'}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Account */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50 pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-900 text-base">
                  <User className="h-5 w-5" />
                  حساب المستخدم
                </CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {credentials.user.role}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm">
                      {credentials.user.email}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(credentials.user.email, 'البريد الإلكتروني')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm">
                      {showPasswords ? credentials.user.password : '••••••••'}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(credentials.user.password, 'كلمة المرور')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Account */}
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 pb-3">
                <CardTitle className="flex items-center gap-2 text-red-900 text-base">
                  <Shield className="h-5 w-5" />
                  حساب المدير
                </CardTitle>
                <Badge variant="destructive" className="w-fit">
                  {credentials.admin.role}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm">
                      {credentials.admin.email}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(credentials.admin.email, 'البريد الإلكتروني')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-sm">
                      {showPasswords ? credentials.admin.password : '••••••••'}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(credentials.admin.password, 'كلمة المرور')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-800 text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">ملاحظات مهمة:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• يتم إنشاء هذه الحسابات تلقائياً عند المحاولة الأولى للدخول</li>
                  <li>• حساب المدير يحصل على صلاحيات إدارية كاملة تلقائياً</li>
                  <li>• يُنصح بتغيير كلمات المرور بعد أول تسجيل دخول</li>
                  <li>• احتفظ بهذه البيانات في مكان آمن</li>
                  <li>• للوصول إلى لوحة الإدارة، اذهب إلى /admin في المتصفح</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
