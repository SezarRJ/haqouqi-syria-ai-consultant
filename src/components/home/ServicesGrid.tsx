
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Search, 
  BookOpen, 
  ScanText,
  Users,
  Shield,
  ArrowRight,
  Star,
  Clock
} from 'lucide-react';

interface ServicesGridProps {
  language: 'ar' | 'en';
}

export const ServicesGrid = ({ language }: ServicesGridProps) => {
  const navigate = useNavigate();

  const texts = {
    ar: {
      title: 'خدماتنا المتميزة',
      subtitle: 'مجموعة شاملة من الخدمات القانونية الذكية',
      consultation: {
        title: 'الاستشارة القانونية',
        description: 'احصل على استشارات قانونية فورية من خبراء معتمدين',
        badge: 'الأكثر طلباً',
        features: ['استشارة فورية', 'خبراء معتمدون', 'سرية تامة']
      },
      drafting: {
        title: 'صياغة الوثائق',
        description: 'إنشاء وصياغة الوثائق القانونية بدقة احترافية',
        badge: 'جديد',
        features: ['قوالب جاهزة', 'مراجعة قانونية', 'تسليم سريع']
      },
      analysis: {
        title: 'تحليل القضايا',
        description: 'تحليل متقدم للقضايا القانونية والسوابق القضائية',
        badge: 'متقدم',
        features: ['ذكاء اصطناعي', 'تحليل شامل', 'تقارير مفصلة']
      },
      search: {
        title: 'البحث القانوني',
        description: 'البحث في قاعدة البيانات القانونية الشاملة',
        badge: '',
        features: ['بحث ذكي', 'نتائج دقيقة', 'مصادر موثقة']
      },
      explanations: {
        title: 'الشروحات القانونية',
        description: 'شروحات مفصلة للمفاهيم والنصوص القانونية',
        badge: '',
        features: ['شرح مبسط', 'أمثلة عملية', 'لغة واضحة']
      },
      ocr: {
        title: 'استخراج النصوص',
        description: 'استخراج النصوص من الوثائق والصور بدقة عالية',
        badge: 'تقنية متقدمة',
        features: ['دقة عالية', 'عدة لغات', 'معالجة سريعة']
      },
      collaboration: {
        title: 'مركز التعاون',
        description: 'تعاون مع الزملاء والخبراء القانونيين',
        badge: '',
        features: ['فرق عمل', 'مشاركة آمنة', 'إدارة المشاريع']
      },
      risk: {
        title: 'تقييم المخاطر',
        description: 'تحليل وتقييم المخاطر القانونية المحتملة',
        badge: 'حصري',
        features: ['تحليل ذكي', 'تقييم شامل', 'توصيات عملية']
      },
      viewAll: 'عرض جميع الخدمات',
      startNow: 'ابدأ الآن'
    },
    en: {
      title: 'Our Distinguished Services',
      subtitle: 'Comprehensive suite of smart legal services',
      consultation: {
        title: 'Legal Consultation',
        description: 'Get instant legal consultations from certified experts',
        badge: 'Most Popular',
        features: ['Instant consultation', 'Certified experts', 'Complete confidentiality']
      },
      drafting: {
        title: 'Document Drafting',
        description: 'Create and draft legal documents with professional accuracy',
        badge: 'New',
        features: ['Ready templates', 'Legal review', 'Fast delivery']
      },
      analysis: {
        title: 'Case Analysis',
        description: 'Advanced analysis of legal cases and precedents',
        badge: 'Advanced',
        features: ['AI powered', 'Comprehensive analysis', 'Detailed reports']
      },
      search: {
        title: 'Legal Search',
        description: 'Search comprehensive legal database',
        badge: '',
        features: ['Smart search', 'Accurate results', 'Verified sources']
      },
      explanations: {
        title: 'Legal Explanations',
        description: 'Detailed explanations of legal concepts and texts',
        badge: '',
        features: ['Simple explanation', 'Practical examples', 'Clear language']
      },
      ocr: {
        title: 'Text Extraction',
        description: 'Extract text from documents and images with high accuracy',
        badge: 'Advanced Tech',
        features: ['High accuracy', 'Multiple languages', 'Fast processing']
      },
      collaboration: {
        title: 'Collaboration Hub',
        description: 'Collaborate with colleagues and legal experts',
        badge: '',
        features: ['Team work', 'Secure sharing', 'Project management']
      },
      risk: {
        title: 'Risk Assessment',
        description: 'Analyze and assess potential legal risks',
        badge: 'Exclusive',
        features: ['Smart analysis', 'Comprehensive assessment', 'Practical recommendations']
      },
      viewAll: 'View All Services',
      startNow: 'Start Now'
    }
  };

  const t = texts[language];

  const services = [
    {
      title: t.consultation.title,
      description: t.consultation.description,
      icon: MessageSquare,
      href: '/consultation',
      badge: t.consultation.badge,
      features: t.consultation.features,
      color: 'blue',
      popular: true
    },
    {
      title: t.drafting.title,
      description: t.drafting.description,
      icon: FileText,
      href: '/document-drafting',
      badge: t.drafting.badge,
      features: t.drafting.features,
      color: 'green',
      popular: false
    },
    {
      title: t.analysis.title,
      description: t.analysis.description,
      icon: BarChart3,
      href: '/case-analysis',
      badge: t.analysis.badge,
      features: t.analysis.features,
      color: 'purple',
      popular: false
    },
    {
      title: t.search.title,
      description: t.search.description,
      icon: Search,
      href: '/legal-search',
      badge: t.search.badge,
      features: t.search.features,
      color: 'indigo',
      popular: false
    },
    {
      title: t.explanations.title,
      description: t.explanations.description,
      icon: BookOpen,
      href: '/explanations',
      badge: t.explanations.badge,
      features: t.explanations.features,
      color: 'amber',
      popular: false
    },
    {
      title: t.ocr.title,
      description: t.ocr.description,
      icon: ScanText,
      href: '/ocr-service',
      badge: t.ocr.badge,
      features: t.ocr.features,
      color: 'teal',
      popular: false
    },
    {
      title: t.collaboration.title,
      description: t.collaboration.description,
      icon: Users,
      href: '/collaboration',
      badge: t.collaboration.badge,
      features: t.collaboration.features,
      color: 'pink',
      popular: false
    },
    {
      title: t.risk.title,
      description: t.risk.description,
      icon: Shield,
      href: '/risk-assessment',
      badge: t.risk.badge,
      features: t.risk.features,
      color: 'red',
      popular: false
    }
  ];

  const getColorClasses = (color: string, popular: boolean) => {
    const colors = {
      blue: {
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      },
      green: {
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      },
      purple: {
        gradient: 'from-purple-500 to-violet-600',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      },
      indigo: {
        gradient: 'from-indigo-500 to-blue-600',
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        border: 'border-indigo-200 dark:border-indigo-800',
        text: 'text-indigo-700 dark:text-indigo-300',
        badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      },
      amber: {
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-700 dark:text-amber-300',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
      },
      teal: {
        gradient: 'from-teal-500 to-cyan-600',
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        border: 'border-teal-200 dark:border-teal-800',
        text: 'text-teal-700 dark:text-teal-300',
        badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
      },
      pink: {
        gradient: 'from-pink-500 to-rose-600',
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        border: 'border-pink-200 dark:border-pink-800',
        text: 'text-pink-700 dark:text-pink-300',
        badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      },
      red: {
        gradient: 'from-red-500 to-rose-600',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }
    };
    
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t.title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          const colorClasses = getColorClasses(service.color, service.popular);
          
          return (
            <Card 
              key={index} 
              className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                service.popular 
                  ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' 
                  : 'hover:shadow-lg'
              } ${colorClasses.border} relative overflow-hidden`}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {service.badge}
                </div>
              )}
              
              <CardHeader className={`${colorClasses.bg} border-b ${colorClasses.border}`}>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {service.badge && !service.popular && (
                    <Badge variant="secondary" className={`${colorClasses.badge} text-xs`}>
                      {service.badge}
                    </Badge>
                  )}
                </div>
                
                <CardTitle className={`text-lg font-semibold ${colorClasses.text} group-hover:text-opacity-80 transition-colors`}>
                  {service.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className={`w-1.5 h-1.5 bg-gradient-to-r ${colorClasses.gradient} rounded-full`}></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate(service.href)}
                  className={`w-full bg-gradient-to-r ${colorClasses.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white`}
                  size="sm"
                >
                  {t.startNow}
                  <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Button
          onClick={() => navigate('/services')}
          variant="outline"
          size="lg"
          className="border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/20 px-8 py-3 rounded-xl"
        >
          {t.viewAll}
          <ArrowRight className={`h-5 w-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
        </Button>
      </div>
    </section>
  );
};
