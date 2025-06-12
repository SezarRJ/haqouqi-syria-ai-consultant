import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Import Google and Facebook icons
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/BackButton';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('en'); // Default to English for auth page

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Redirect if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const texts = {
    en: {
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      submitLogin: 'Login',
      submitSignup: 'Sign Up',
      or: 'OR',
      loginSuccess: 'Login successful!',
      signupSuccess: 'Please check your email to confirm your account!',
      loginError: 'Login failed: Invalid credentials.',
      signupError: 'Sign up failed:',
      passwordMismatch: 'Passwords do not match.',
      signInWithGoogle: 'Sign in with Google', // New text
      signInWithFacebook: 'Sign in with Facebook', // New text
      back: 'Back to Home'
    },
    ar: {
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      submitLogin: 'تسجيل الدخول',
      submitSignup: 'إنشاء حساب',
      or: 'أو',
      loginSuccess: 'تم تسجيل الدخول بنجاح!',
      signupSuccess: 'الرجاء التحقق من بريدك الإلكتروني لتأكيد حسابك!',
      loginError: 'فشل تسجيل الدخول: بيانات اعتماد غير صحيحة.',
      signupError: 'فشل إنشاء الحساب:',
      passwordMismatch: 'كلمات المرور غير متطابقة.',
      signInWithGoogle: 'تسجيل الدخول باستخدام جوجل', // New text
      signInWithFacebook: 'تسجيل الدخول باستخدام فيسبوك', // New text
      back: 'العودة للصفحة الرئيسية'
    },
  };

  const t = texts[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({
        title: t.loginError,
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t.loginSuccess,
        variant: 'default',
      });
      // Navigation handled by auth listener
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: t.passwordMismatch,
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast({
        title: t.signupError,
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t.signupSuccess,
        variant: 'default',
      });
    }
    setLoading(false);
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + '/', // Redirects to home after successful OAuth
      },
    });
    if (error) {
      toast({
        title: `OAuth Login Failed for ${provider}`,
        description: error.message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      <Card className="w-full max-w-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">{activeTab === 'login' ? t.login : t.signup}</CardTitle>
          <CardDescription>
            {activeTab === 'login' ? 'Enter your credentials to login' : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t.login}</TabsTrigger>
              <TabsTrigger value="signup">{t.signup}</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <Input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  {loading && activeTab === 'login' ? 'Logging in...' : t.submitLogin}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <User className="mr-2 h-4 w-4" />
                  )}
                  {loading && activeTab === 'signup' ? 'Signing up...' : t.submitSignup}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground dark:bg-gray-800 dark:text-gray-400">
                {t.or}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 hover:dark:bg-gray-600"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              {t.signInWithGoogle}
            </Button>
            <Button
              variant="outline"
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 hover:dark:bg-gray-600"
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading}
            >
              <FaFacebook className="mr-2 h-4 w-4" />
              {t.signInWithFacebook}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500 dark:text-gray-400">
          {/* Any footer text */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
