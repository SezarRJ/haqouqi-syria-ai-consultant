
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedLegalConsultation } from '@/components/EnhancedLegalConsultation';
import { useCapacitor } from '@/hooks/useCapacitor';
import { User } from '@supabase/supabase-js';
import { Scale, Users, Shield, Settings as SettingsIcon, Brain, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';

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

  const texts = {
    ar: {
      title: "المستشار القانوني الذكي",
      subtitle: "استشارات قانونية متقدمة بالذكاء الاصطناعي",
      aiTools: "أدوات الذكاء الاصطناعي",
      adminPanel: "لوحة الإدارة",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      pricing: "الأسعار",
      description: "احصل على استشارات قانونية دقيقة ومفصلة باستخدام تقنيات الذكاء الاصطناعي المتطورة. نظام شامل يدعم القانون السوري والعربي."
    },
    en: {
      title: "Smart Legal Advisor",
      subtitle: "Advanced AI-Powered Legal Consultations",
      aiTools: "AI Tools",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header with Sidebar Toggle */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-40">
        <div className={`flex items-center gap-4 p-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Scale className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-900">{t.title}</h1>
              <p className="text-sm text-blue-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Quick Access Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => {
              if (isNative) hapticFeedback();
              navigate('/ai-tools');
            }}
            variant="outline"
            className={`h-20 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
          >
            <Brain className="h-6 w-6" />
            <span className="text-sm font-medium">{t.aiTools}</span>
          </Button>

          <Button
            onClick={() => {
              if (isNative) hapticFeedback();
              navigate('/admin');
            }}
            variant="outline"
            className={`h-20 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
          >
            <Shield className="h-6 w-6" />
            <span className="text-sm font-medium">{t.adminPanel}</span>
          </Button>

          {user && (
            <Button
              onClick={() => {
                if (isNative) hapticFeedback();
                navigate('/profile');
              }}
              variant="outline"
              className={`h-20 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">{t.profile}</span>
            </Button>
          )}

          <Button
            onClick={() => {
              if (isNative) hapticFeedback();
              navigate('/settings');
            }}
            variant="outline"
            className={`h-20 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
          >
            <SettingsIcon className="h-6 w-6" />
            <span className="text-sm font-medium">{t.settings}</span>
          </Button>

          <Button
            onClick={() => {
              if (isNative) hapticFeedback();
              navigate('/pricing');
            }}
            variant="outline"
            className={`h-20 flex flex-col items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 ${language === 'ar' ? 'flex-col-reverse' : 'flex-col'}`}
          >
            <CreditCard className="h-6 w-6" />
            <span className="text-sm font-medium">{t.pricing}</span>
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
    </div>
  );
};

export default Index;
