
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp, Settings, BookOpen, Database, Globe, Shield, Eye, EyeOff } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';

const Admin = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginData, setLoginData] = useState({ email: 'admin@example.com', password: 'admin123' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    setIsCheckingAuth(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Check if user is admin - allow admin@example.com or check admin status
        if (user.email === 'admin@example.com') {
          setIsAdmin(true);
        } else {
          try {
            const { data: isAdminResult, error } = await supabase
              .rpc('is_admin', { user_id: user.id });

            if (error) {
              console.error('Admin check error:', error);
              setIsAdmin(false);
            } else {
              setIsAdmin(isAdminResult || false);
            }

            if (!isAdminResult) {
              toast({
                title: "غير مصرح",
                description: "ليس لديك صلاحية للوصول إلى لوحة الإدارة",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('RPC function error:', error);
            setIsAdmin(false);
          }
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
      // First try to sign up the admin user if it doesn't exist
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: loginData.email,
        password: loginData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      // If sign up fails because user already exists, try to sign in
      if (signUpError && signUpError.message.includes('already registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password,
        });

        if (signInError) throw signInError;

        if (signInData.user) {
          setUser(signInData.user);
          setIsAdmin(true);
          toast({
            title: "تم تسجيل الدخول",
            description: "مرحباً بك في لوحة الإدارة",
          });
        }
      } else if (signUpError) {
        throw signUpError;
      } else if (signUpData.user) {
        // New user created successfully
        setUser(signUpData.user);
        setIsAdmin(true);
        toast({
          title: "تم إنشاء حساب المشرف",
          description: "تم إنشاء حساب المشرف وتسجيل الدخول بنجاح",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="absolute top-4 right-4 z-10">
          <BackButton />
        </div>
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="admin123"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-bold text-slate-800">لوحة إدارة المستشار القانوني</h1>
                <p className="text-sm text-slate-600 hidden md:block">إدارة شاملة للنظام القانوني والمحتوى</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs md:text-sm">
                {isMobile ? user.email?.split('@')[0] : user.email}
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
                className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs md:text-sm"
              >
                خروج
              </Button>
              <BackButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4' : 'grid-cols-8'} bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm ${isMobile ? 'text-xs' : ''}`}>
            <TabsTrigger value="dashboard" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">لوحة التحكم</span>
              <span className="sm:hidden">التحكم</span>
            </TabsTrigger>
            <TabsTrigger value="laws" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">القوانين</span>
              <span className="sm:hidden">قوانين</span>
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="database" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Database className="h-4 w-4" />
                  قاعدة البيانات
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Globe className="h-4 w-4" />
                  التكاملات
                </TabsTrigger>
                <TabsTrigger value="updates" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  التحديثات
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Users className="h-4 w-4" />
                  المستخدمون
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <TrendingUp className="h-4 w-4" />
                  التحليلات
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="settings" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Settings className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">الإعدادات</span>
              <span className="sm:hidden">إعدادات</span>
            </TabsTrigger>
            {isMobile && (
              <TabsTrigger value="more" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <AlertCircle className="h-3 w-3" />
                المزيد
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="laws">
            <LawsManagement />
          </TabsContent>

          {!isMobile ? (
            <>
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
            </>
          ) : (
            <TabsContent value="more">
              <div className="grid grid-cols-1 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => setActiveTab('database')}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Database className="h-5 w-5" />
                      قاعدة البيانات
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => setActiveTab('integrations')}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5" />
                      التكاملات
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => setActiveTab('updates')}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      التحديثات
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => setActiveTab('users')}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5" />
                      المستخدمون
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => setActiveTab('analytics')}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5" />
                      التحليلات
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
          )}

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
