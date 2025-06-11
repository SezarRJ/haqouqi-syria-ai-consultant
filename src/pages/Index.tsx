
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedLegalConsultation } from '@/components/EnhancedLegalConsultation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { PWAInstaller } from '@/components/PWAInstaller';
import { useCapacitor } from '@/hooks/useCapacitor';
import { User } from '@supabase/supabase-js';
import { Scale, Users, Shield, Settings as SettingsIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Admin from './Admin';
import Profile from './Profile';
import SettingsPage from './Settings';
import Pricing from './Pricing';
import BalancePage from './BalancePage';
import VoucherPage from './VoucherPage';
import TransactionHistory from './TransactionHistory';
import PaymentMethodsPage from './PaymentMethods';

const Index = () => {
  const navigate = useNavigate();
  const { isNative, hapticFeedback } = useCapacitor();
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const texts = {
    ar: {
      title: "المستشار القانوني الذكي",
      subtitle: "استشارات قانونية متقدمة بالذكاء الاصطناعي",
      continueAsGuest: "المتابعة كزائر",
      adminPanel: "لوحة الإدارة",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      pricing: "الأسعار",
      description: "احصل على استشارات قانونية دقيقة ومفصلة باستخدام تقنيات الذكاء الاصطناعي المتطورة. نظام شامل يدعم القانون السوري والعربي."
    },
    en: {
      title: "Smart Legal Advisor",
      subtitle: "Advanced AI-Powered Legal Consultations",
      continueAsGuest: "Continue as Guest",
      adminPanel: "Admin Panel",
      profile: "Profile",
      settings: "Settings",
      pricing: "Pricing",
      description: "Get accurate and detailed legal consultations using advanced AI technologies. Comprehensive system supporting Syrian and Arabic law."
    }
  };

  const t = texts[language];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/vouchers" element={<VoucherPage />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/payment-methods" element={<PaymentMethodsPage />} />
        
        <Route path="/" element={
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header with smaller components */}
            <div className={`flex items-center justify-between mb-8 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="flex items-center gap-3">
                <PWAInstaller language={language} />
                {isNative && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
              </div>
              
              {/* Smaller Language Switcher */}
              <LanguageSwitcher 
                language={language} 
                onLanguageChange={handleLanguageChange} 
                variant="compact"
                className="scale-75"
              />
            </div>

            {/* Smaller Framed Title */}
            <Card className="mb-8 border-2 border-blue-200 bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Scale className="h-4 w-4 text-white" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
                    {t.title}
                  </h1>
                </div>
                <p className="text-sm text-blue-600 font-medium">{t.subtitle}</p>
              </div>
            </Card>

            {/* Quick Access Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Button
                onClick={() => {
                  if (isNative) hapticFeedback();
                  navigate('/admin');
                }}
                variant="outline"
                className={`h-16 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
              >
                <Shield className="h-5 w-5" />
                <span className="text-xs font-medium">{t.adminPanel}</span>
              </Button>

              {user && (
                <Button
                  onClick={() => {
                    if (isNative) hapticFeedback();
                    navigate('/profile');
                  }}
                  variant="outline"
                  className={`h-16 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-medium">{t.profile}</span>
                </Button>
              )}

              <Button
                onClick={() => {
                  if (isNative) hapticFeedback();
                  navigate('/settings');
                }}
                variant="outline"
                className={`h-16 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
              >
                <SettingsIcon className="h-5 w-5" />
                <span className="text-xs font-medium">{t.settings}</span>
              </Button>

              <Button
                onClick={() => {
                  if (isNative) hapticFeedback();
                  navigate('/pricing');
                }}
                variant="outline"
                className={`h-16 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
              >
                <Scale className="h-5 w-5" />
                <span className="text-xs font-medium">{t.pricing}</span>
              </Button>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-sm border-blue-200 shadow-sm">
                <p className={`text-slate-600 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t.description}
                </p>
              </Card>

              <EnhancedLegalConsultation language={language} />
            </div>
          </div>
        } />
      </Routes>
      
      <Toaster />
    </div>
  );
};

export default Index;
