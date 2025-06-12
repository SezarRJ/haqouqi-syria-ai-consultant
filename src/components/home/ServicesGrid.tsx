import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, MessageSquare, Briefcase, Users, Scale, FileText, Search, ShieldCheck } from 'lucide-react'; // Added Users icon for Service Providers
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

interface ServicesGridProps {
  language: 'ar' | 'en';
}

export const ServicesGrid = ({ language }: ServicesGridProps) => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'ai-tools',
      icon: <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title_ar: 'أدوات الذكاء الاصطناعي القانونية',
      title_en: 'AI Legal Tools',
      description_ar: 'استخدم قوة الذكاء الاصطناعي للتحليلات القانونية.',
      description_en: 'Leverage AI for legal analysis and insights.',
      path: '/ai-tools',
    },
    // NEW SERVICE PROVIDER CARD
    {
      id: 'service-providers',
      icon: <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />, // Using Users icon
      title_ar: 'مقدمو الخدمات القانونية',
      title_en: 'Legal Service Providers',
      description_ar: 'تواصل مع محامين وقضاة خبراء للاستشارة.',
      description_en: 'Connect with expert lawyers and judges for consultation.',
      path: '/providers', // Path to the ServiceProviderListPage
    },
    {
      id: 'consultation',
      icon: <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />,
      title_ar: 'استشارات قانونية',
      title_en: 'Legal Consultations',
      description_ar: 'احصل على مشورة فورية من خبراء القانون.',
      description_en: 'Get instant advice from legal experts.',
      path: '/consultation', // This might eventually be phased out or redirected to /providers if all consultations are through providers
    },
    {
      id: 'case-analysis',
      icon: <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title_ar: 'تحليل القضايا',
      title_en: 'Case Analysis',
      description_ar: 'تحليل شامل لحالتك القانونية.',
      description_en: 'Comprehensive analysis of your legal case.',
      path: '/case-analysis',
    },
    {
      id: 'risk-assessment',
      icon: <Scale className="h-6 w-6 text-red-600 dark:text-red-400" />,
      title_ar: 'تقييم المخاطر القانونية',
      title_en: 'Legal Risk Assessment',
      description_ar: 'تحديد وتقييم المخاطر القانونية المحتملة.',
      description_en: 'Identify and assess potential legal risks.',
      path: '/risk-assessment',
    },
    {
      id: 'document-drafting',
      icon: <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />,
      title_ar: 'صياغة المستندات',
      title_en: 'Document Drafting',
      description_ar: 'إنشاء وصياغة المستندات القانونية باحترافية.',
      description_en: 'Create and draft legal documents professionally.',
      path: '/document-drafting',
    },
    {
      id: 'legal-search',
      icon: <Search className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      title_ar: 'البحث القانوني',
      title_en: 'Legal Search',
      description_ar: 'ابحث في القوانين والسوابق القضائية بسهولة.',
      description_en: 'Search laws and case precedents with ease.',
      path: '/legal-search',
    },
    {
      id: 'ocr-service',
      icon: <ShieldCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      title_ar: 'خدمة التعرف الضوئي على الحروف (OCR)',
      title_en: 'OCR Service',
      description_ar: 'تحويل المستندات الممسوحة ضوئياً إلى نصوص قابلة للبحث.',
      description_en: 'Convert scanned documents to searchable text.',
      path: '/ocr-service',
    },
  ];

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {language === 'ar' ? 'خدماتنا القانونية' : 'Our Legal Services'}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {language === 'ar' ? 'استكشف مجموعة واسعة من الخدمات القانونية المتاحة.' : 'Explore a wide range of available legal services.'}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-blue-200 dark:hover:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            onClick={() => navigate(service.path)} // Navigate to the service's path
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-lg font-bold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? service.title_ar : service.title_en}
              </CardTitle>
              {service.icon}
            </CardHeader>
            <CardContent>
              <CardDescription className={`text-gray-600 dark:text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? service.description_ar : service.description_en}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
