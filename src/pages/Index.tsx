
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCapacitor } from '@/hooks/useCapacitor';
import { User } from '@supabase/supabase-js';
import { Scale, MessageSquare, BarChart3, Search, FileText, AlertTriangle, BookOpen, Users, ScanText, Bell } from 'lucide-react';
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
      subtitle: "مركز الخدمات القانونية المتقدمة",
      servicesTitle: "خدماتنا القانونية",
      notifications: "الإشعارات",
      consultation: {
        title: "الاستشارة القانونية مع الملفات",
        description: "احصل على استشارة قانونية مع إمكانية رفع المستندات"
      },
      caseAnalysis: {
        title: "تحليل القضايا والاستراتيجية",
        description: "تحليل القضايا والحصول على توصيات استراتيجية"
      },
      legalSearch: {
        title: "البحث القانوني الذكي",
        description: "البحث في القوانين السورية باللغة الطبيعية"
      },
      documentDrafting: {
        title: "صياغة الوثائق القانونية",
        description: "إنشاء مسودات العقود والإشعارات القانونية"
      },
      riskAssessment: {
        title: "تقييم المخاطر والنجاح",
        description: "تقييم المخاطر المحتملة ومعدل نجاح القضية"
      },
      explanations: {
        title: "الشروحات القانونية المبسطة",
        description: "ترجمة المصطلحات القانونية المعقدة إلى العربية البسيطة"
      },
      collaboration: {
        title: "مركز التعاون المهني",
        description: "مساحة آمنة للمحامين والقضاة للتعاون والمناقشة"
      },
      ocrService: {
        title: "خدمة استخراج النصوص",
        description: "تحويل الصور والمستندات إلى نصوص قابلة للتحرير"
      }
    },
    en: {
      title: "Smart Legal Advisor",
      subtitle: "Advanced Legal Services Hub",
      servicesTitle: "Our Legal Services",
      notifications: "Notifications",
      consultation: {
        title: "Legal Consultation with Files",
        description: "Get legal consultation with document upload capability"
      },
      caseAnalysis: {
        title: "AI Case Analysis & Strategy",
        description: "Analyze cases and get strategic recommendations"
      },
      legalSearch: {
        title: "Intelligent Legal Search",
        description: "Search Syrian laws with natural language"
      },
      documentDrafting: {
        title: "Legal Document Drafting",
        description: "Generate draft contracts and legal notices"
      },
      riskAssessment: {
        title: "Risk Assessment Scoring",
        description: "Evaluate potential risks and success rate of cases"
      },
      explanations: {
        title: "Simplified Legal Explanations",
        description: "Translate complex legal terms into plain Arabic"
      },
      collaboration: {
        title: "Professional Collaboration Hub",
        description: "Secure space for lawyers and judges to collaborate"
      },
      ocrService: {
        title: "OCR Text Extraction Service",
        description: "Convert images and documents to editable text"
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
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: t.caseAnalysis.title,
      description: t.caseAnalysis.description,
      icon: BarChart3,
      path: '/case-analysis',
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50'
    },
    {
      title: t.legalSearch.title,
      description: t.legalSearch.description,
      icon: Search,
      path: '/legal-search',
      color: 'from-purple-600 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50'
    },
    {
      title: t.documentDrafting.title,
      description: t.documentDrafting.description,
      icon: FileText,
      path: '/document-drafting',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: t.riskAssessment.title,
      description: t.riskAssessment.description,
      icon: AlertTriangle,
      path: '/risk-assessment',
      color: 'from-orange-600 to-red-600',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      title: t.explanations.title,
      description: t.explanations.description,
      icon: BookOpen,
      path: '/explanations',
      color: 'from-teal-600 to-cyan-600',
      bgColor: 'from-teal-50 to-cyan-50'
    },
    {
      title: t.collaboration.title,
      description: t.collaboration.description,
      icon: Users,
      path: '/collaboration',
      color: 'from-pink-600 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50'
    },
    {
      title: t.ocrService.title,
      description: t.ocrService.description,
      icon: ScanText,
      path: '/ocr-service',
      color: 'from-violet-600 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header with Sidebar Toggle and Notifications */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-40">
        <div className={`flex items-center justify-between gap-4 p-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
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
          
          {/* Notifications Icon */}
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
            <span className="sr-only">{t.notifications}</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Services Grid */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t.servicesTitle}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 overflow-hidden"
                onClick={() => {
                  if (isNative) hapticFeedback();
                  navigate(service.path);
                }}
              >
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                <CardHeader className={`bg-gradient-to-br ${service.bgColor} pb-4`}>
                  <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <service.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className={`text-lg text-gray-900 group-hover:text-blue-600 transition-colors ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className={`text-gray-600 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {service.description}
                  </CardDescription>
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
