
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCapacitor } from '@/hooks/useCapacitor';
import { getServicesData } from './servicesData';

interface ServicesGridProps {
  language: 'ar' | 'en';
}

export const ServicesGrid = ({ language }: ServicesGridProps) => {
  const navigate = useNavigate();
  const { isNative, hapticFeedback } = useCapacitor();

  const texts = {
    ar: {
      servicesTitle: "خدماتنا المتخصصة",
      features: "المزايا"
    },
    en: {
      servicesTitle: "Our Specialized Services",
      features: "Features"
    }
  };

  const t = texts[language];
  const services = getServicesData(language);

  return (
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
  );
};
