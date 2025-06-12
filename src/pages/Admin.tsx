
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, LogIn, User, Lock } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const texts = {
    ar: {
      title: 'لوحة تحكم الإدارة',
      description: 'إدارة النظام والمستخدمين والإعدادات',
      loginTitle: 'تسجيل دخول الإدارة',
      loginDesc: 'أدخل بيانات الإدارة للوصول إلى لوحة التحكم',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      loginError: 'بيانات الدخول غير صحيحة',
      defaultCredentials: 'استخدم: admin / admin123'
    },
    en: {
      title: 'Admin Dashboard',
      description: 'Manage system, users, and settings',
      loginTitle: 'Admin Login',
      loginDesc: 'Enter admin credentials to access the dashboard',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      logout: 'Logout',
      loginSuccess: 'Login successful',
      loginError: 'Invalid credentials',
      defaultCredentials: 'Use: admin / admin123'
    }
  };

  const t = texts[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate admin authentication
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        toast({
          title: t.loginSuccess,
          description: t.loginSuccess,
        });
      } else {
        toast({
          title: t.loginError,
          description: t.loginError,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setCredentials({ username: '', password: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
            <BackButton />
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-red-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5 text-red-600" />
                  {t.loginTitle}
                </CardTitle>
                <CardDescription>{t.loginDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t.username}</Label>
                    <Input
                      id="username"
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                      required
                      className="text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t.password}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="text-center"
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-blue-600 font-medium">{t.defaultCredentials}</p>
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    <Lock className="h-4 w-4 mr-2" />
                    {isLoading ? '...' : t.login}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleLogout}>
              {t.logout}
            </Button>
            <BackButton />
          </div>
        </div>

        <AdminDashboard language={language} />
      </div>
    </div>
  );
};

export default Admin;
