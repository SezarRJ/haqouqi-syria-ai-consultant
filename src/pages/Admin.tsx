
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp, Settings, BookOpen, Database, Globe, Shield } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LawsManagement } from '@/components/admin/LawsManagement';
import { UpdatesManagement } from '@/components/admin/UpdatesManagement';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { Analytics } from '@/components/admin/Analytics';
import { DatabaseManagement } from '@/components/admin/DatabaseManagement';
import { Integrations } from '@/components/admin/Integrations';
import { BackButton } from '@/components/BackButton';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginData, setLoginData] = useState({ email: 'admin@example.com', password: 'admin123' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    setIsCheckingAuth(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const { data: isAdminResult, error } = await supabase
          .rpc('is_admin', { user_id: user.id });

        if (error) {
          console.error('Admin check error:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(isAdminResult || user.email === 'admin@example.com');
        }

        if (!isAdminResult && user.email !== 'admin@example.com') {
          toast({
            title: "غير مصرح",
            description: "ليس لديك صلاحية للوصول إلى لوحة الإدارة",
            variant: "destructive",
          });
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        
        const { data: isAdminResult, error: adminError } = await supabase
          .rpc('is_admin', { user_id: data.user.id });

        if (adminError) {
          console.error('Admin check error:', adminError);
        }

        if (isAdminResult || data.user.email === 'admin@example.com') {
          setIsAdmin(true);
          toast({
            title: "تم تسجيل الدخول",
            description: "مرحباً بك في لوحة الإدارة",
          });
        } else {
          setIsAdmin(false);
          toast({
            title: "خطأ في صلاحيات الدخول",
            description: "ليس لديك صلاحية للوصول إلى لوحة الإدارة",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        }
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'admin123',
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: adminError } = await supabase
          .rpc('create_admin_user', { 
            p_user_id: data.user.id,
            p_admin_role: 'super_admin'
          });

        if (adminError) {
          console.error('Error creating admin user:', adminError);
        }

        toast({
          title: "تم إنشاء حساب المشرف",
          description: "تم إنشاء حساب المشرف بنجاح",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center" dir="rtl">
        <div className="absolute top-6 right-6">
          <BackButton />
        </div>
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">لوحة الإدارة</CardTitle>
            <CardDescription className="text-slate-600">
              أدخل بيانات المشرف للوصول إلى النظام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="admin123"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">أو</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={handleSignUp}
            >
              إنشاء حساب مشرف جديد
            </Button>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">بيانات تسجيل الدخول</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><span className="font-medium">البريد:</span> admin@example.com</p>
                <p><span className="font-medium">كلمة المرور:</span> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">لوحة إدارة المستشار القانوني</h1>
                <p className="text-slate-600">إدارة شاملة للنظام القانوني والمحتوى</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                مرحباً، {user.email}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  setIsAdmin(false);
                  toast({
                    title: "تم تسجيل الخروج",
                    description: "تم تسجيل خروجك من لوحة الإدارة",
                  });
                }}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                تسجيل الخروج
              </Button>
              <BackButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="laws" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4" />
              القوانين
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Database className="h-4 w-4" />
              قاعدة البيانات
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Globe className="h-4 w-4" />
              التكاملات
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              التحديثات
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="laws">
            <LawsManagement />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseManagement />
          </TabsContent>

          <TabsContent value="integrations">
            <Integrations />
          </TabsContent>

          <TabsContent value="updates">
            <UpdatesManagement />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
