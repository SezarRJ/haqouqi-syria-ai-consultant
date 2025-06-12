
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const texts = {
    ar: {
      title: 'المستشار القانوني الذكي',
      subtitle: 'نظام ذكي للاستشارات القانونية',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب جديد',
      signInDesc: 'سجل دخولك للوصول إلى حسابك',
      signUpDesc: 'أنشئ حساباً جديداً للاستفادة من خدماتنا',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      fullName: 'الاسم الكامل',
      signInButton: 'تسجيل الدخول',
      signUpButton: 'إنشاء الحساب',
      backToHome: 'العودة للرئيسية',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      signInSuccess: 'تم تسجيل الدخول بنجاح',
      signUpSuccess: 'تم إنشاء الحساب بنجاح',
      signInError: 'خطأ في تسجيل الدخول',
      signUpError: 'خطأ في إنشاء الحساب'
    },
    en: {
      title: 'Smart Legal Advisor',
      subtitle: 'Intelligent Legal Consultation System',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signInDesc: 'Sign in to access your account',
      signUpDesc: 'Create a new account to access our services',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      signInButton: 'Sign In',
      signUpButton: 'Create Account',
      backToHome: 'Back to Home',
      passwordMismatch: 'Passwords do not match',
      signInSuccess: 'Successfully signed in',
      signUpSuccess: 'Account created successfully',
      signInError: 'Error signing in',
      signUpError: 'Error creating account'
    }
  };

  const t = texts[language];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: t.signInSuccess,
        description: t.signInSuccess,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: t.signInError,
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t.passwordMismatch,
        description: t.passwordMismatch,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: t.signUpSuccess,
        description: t.signUpSuccess,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: t.signUpError,
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className={`mb-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} flex items-center gap-2`}
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-blue-600">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="border-blue-200 shadow-xl">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
              <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  {t.signIn}
                </CardTitle>
                <CardDescription>{t.signInDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t.email}</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t.password}</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Lock className="h-4 w-4 mr-2" />
                    {isLoading ? '...' : t.signInButton}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {t.signUp}
                </CardTitle>
                <CardDescription>{t.signUpDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t.fullName}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t.email}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t.password}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">{t.confirmPassword}</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <User className="h-4 w-4 mr-2" />
                    {isLoading ? '...' : t.signUpButton}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
