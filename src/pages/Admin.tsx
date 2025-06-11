import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp, Settings, BookOpen, Database, Globe } from 'lucide-react';
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
        
        // Check if user is admin using the is_admin function
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
        
        // Check admin status after login using the function
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
        // Add to admin_users table using RPC function
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="absolute top-4 right-4">
          <BackButton />
        </div>
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">تسجيل دخول المشرف</CardTitle>
            <CardDescription className="text-center">
              أدخل بيانات المشرف للوصول إلى لوحة الإدارة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="admin123"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleSignUp}
              >
                إنشاء حساب مشرف جديد
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">بيانات تسجيل الدخول للمشرف</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>البريد الإلكتروني:</strong> admin@example.com</p>
                <p><strong>كلمة المرور:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة إدارة المستشار القانوني</h1>
            <p className="text-gray-600">إدارة شاملة للنظام القانوني والمحتوى</p>
            <Badge variant="secondary" className="mt-2">
              مرحباً، {user.email}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                setIsAdmin(false);
                toast({
                  title: "تم تسجيل الخروج",
                  description: "تم تسجيل خروجك من لوحة الإدارة",
                });
              }}
            >
              تسجيل الخروج
            </Button>
            <BackButton />
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="laws" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              القوانين
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              قاعدة البيانات
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              التكاملات
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              التحديثات
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
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
