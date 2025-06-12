
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/BackButton';
import {
  Scale,
  FileText,
  Search,
  MessageSquare,
  Shield,
  Brain,
  Users,
  Eye,
  BookOpen,
  Gavel,
  Clock,
  Star
} from 'lucide-react';

const Services = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    setLanguage(savedLanguage || 'ar');
  }, []);

  const texts = {
    ar: {
      title: 'جميع الخدمات القانونية',
      subtitle: 'اختر الخدمة المناسبة لاحتياجاتك القانونية',
      consultation: 'استشارة قانونية',
      consultationDesc: 'احصل على استشارة قانونية فورية من خبراء معتمدين',
      documentDrafting: 'صياغة الوثائق',
      documentDraftingDesc: 'صياغة احترافية للعقود والوثائق القانونية',
      legalSearch: 'البحث القانوني',
      legalSearchDesc: 'البحث في القوانين والأحكام القضائية',
      caseAnalysis: 'تحليل القضايا',
      caseAnalysisDesc: 'تحليل شامل للقضايا القانونية',
      riskAssessment: 'تقييم المخاطر',
      riskAssessmentDesc: 'تقييم المخاطر القانونية للشركات',
      collaboration: 'التعاون القانوني',
      collaborationDesc: 'منصة للتعاون بين المحامين والعملاء',
      ocr: 'استخراج النصوص',
      ocrDesc: 'استخراج النصوص من الوثائق القانونية',
      explanations: 'الشروحات القانونية',
      explanationsDesc: 'شروحات مبسطة للقوانين والإجراءات',
      aiTools: 'أدوات الذكاء الاصطناعي',
      aiToolsDesc: 'أدوات متقدمة بالذكاء الاصطناعي للمحامين',
      providers: 'مقدمو الخدمات',
      providersDesc: 'تصفح ملفات مقدمي الخدمات القانونية',
      startNow: 'ابدأ الآن',
      popular: 'شائع',
      new: 'جديد'
    },
    en: {
      title: 'All Legal Services',
      subtitle: 'Choose the right service for your legal needs',
      consultation: 'Legal Consultation',
      consultationDesc: 'Get instant legal consultation from certified experts',
      documentDrafting: 'Document Drafting',
      documentDraftingDesc: 'Professional drafting of contracts and legal documents',
      legalSearch: 'Legal Search',
      legalSearchDesc: 'Search through laws and judicial rulings',
      caseAnalysis: 'Case Analysis',
      caseAnalysisDesc: 'Comprehensive analysis of legal cases',
      riskAssessment: 'Risk Assessment',
      riskAssessmentDesc: 'Legal risk assessment for businesses',
      collaboration: 'Legal Collaboration',
      collaborationDesc: 'Platform for collaboration between lawyers and clients',
      ocr: 'Text Extraction',
      ocrDesc: 'Extract text from legal documents',
      explanations: 'Legal Explanations',
      explanationsDesc: 'Simplified explanations of laws and procedures',
      aiTools: 'AI Tools',
      aiToolsDesc: 'Advanced AI tools for lawyers',
      providers: 'Service Providers',
      providersDesc: 'Browse legal service provider profiles',
      startNow: 'Start Now',
      popular: 'Popular',
      new: 'New'
    }
  };

  const t = texts[language];

  const services = [
    {
      title: t.consultation,
      description: t.consultationDesc,
      icon: MessageSquare,
      route: '/consultation',
      badge: t.popular,
      color: 'bg-blue-500'
    },
    {
      title: t.documentDrafting,
      description: t.documentDraftingDesc,
      icon: FileText,
      route: '/document-drafting',
      badge: '',
      color: 'bg-green-500'
    },
    {
      title: t.legalSearch,
      description: t.legalSearchDesc,
      icon: Search,
      route: '/legal-search',
      badge: '',
      color: 'bg-purple-500'
    },
    {
      title: t.caseAnalysis,
      description: t.caseAnalysisDesc,
      icon: Scale,
      route: '/case-analysis',
      badge: t.new,
      color: 'bg-orange-500'
    },
    {
      title: t.riskAssessment,
      description: t.riskAssessmentDesc,
      icon: Shield,
      route: '/risk-assessment',
      badge: '',
      color: 'bg-red-500'
    },
    {
      title: t.collaboration,
      description: t.collaborationDesc,
      icon: Users,
      route: '/collaboration',
      badge: '',
      color: 'bg-indigo-500'
    },
    {
      title: t.ocr,
      description: t.ocrDesc,
      icon: Eye,
      route: '/ocr-service',
      badge: '',
      color: 'bg-teal-500'
    },
    {
      title: t.explanations,
      description: t.explanationsDesc,
      icon: BookOpen,
      route: '/explanations',
      badge: '',
      color: 'bg-yellow-500'
    },
    {
      title: t.aiTools,
      description: t.aiToolsDesc,
      icon: Brain,
      route: '/ai-tools',
      badge: t.new,
      color: 'bg-pink-500'
    },
    {
      title: t.providers,
      description: t.providersDesc,
      icon: Gavel,
      route: '/providers',
      badge: '',
      color: 'bg-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 left-4 z-10">
        <BackButton />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${service.color} bg-opacity-10`}>
                      <IconComponent className={`h-6 w-6 ${service.color.replace('bg-', 'text-')}`} />
                    </div>
                    {service.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Button 
                    onClick={() => navigate(service.route)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {t.startNow}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
