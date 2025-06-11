import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Mail, Lock, User, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface AuthModalProps {
  language: 'ar' | 'en';
  onLanguageChange?: (lang: 'ar' | 'en') => void;
}

export const AuthModal = ({ language, onLanguageChange }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const texts = {
    ar: {
      welcome: 'مرحباً بك في المستشار القانوني السوري',
      subtitle: 'نظام ذكي للاستشارات القانونية',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب جديد',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signInGoogle: 'تسجيل الدخول بـ Google',
      signInFacebook: 'تسجيل الدخول بـ Facebook',
      createAccount: 'إنشاء الحساب',
      alreadyAccount: 'لديك حساب بالفعل؟',
      noAccount: 'ليس لديك حساب؟',
      signInHere: 'سجل دخولك هنا',
      signUpHere: 'أنشئ حساباً هنا',
      loading: 'جاري التحميل...',
      signInSuccess: 'تم تسجيل الدخول بنجاح',
      signUpSuccess: 'تم إنشاء الحساب بنجاح. يرجى تفقد بريدك الإلكتروني لتأكيد الحساب',
      error: 'حدث خطأ. يرجى المحاولة مرة أخرى'
    },
    en: {
      welcome: 'Welcome to Syrian Legal Advisor',
      subtitle: 'Smart Legal Consultation System',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      name: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      signInGoogle: 'Sign in with Google',
      signInFacebook: 'Sign in with Facebook',
      createAccount: 'Create Account',
      alreadyAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      signInHere: 'Sign in here',
      signUpHere: 'Sign up here',
      loading: 'Loading...',
      signInSuccess: 'Successfully signed in',
      signUpSuccess: 'Account created successfully. Please check your email to confirm your account',
      error: 'An error occurred. Please try again'
    }
  };

  const t = texts[language];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: t.signInSuccess,
        description: language === 'ar' ? 'مرحباً بك مرة أخرى' : 'Welcome back',
      });
    } catch (error: any) {
      toast({
        title: t.error,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: t.signUpSuccess,
        description: language === 'ar' ? 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني' : 'Confirmation link sent to your email',
      });
    } catch (error: any) {
      toast({
        title: t.error,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: t.error,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        {onLanguageChange && (
          <div className="mb-6 flex justify-center">
            <LanguageSwitcher 
              language={language} 
              onLanguageChange={onLanguageChange}
              variant="compact"
            />
          </div>
        )}

        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">
              {t.welcome}
            </CardTitle>
            <CardDescription className="text-blue-600">
              {t.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
                <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t.password}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t.loading : t.signIn}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {language === 'ar' ? 'أو' : 'or'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialAuth('google')}
                    disabled={loading}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {t.signInGoogle}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialAuth('facebook')}
                    disabled={loading}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {t.signInFacebook}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <span className="text-gray-600">{t.noAccount} </span>
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      const signupTab = document.querySelector('[value="signup"]') as HTMLElement;
                      signupTab?.click();
                    }}
                  >
                    {t.signUpHere}
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t.name}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t.password}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t.loading : t.createAccount}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {language === 'ar' ? 'أو' : 'or'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialAuth('google')}
                    disabled={loading}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {t.signInGoogle}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialAuth('facebook')}
                    disabled={loading}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {t.signInFacebook}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <span className="text-gray-600">{t.alreadyAccount} </span>
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      const signinTab = document.querySelector('[value="signin"]') as HTMLElement;
                      signinTab?.click();
                    }}
                  >
                    {t.signInHere}
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
