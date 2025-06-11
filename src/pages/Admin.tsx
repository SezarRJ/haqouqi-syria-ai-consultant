import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp, Settings, BookOpen, Database, Globe, Shield, Eye, EyeOff, Gift, CreditCard, Scale, BarChart3 } from 'lucide-react';
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
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    checkAdmin();
    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const checkAdmin = async () => {
    setIsCheckingAuth(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        console.log('Current user:', user);
        
        try {
          const { data: adminCheck, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

          console.log('Admin check result:', adminCheck, error);

          if (adminCheck && !error) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
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

  const handleGuestMode = () => {
    setGuestMode(true);
    setIsAdmin(true); // Allow guest access to admin features
    toast({
      title: language === 'ar' ? "وضع الزائر" : "Guest Mode",
      description: language === 'ar' ? "تم تفعيل وضع الزائر للوحة الإدارة" : "Guest mode activated for admin panel",
    });
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      console.log('Attempting admin login with:', loginData.email);
      
      // Check if it's the demo admin credentials
      if (loginData.email === 'admin@legaladvisor.com' && loginData.password === 'admin123456') {
        // Try to sign in first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password,
        });

        if (signInData.user && !signInError) {
          console.log('Admin sign in successful:', signInData.user);
          
          // Check if admin privileges exist
          const { data: adminCheck } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', signInData.user.id)
            .single();

          if (!adminCheck) {
            // Create admin privileges
            await supabase.from('admin_users').insert({
              user_id: signInData.user.id,
              admin_role: 'super_admin',
              is_active: true
            });
            console.log('Admin privileges created');
          }

          setUser(signInData.user);
          setIsAdmin(true);
          toast({
            title: language === 'ar' ? "تم تسجيل الدخول" : "Signed In",
            description: language === 'ar' ? "مرحباً بك في لوحة الإدارة" : "Welcome to admin panel",
          });
          return;
        }

        // If sign in fails due to email not confirmed, show helpful message
        if (signInError && signInError.message === 'Email not confirmed') {
          console.log('Admin email not confirmed, handling demo account');
          
          toast({
            title: language === 'ar' ? "حساب المدير التجريبي" : "Demo Admin Account",
            description: language === 'ar' ? 
              "هذا حساب تجريبي للمدير. سيتم إنشاؤه إذا لم يكن موجوداً." : 
              "This is a demo admin account. It will be created if it doesn't exist.",
          });

          // Try to create the admin account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: loginData.email,
            password: loginData.password,
            options: {
              data: {
                full_name: 'Admin User',
              },
              emailRedirectTo: window.location.origin
            },
          });

          if (signUpData.user && !signUpError) {
            console.log('Demo admin account created:', signUpData.user);
            
            // Create admin privileges
            await supabase.from('admin_users').insert({
              user_id: signUpData.user.id,
              admin_role: 'super_admin',
              is_active: true
            });

            toast({
              title: language === 'ar' ? "تم إنشاء حساب المشرف" : "Admin Account Created",
              description: language === 'ar' ? 
                "تم إنشاء حساب المشرف التجريبي. يرجى المحاولة مرة أخرى." : 
                "Demo admin account created. Please try logging in again.",
            });
          } else {
            console.error('Admin account creation failed:', signUpError);
            throw signUpError || new Error('Failed to create admin account');
          }
        } else {
          throw signInError || new Error('Failed to sign in');
        }
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      
      // Handle rate limiting gracefully
      if (error.message?.includes('rate limit') || error.message?.includes('security purposes')) {
        toast({
          title: language === 'ar' ? "يرجى الانتظار" : "Please Wait",
          description: language === 'ar' ? 
            "يرجى الانتظار قليلاً قبل المحاولة مرة أخرى" : 
            "Please wait a moment before trying again",
          variant: "destructive",
        });
      } else {
        toast({
          title: language === 'ar' ? "خطأ في تسجيل الدخول" : "Login Error",
          description: language === 'ar' ? "بيانات تسجيل الدخول غير صحيحة" : "Invalid login credentials",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const texts = {
    ar: {
      adminPanel: "لوحة إدارة المستشار القانوني",
      smartSystem: "نظام ذكي للاستشارات القانونية",
      adminLogin: "دخول لوحة الإدارة",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      signIn: "دخول لوحة الإدارة",
      signingIn: "جاري تسجيل الدخول...",
      loginCredentials: "بيانات تسجيل الدخول",
      signOut: "تسجيل الخروج",
      loading: "جاري التحميل...",
      signedOut: "تم تسجيل الخروج",
      signedOutDesc: "تم تسجيل خروجك من لوحة الإدارة",
      dashboard: "لوحة التحكم",
      laws: "القوانين",
      vouchers: "الكوبونات",
      payments: "المدفوعات",
      database: "قاعدة البيانات",
      integrations: "التكاملات",
      users: "المستخدمون",
      analytics: "التحليلات",
      settings: "الإعدادات",
      more: "المزيد",
      comprehensiveManagement: "إدارة شاملة للنظام القانوني والمحتوى",
      guestMode: "وضع الزائر",
      accessAsGuest: "دخول كزائر"
    },
    en: {
      adminPanel: "Legal Advisor Admin Panel",
      smartSystem: "Smart Legal Consultation System",
      adminLogin: "Admin Panel Login",
      email: "Email",
      password: "Password",
      signIn: "Sign In to Admin Panel",
      signingIn: "Signing in...",
      loginCredentials: "Login Credentials",
      signOut: "Sign Out",
      loading: "Loading...",
      signedOut: "Signed Out",
      signedOutDesc: "You have been signed out from admin panel",
      dashboard: "Dashboard",
      laws: "Laws",
      vouchers: "Vouchers",
      payments: "Payments",
      database: "Database",
      integrations: "Integrations",
      users: "Users",
      analytics: "Analytics",
      settings: "Settings",
      more: "More",
      comprehensiveManagement: "Comprehensive management for legal system and content",
      guestMode: "Guest Mode",
      accessAsGuest: "Access as Guest"
    }
  };

  const t = texts[language];

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin && !guestMode)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className={`absolute top-4 z-10 flex items-center gap-4 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
          <LanguageSwitcher language={language} onLanguageChange={handleLanguageChange} variant="compact" />
          <BackButton />
        </div>
        
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Scale className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900 mb-2">{t.adminPanel}</CardTitle>
              <CardDescription className="text-blue-600 text-lg">{t.smartSystem}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Guest Mode Button */}
              <Button 
                onClick={handleGuestMode}
                className={`w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg text-lg font-semibold ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Users className="h-5 w-5 mx-2" />
                {t.accessAsGuest}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">أو</span>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-blue-900">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="admin@legaladvisor.com"
                    className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-blue-900">{t.password}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="admin123456"
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
                  {isLoggingIn ? t.signingIn : t.signIn}
                </Button>
              </form>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3 text-center">{t.loginCredentials}</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t.email}:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">admin@legaladvisor.com</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t.password}:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">admin123456</code>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex items-center space-x-4 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                <h1 className="text-xl md:text-2xl font-bold text-blue-900">{t.adminPanel}</h1>
                <p className="text-sm text-blue-600 hidden md:block">{t.comprehensiveManagement}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <LanguageSwitcher language={language} onLanguageChange={handleLanguageChange} variant="compact" />
              {guestMode ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                  {t.guestMode}
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                  {isMobile ? user.email?.split('@')[0] : user.email}
                </Badge>
              )}
              <BackButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4' : 'grid-cols-9'} bg-white/95 backdrop-blur-sm border border-blue-200 shadow-sm h-12`}>
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t.dashboard}</span>
              <span className="sm:hidden text-xs">{t.dashboard}</span>
            </TabsTrigger>
            <TabsTrigger value="laws" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t.laws}</span>
              <span className="sm:hidden text-xs">{t.laws}</span>
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="vouchers" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <Gift className="h-4 w-4" />
                  {t.vouchers}
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <CreditCard className="h-4 w-4" />
                  {t.payments}
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <Database className="h-4 w-4" />
                  {t.database}
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <Globe className="h-4 w-4" />
                  {t.integrations}
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <Users className="h-4 w-4" />
                  {t.users}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                  <BarChart3 className="h-4 w-4" />
                  {t.analytics}
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings}</span>
              <span className="sm:hidden text-xs">{t.settings}</span>
            </TabsTrigger>
            {isMobile && (
              <TabsTrigger value="more" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">{t.more}</span>
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
                  { key: 'vouchers', icon: Gift, title: t.vouchers },
                  { key: 'payments', icon: CreditCard, title: t.payments },
                  { key: 'database', icon: Database, title: t.database },
                  { key: 'integrations', icon: Globe, title: t.integrations },
                  { key: 'users', icon: Users, title: t.users },
                  { key: 'analytics', icon: BarChart3, title: t.analytics }
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
