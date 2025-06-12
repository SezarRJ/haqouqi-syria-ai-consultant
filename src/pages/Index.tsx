
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCapacitor } from '@/hooks/useCapacitor';
import { User } from '@supabase/supabase-js';
import { Scale, MessageSquare, BarChart3, Search, FileText, AlertTriangle, BookOpen, Users, ScanText, Bell, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

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
      subtitle: "منصة الخدمات القانونية المتطورة",
      servicesTitle: "خدماتنا المتخصصة",
      notifications: "الإشعارات",
      welcomeBack: "مرحباً بعودتك",
      getStarted: "ابدأ الآن",
      signIn: "تسجيل الدخول",
      consultation: {
        title: "الاستشارة القانونية مع الملفات",
        description: "احصل على استشارة قانونية متخصصة مع إمكانية رفع المستندات والملفات"
      },
      caseAnalysis: {
        title: "تحليل القضايا والاستراتيجية",
        description: "تحليل ذكي للقضايا والحصول على توصيات استراتيجية متقدمة"
      },
      legalSearch: {
        title: "البحث القانوني الذكي",
        description: "البحث في القوانين السورية باستخدام اللغة الطبيعية"
      },
      documentDrafting: {
        title: "صياغة الوثائق القانونية",
        description: "إنشاء مسودات العقود والإشعارات القانونية بدقة عالية"
      },
      riskAssessment: {
        title: "تقييم المخاطر ومعدل النجاح",
        description: "تقييم شامل للمخاطر المحتملة ومعدل نجاح القضية"
      },
      explanations: {
        title: "الشروحات القانونية المبسطة",
        description: "ترجمة المصطلحات القانونية المعقدة إلى اللغة العربية البسيطة"
      },
      collaboration: {
        title: "مركز التعاون المهني",
        description: "مساحة آمنة للمحامين والقضاة للتعاون والمناقشة المهنية"
      },
      ocrService: {
        title: "خدمة استخراج النصوص",
        description: "تحويل الصور والمستندات إلى نصوص قابلة للتحرير بدقة عالية"
      }
    },
    en: {
      title: "Smart Legal Advisor",
      subtitle: "Advanced Legal Services Platform",
      servicesTitle: "Our Specialized Services",
      notifications: "Notifications",
      welcomeBack: "Welcome Back",
      getStarted: "Get Started",
      signIn: "Sign In",
      consultation: {
        title: "Legal Consultation with Files",
        description: "Get specialized legal consultation with document upload capability"
      },
      caseAnalysis: {
        title: "AI Case Analysis & Strategy",
        description: "Intelligent case analysis and advanced strategic recommendations"
      },
      legalSearch: {
        title: "Intelligent Legal Search",
        description: "Search Syrian laws using natural language processing"
      },
      documentDrafting: {
        title: "Legal Document Drafting",
        description: "Generate precise draft contracts and legal notices"
      },
      riskAssessment: {
        title: "Risk Assessment & Success Scoring",
        description: "Comprehensive evaluation of potential risks and case success rate"
      },
      explanations: {
        title: "Simplified Legal Explanations",
        description: "Translate complex legal terms into plain Arabic language"
      },
      collaboration: {
        title: "Professional Collaboration Hub",
        description: "Secure space for lawyers and judges to collaborate professionally"
      },
      ocrService: {
        title: "OCR Text Extraction Service",
        description: "Convert images and documents to editable text with high accuracy"
      }
    }
  };

  const t = texts[language];

  const services = [
    {
      title: t.consultation.title,
      description: t.consultation.description,
      icon: MessageSquare,
      path: '/consultation',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      featured: true
    },
    {
      title: t.caseAnalysis.title,
      description: t.caseAnalysis.description,
      icon: BarChart3,
      path: '/case-analysis',
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100'
    },
    {
      title: t.legalSearch.title,
      description: t.legalSearch.description,
      icon: Search,
      path: '/legal-search',
      color: 'from-purple-600 to-purple-700',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100'
    },
    {
      title: t.documentDrafting.title,
      description: t.documentDrafting.description,
      icon: FileText,
      path: '/document-drafting',
      color: 'from-green-600 to-green-700',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100'
    },
    {
      title: t.riskAssessment.title,
      description: t.riskAssessment.description,
      icon: AlertTriangle,
      path: '/risk-assessment',
      color: 'from-orange-600 to-orange-700',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      featured: true
    },
    {
      title: t.explanations.title,
      description: t.explanations.description,
      icon: BookOpen,
      path: '/explanations',
      color: 'from-teal-600 to-teal-700',
      bgColor: 'from-teal-50 to-teal-100',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100'
    },
    {
      title: t.collaboration.title,
      description: t.collaboration.description,
      icon: Users,
      path: '/collaboration',
      color: 'from-pink-600 to-pink-700',
      bgColor: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      iconBg: 'bg-pink-100'
    },
    {
      title: t.ocrService.title,
      description: t.ocrService.description,
      icon: ScanText,
      path: '/ocr-service',
      color: 'from-violet-600 to-violet-700',
      bgColor: 'from-violet-50 to-violet-100',
      borderColor: 'border-violet-200',
      iconBg: 'bg-violet-100'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className={`flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-sm text-blue-600 font-medium">{t.subtitle}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                {t.signIn}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/notifications')}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-600">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        {user && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.welcomeBack}, {user.email?.split('@')[0]}
            </h2>
            <p className="text-gray-600">{t.getStarted}</p>
          </div>
        )}

        {/* Services Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.servicesTitle}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${service.borderColor} overflow-hidden relative ${service.featured ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}`}
                onClick={() => {
                  if (isNative) hapticFeedback();
                  navigate(service.path);
                }}
              >
                {service.featured && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {language === 'ar' ? 'مميز' : 'Featured'}
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                
                <CardHeader className={`bg-gradient-to-br ${service.bgColor} pb-4 pt-6`}>
                  <div className={`flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className={`text-lg text-gray-900 group-hover:text-blue-600 transition-colors font-bold leading-tight ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {service.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4 pb-6">
                  <CardDescription className={`text-gray-600 leading-relaxed mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {service.description}
                  </CardDescription>
                  
                  <div className={`flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors ${language === 'ar' ? 'flex-row-reverse justify-start' : 'flex-row justify-end'}`}>
                    <span>{language === 'ar' ? 'ابدأ الآن' : 'Get Started'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
