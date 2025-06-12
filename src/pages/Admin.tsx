
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Check auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (currentUser: User | null) => {
    setIsLoading(true);
    
    if (!currentUser) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      // Check if user is admin in the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(profile?.role === 'admin');
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    }
    
    setIsLoading(false);
  };

  const handleAdminLogin = async () => {
    // Default admin credentials for demo purposes
    const defaultAdminUsername = 'admin';
    const defaultAdminPassword = 'admin123';

    if (adminCredentials.username === defaultAdminUsername && 
        adminCredentials.password === defaultAdminPassword) {
      
      // If user is authenticated, update their role to admin
      if (user) {
        try {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              role: 'admin',
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.error('Error updating admin role:', error);
            toast({
              title: language === 'ar' ? "خطأ" : "Error",
              description: language === 'ar' ? "فشل في تحديث صلاحيات الإدارة" : "Failed to update admin permissions",
              variant: "destructive"
            });
            return;
          }

          setIsAdmin(true);
          toast({
            title: language === 'ar' ? "تم بنجاح" : "Success",
            description: language === 'ar' ? "تم تسجيل الدخول كمدير بنجاح" : "Successfully logged in as admin",
          });
        } catch (error) {
          console.error('Error in admin login:', error);
          toast({
            title: language === 'ar' ? "خطأ" : "Error",
            description: language === 'ar' ? "حدث خطأ أثناء تسجيل الدخول" : "An error occurred during login",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "يجب تسجيل الدخول أولاً" : "Please login first",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "بيانات الدخول غير صحيحة" : "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  const texts = {
    ar: {
      title: 'لوحة تحكم الإدارة',
      description: 'إدارة النظام والمستخدمين',
      backToHome: 'العودة للرئيسية',
      loginRequired: 'تسجيل دخول الإدارة مطلوب',
      loginDescription: 'أدخل بيانات الدخول للوصول إلى لوحة تحكم الإدارة',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      defaultCredentials: 'بيانات الدخول الافتراضية: admin / admin123'
    },
    en: {
      title: 'Admin Dashboard',
      description: 'System and user management',
      backToHome: 'Back to Home',
      loginRequired: 'Admin Login Required',
      loginDescription: 'Enter credentials to access the admin dashboard',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      defaultCredentials: 'Default credentials: admin / admin123'
    }
  };

  const t = texts[language];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>
              {language === 'ar' ? 'يجب تسجيل الدخول أولاً للوصول إلى لوحة الإدارة' : 'Please login first to access admin panel'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              {t.backToHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>{t.loginRequired}</CardTitle>
            <CardDescription>{t.loginDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t.username}</Label>
              <Input
                id="username"
                type="text"
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder={t.username}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder={t.password}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              {t.defaultCredentials}
            </div>
            <Button onClick={handleAdminLogin} className="w-full">
              {t.login}
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              {t.backToHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6">
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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
          </div>
        </div>

        <AdminDashboard language={language} />
      </div>
    </div>
  );
};

export default Admin;
