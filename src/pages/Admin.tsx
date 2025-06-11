
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp, Settings, BookOpen, Database, Globe, Shield, Eye, EyeOff, Gift, CreditCard, Scale } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LawsManagement } from '@/components/admin/LawsManagement';
import { UpdatesManagement } from '@/components/admin/UpdatesManagement';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { Analytics } from '@/components/admin/Analytics';
import { DatabaseManagement } from '@/components/admin/DatabaseManagement';
import { Integrations } from '@/components/admin/Integrations';
import { VoucherManagement } from '@/components/admin/VoucherManagement';
import { PaymentManagement } from '@/components/admin/PaymentManagement';
import { BackButton } from '@/components/BackButton';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Admin = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
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
        
        // Check if user is admin
        try {
          const { data: adminCheck, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

          if (adminCheck && !error) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            toast({
              title: "غير مصرح",
              description: "ليس لديك صلاحية للوصول إلى لوحة الإدارة",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Admin check error:', error);
          setIsAdmin(false);
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
      // Create admin account if it doesn't exist
      if (loginData.email === 'admin@legal.com' && loginData.password === 'Admin123!') {
        // Try to sign in first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password,
        });

        if (signInData.user) {
          // Check if admin record exists
          const { data: adminCheck } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', signInData.user.id)
            .single();

          if (!adminCheck) {
            // Create admin record
            await supabase.from('admin_users').insert({
              user_id: signInData.user.id,
              admin_role: 'super_admin',
              is_active: true
            });
          }

          setUser(signInData.user);
          setIsAdmin(true);
          toast({
            title: "تم تسجيل الدخول",
            description: "مرحباً بك في لوحة الإدارة",
          });
          return;
        }

        // If sign in fails, try to sign up
        if (signInError && signInError.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: loginData.email,
            password: loginData.password,
          });

          if (signUpData.user && !signUpError) {
            // Create admin user record
            await supabase.from('admin_users').insert({
              user_id: signUpData.user.id,
              admin_role: 'super_admin',
              is_active: true
            });

            setUser(signUpData.user);
            setIsAdmin(true);
            toast({
              title: "تم إنشاء حساب المشرف",
              description: "تم إنشاء حساب المشرف وتسجيل الدخول بنجاح",
            });
          } else {
            throw signUpError || new Error('Failed to create admin account');
          }
        } else {
          throw signInError;
        }
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "بيانات تسجيل الدخول غير صحيحة",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4" dir="rtl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4" dir="rtl">
        <div className="absolute top-4 right-4 z-10">
          <BackButton />
        </div>
        
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Scale className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900 mb-2">لوحة إدارة المستشار القانوني</CardTitle>
              <CardDescription className="text-blue-600 text-lg">
                نظام ذكي للاستشارات القانونية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-blue-900">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="admin@legal.com"
                    className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-blue-900">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Admin123!"
                      className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-blue-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg text-lg font-semibold"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'جاري تسجيل الدخول...' : 'دخول لوحة الإدارة'}
                </Button>
              </form>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3 text-center">بيانات تسجيل الدخول</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">البريد الإلكتروني:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">admin@legal.com</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">كلمة المرور:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">Admin123!</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir="rtl">
      <div className="bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-blue-900">لوحة إدارة المستشار القانوني</h1>
                <p className="text-sm text-blue-600 hidden md:block">إدارة شاملة للنظام القانوني والمحتوى</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
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
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                تسجيل الخروج
              </Button>
              <BackButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4' : 'grid-cols-9'} bg-white/95 backdrop-blur-sm border border-blue-200 shadow-sm h-12`}>
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">لوحة التحكم</span>
              <span className="sm:hidden text-xs">التحكم</span>
            </TabsTrigger>
            <TabsTrigger value="laws" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">القوانين</span>
              <span className="sm:hidden text-xs">قوانين</span>
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="vouchers" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <Gift className="h-4 w-4" />
                  الكوبونات
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <CreditCard className="h-4 w-4" />
                  المدفوعات
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <Database className="h-4 w-4" />
                  قاعدة البيانات
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <Globe className="h-4 w-4" />
                  التكاملات
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <Users className="h-4 w-4" />
                  المستخدمون
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <TrendingUp className="h-4 w-4" />
                  التحليلات
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">الإعدادات</span>
              <span className="sm:hidden text-xs">إعدادات</span>
            </TabsTrigger>
            {isMobile && (
              <TabsTrigger value="more" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">المزيد</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="laws">
            <LawsManagement />
          </TabsContent>

          <TabsContent value="vouchers">
            <VoucherManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>

          {!isMobile ? (
            <>
              <TabsContent value="database">
                <DatabaseManagement />
              </TabsContent>

              <TabsContent value="integrations">
                <Integrations />
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
                {[
                  { key: 'vouchers', icon: Gift, title: 'الكوبونات' },
                  { key: 'payments', icon: CreditCard, title: 'المدفوعات' },
                  { key: 'database', icon: Database, title: 'قاعدة البيانات' },
                  { key: 'integrations', icon: Globe, title: 'التكاملات' },
                  { key: 'users', icon: Users, title: 'المستخدمون' },
                  { key: 'analytics', icon: TrendingUp, title: 'التحليلات' }
                ].map(({ key, icon: Icon, title }) => (
                  <Card 
                    key={key}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border-blue-200 hover:border-blue-300" 
                    onClick={() => setActiveTab(key)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg text-blue-900">
                        <Icon className="h-5 w-5 text-blue-600" />
                        {title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="database">
            <DatabaseManagement />
          </TabsContent>

          <TabsContent value="integrations">
            <Integrations />
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
