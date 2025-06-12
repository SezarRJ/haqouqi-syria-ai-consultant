
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, User, Loader2, Chrome, Facebook, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/BackButton';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('en');
  const [authAttempts, setAuthAttempts] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

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
      signInWithGoogle: 'Sign in with Google',
      signInWithFacebook: 'Sign in with Facebook',
      loginDescription: 'Enter your credentials to login',
      signupDescription: 'Create an account to get started',
      rateLimitError: 'Too many attempts. Please wait before trying again.',
      weakPassword: 'Password must be at least 8 characters long.',
      invalidEmail: 'Please enter a valid email address.',
      showPassword: 'Show password',
      hidePassword: 'Hide password'
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
      signInWithGoogle: 'تسجيل الدخول باستخدام جوجل',
      signInWithFacebook: 'تسجيل الدخول باستخدام فيسبوك',
      loginDescription: 'أدخل بياناتك لتسجيل الدخول',
      signupDescription: 'أنشئ حساباً للبدء',
      rateLimitError: 'محاولات كثيرة. الرجاء الانتظار قبل المحاولة مرة أخرى.',
      weakPassword: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
      invalidEmail: 'الرجاء إدخال بريد إلكتروني صحيح.',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور'
    }
  };

  const t = texts[language];

  // Rate limiting - max 5 attempts per 15 minutes
  const checkRateLimit = () => {
    const now = Date.now();
    const lastAttempt = localStorage.getItem('lastAuthAttempt');
    const attempts = parseInt(localStorage.getItem('authAttempts') || '0');
    
    if (lastAttempt && now - parseInt(lastAttempt) < 15 * 60 * 1000) {
      if (attempts >= 5) {
        return false;
      }
    } else {
      localStorage.setItem('authAttempts', '0');
    }
    return true;
  };

  const incrementAttempts = () => {
    const attempts = parseInt(localStorage.getItem('authAttempts') || '0') + 1;
    localStorage.setItem('authAttempts', attempts.toString());
    localStorage.setItem('lastAuthAttempt', Date.now().toString());
    setAuthAttempts(attempts);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit()) {
      toast({
        title: t.rateLimitError,
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: t.invalidEmail,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      incrementAttempts();
      toast({
        title: t.loginError,
        description: error.message,
        variant: 'destructive',
      });
    } else {
      localStorage.removeItem('authAttempts');
      localStorage.removeItem('lastAuthAttempt');
      toast({
        title: t.loginSuccess,
        variant: 'default',
      });
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit()) {
      toast({
        title: t.rateLimitError,
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: t.invalidEmail,
        variant: 'destructive',
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: t.weakPassword,
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: t.passwordMismatch,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // CRITICAL: Always include emailRedirectTo for security
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      incrementAttempts();
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
    if (!checkRateLimit()) {
      toast({
        title: t.rateLimitError,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      incrementAttempts();
      toast({
        title: `OAuth Login Failed for ${provider}`,
        description: error.message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-4 left-4 z-10">
        <BackButton />
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 bg-white dark:bg-gray-800">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'login' ? t.login : t.signup}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {activeTab === 'login' ? t.loginDescription : t.signupDescription}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-sm font-medium">
                {t.login}
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-medium">
                {t.signup}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.email}
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder={t.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t.password}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {t.submitLogin}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.email}
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder={t.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t.password}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-10"
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'يجب أن تكون 8 أحرف على الأقل' : 'Must be at least 8 characters'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.confirmPassword}
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.confirmPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {t.submitSignup}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400 font-medium">
                {t.or}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Chrome className="h-4 w-4 mr-2" />
              {t.signInWithGoogle}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading}
              className="w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Facebook className="h-4 w-4 mr-2" />
              {t.signInWithFacebook}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
