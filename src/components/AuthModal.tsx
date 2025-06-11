
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  language: 'ar' | 'en';
}

export const AuthModal = ({ language }: AuthModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleEmailAuth = async (type: 'login' | 'signup') => {
    setIsLoading(true);
    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.fullName
            }
          }
        });
        if (error) throw error;
        toast({
          title: language === 'ar' ? "تم إنشاء الحساب" : "Account Created",
          description: language === 'ar' ? "تحقق من بريدك الإلكتروني للتفعيل" : "Check your email to confirm your account",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast({
          title: language === 'ar' ? "تم تسجيل الدخول" : "Signed In",
          description: language === 'ar' ? "مرحباً بك في المستشار القانوني" : "Welcome to Legal Advisor",
        });
      }
    } catch (error: any) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const texts = {
    ar: {
      welcome: "مرحباً بك",
      subtitle: "المستشار القانوني السوري",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      loginWith: "تسجيل الدخول باستخدام",
      signupWith: "إنشاء حساب باستخدام",
      google: "جوجل",
      facebook: "فيسبوك",
      or: "أو",
      enterEmail: "أدخل بريدك الإلكتروني",
      enterPassword: "أدخل كلمة المرور",
      enterName: "أدخل اسمك الكامل",
      loginDesc: "ادخل للوصول إلى حسابك",
      signupDesc: "أنشئ حساباً جديداً للبدء"
    },
    en: {
      welcome: "Welcome",
      subtitle: "Syrian Legal Advisor",
      login: "Sign In",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      loginWith: "Sign in with",
      signupWith: "Sign up with",
      google: "Google",
      facebook: "Facebook",
      or: "Or",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      enterName: "Enter your full name",
      loginDesc: "Sign in to access your account",
      signupDesc: "Create a new account to get started"
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900 mb-2">{t.welcome}</CardTitle>
            <CardDescription className="text-blue-600 text-lg">{t.subtitle}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-blue-50 border border-blue-200">
                <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  {t.login}
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  {t.signup}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-blue-600 mb-4">{t.loginDesc}</p>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSocialAuth('google')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-12 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    {t.loginWith} {t.google}
                  </Button>
                  
                  <Button
                    onClick={() => handleSocialAuth('facebook')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700"
                  >
                    <User className="h-5 w-5 mr-3" />
                    {t.loginWith} {t.facebook}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-blue-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-blue-600">{t.or}</span>
                  </div>
                </div>

                {/* Email Login Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-blue-900">{t.email}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.enterEmail}
                      className="h-12 border-blue-200 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password" className="text-blue-900">{t.password}</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={t.enterPassword}
                        className="h-12 border-blue-200 focus:border-blue-500 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleEmailAuth('login')}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    {isLoading ? (language === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Signing in...') : t.login}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-blue-600 mb-4">{t.signupDesc}</p>
                </div>

                {/* Social Signup Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSocialAuth('google')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-12 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    {t.signupWith} {t.google}
                  </Button>
                  
                  <Button
                    onClick={() => handleSocialAuth('facebook')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700"
                  >
                    <User className="h-5 w-5 mr-3" />
                    {t.signupWith} {t.facebook}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-blue-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-blue-600">{t.or}</span>
                  </div>
                </div>

                {/* Email Signup Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-blue-900">{t.fullName}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={t.enterName}
                      className="h-12 border-blue-200 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-blue-900">{t.email}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.enterEmail}
                      className="h-12 border-blue-200 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password" className="text-blue-900">{t.password}</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={t.enterPassword}
                        className="h-12 border-blue-200 focus:border-blue-500 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleEmailAuth('signup')}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    {isLoading ? (language === 'ar' ? 'جارٍ إنشاء الحساب...' : 'Creating account...') : t.signup}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
