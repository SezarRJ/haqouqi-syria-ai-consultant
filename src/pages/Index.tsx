import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCapacitor } from '@/hooks/useCapacitor';
import { User } from '@supabase/supabase-js';
import { Scale, MessageSquare, BarChart3, Search, FileText, AlertTriangle, BookOpen, Users, ScanText, Bell, LogIn, ArrowRight, CheckCircle, Star, UserCheck } from 'lucide-react';
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
  const [featuredProviders, setFeaturedProviders] = useState<any[]>([]);

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

    // Fetch featured service providers
    fetchFeaturedProviders();

    return () => subscription.unsubscribe();
  }, []);

  const fetchFeaturedProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_verified', true)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedProviders(data || []);
    } catch (error) {
      console.error('Error fetching featured providers:', error);
    }
  };

  const texts = {
    ar: {
      title: "المستشار القانوني الذكي",
      subtitle: "منصة الخدمات القانونية المتطورة",
      servicesTitle: "خدماتنا المتخصصة",
      notifications: "الإشعارات",
      welcomeBack: "مرحباً بعودتك",
      getStarted: "ابدأ الآن",
      signIn: "تسجيل الدخول",
      features: "المزايا",
      featuredProviders: "مقدمو الخدمات المميزون",
      viewAllProviders: "عرض جميع مقدمي الخدمات",
      yearsExperience: "سنوات خبرة",
      consultation: {
        title: "الاستشارة القانونية مع الملفات",
        description: "احصل على استشارة قانونية متخصصة مع إمكانية رفع المستندات والملفات",
        features: [
          "رفع وتحليل المستندات القانونية",
          "استشارات فورية مع خبراء قانونيين",
          "دعم متعدد التنسيقات (PDF, Word, صور)",
          "حفظ تاريخ الاستشارات"
        ]
      },
      caseAnalysis: {
        title: "محرك تحليل القضايا والاستراتيجية",
        description: "تحليل متقدم للقضايا مع مطابقة السوابق القانونية",
        features: [
          "تحليل متقدم للقضايا مع مطابقة السوابق القانونية",
          "توصيات استراتيجية بناءً على تعقيد القضية",
          "تسجيل الثقة وتقييم المخاطر",
          "تكامل مع القانون السوري ومبادئ الفقه"
        ]
      },
      legalSearch: {
        title: "محرك البحث القانوني الذكي",
        description: "البحث الدلالي عبر قاعدة بيانات الوثائق القانونية",
        features: [
          "البحث الدلالي عبر قاعدة بيانات الوثائق القانونية",
          "فلترة حسب نوع الوثيقة (قوانين، فقه، فتاوى، سوابق)",
          "تسجيل الصلة ونتائج مميزة",
          "دعم الاستعلامات العربية والإنجليزية"
        ]
      },
      documentDrafting: {
        title: "وحدة صياغة الوثائق القانونية",
        description: "إنشاء الوثائق باستخدام القوالب",
        features: [
          "إنشاء الوثائق باستخدام القوالب",
          "استبدال الحقول الديناميكية بمساعدة الذكاء الاصطناعي",
          "دعم أنواع متعددة من الوثائق",
          "وظائف التحميل والحفظ"
        ]
      },
      riskAssessment: {
        title: "خوارزمية تقييم المخاطر",
        description: "تحليل مخاطر معقد متعدد العوامل",
        features: [
          "تحليل مخاطر معقد متعدد العوامل",
          "معاملات مخاطر قابلة للتخصيص",
          "توصيات استراتيجية التخفيف",
          "لوحة تحكم بصرية لتسجيل المخاطر"
        ]
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
        title: "تكامل خدمة OCR",
        description: "معالجة الوثائق متعددة التنسيقات",
        features: [
          "معالجة الوثائق متعددة التنسيقات (PDF, JPG, PNG)",
          "استخراج النص مع تسجيل الثقة",
          "إمكانيات المعالجة المجمعة",
          "دعم التعرف على النص العربي"
        ]
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
      features: "Features",
      featuredProviders: "Featured Service Providers",
      viewAllProviders: "View All Providers",
      yearsExperience: "years experience",
      consultation: {
        title: "Legal Consultation with Files",
        description: "Get specialized legal consultation with document upload capability",
        features: [
          "Upload and analyze legal documents",
          "Instant consultations with legal experts",
          "Multi-format support (PDF, Word, Images)",
          "Save consultation history"
        ]
      },
      caseAnalysis: {
        title: "AI Case Analysis & Strategy Engine",
        description: "Advanced case analysis with legal precedent matching",
        features: [
          "Advanced case analysis with legal precedent matching",
          "Strategic recommendations based on case complexity",
          "Confidence scoring and risk assessment",
          "Integration with Syrian law and Fiqh principles"
        ]
      },
      legalSearch: {
        title: "Intelligent Legal Search Backend",
        description: "Semantic search across legal documents database",
        features: [
          "Semantic search across legal documents database",
          "Filter by document type (laws, fiqh, fatwas, precedents)",
          "Relevance scoring and highlighted results",
          "Support for Arabic and English queries"
        ]
      },
      documentDrafting: {
        title: "Legal Document Drafting Module",
        description: "Template-based document generation",
        features: [
          "Template-based document generation",
          "Dynamic field replacement with AI assistance",
          "Support for multiple document types",
          "Download and save functionality"
        ]
      },
      riskAssessment: {
        title: "Risk Assessment Algorithm",
        description: "Complex multi-factor risk analysis",
        features: [
          "Complex multi-factor risk analysis",
          "Customizable risk parameters",
          "Mitigation strategy recommendations",
          "Visual risk scoring dashboard"
        ]
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
        title: "OCR Service Integration",
        description: "Multi-format document processing",
        features: [
          "Multi-format document processing (PDF, JPG, PNG)",
          "Text extraction with confidence scoring",
          "Batch processing capabilities",
          "Arabic text recognition support"
        ]
      }
    }
  };

  const t = texts[language];

  const services = [
    {
      title: t.consultation.title,
      description: t.consultation.description,
      features: t.consultation.features,
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
      features: t.caseAnalysis.features,
      icon: BarChart3,
      path: '/case-analysis',
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
      featured: true
    },
    {
      title: t.legalSearch.title,
      description: t.legalSearch.description,
      features: t.legalSearch.features,
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
      features: t.documentDrafting.features,
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
      features: t.riskAssessment.features,
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
      features: t.ocrService.features,
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
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
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

                  {service.features && (
                    <div className="mb-4">
                      <h4 className={`text-sm font-semibold text-gray-800 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t.features}:
                      </h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className={`flex items-start gap-2 text-xs text-gray-600 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className={language === 'ar' ? 'text-right' : 'text-left'}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className={`flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors ${language === 'ar' ? 'flex-row-reverse justify-start' : 'flex-row justify-end'}`}>
                    <span>{language === 'ar' ? 'ابدأ الآن' : 'Get Started'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Service Providers Section */}
        {featuredProviders.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.featuredProviders}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {featuredProviders.map((provider) => (
                <Card 
                  key={provider.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-blue-200 overflow-hidden"
                  onClick={() => navigate('/service-providers')}
                >
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 pb-4">
                    <div className={`flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className={`text-lg text-gray-900 font-bold leading-tight ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {provider.first_name} {provider.last_name}
                        </CardTitle>
                        <p className={`text-sm text-blue-600 capitalize ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {provider.provider_type}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4 pb-6">
                    <div className="space-y-3">
                      <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{provider.rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-xs text-gray-500">({provider.total_consultations || 0} {language === 'ar' ? 'استشارة' : 'consultations'})</span>
                      </div>
                      
                      {provider.specialties && provider.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.slice(0, 2).map((specialty: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {provider.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-lg font-bold text-blue-600">
                          {provider.hourly_rate} {provider.currency || 'SAR'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {provider.experience_years || 0} {t.yearsExperience}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => navigate('/service-providers')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
              >
                {t.viewAllProviders}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
