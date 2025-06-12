
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  language: 'ar' | 'en';
  user: any;
}

export const HeroSection = ({ language, user }: HeroSectionProps) => {
  const navigate = useNavigate();

  const t = {
    ar: {
      headline: 'الوصول إلى العدالة أصبح أسهل',
      subHeadline: 'منصة رائدة للخدمات والاستشارات القانونية عبر الإنترنت في سوريا.',
      ctaPrimary: 'ابحث عن خبير قانوني',
      ctaSecondary: 'استكشف جميع الخدمات',
      welcomeMessage: 'أهلاً بك',
      features: [
        'استشارات قانونية فورية',
        'خبراء معتمدون',
        'خدمات متنوعة',
        'دعم على مدار الساعة'
      ]
    },
    en: {
      headline: 'Justice Access Made Easier',
      subHeadline: 'Your leading online platform for legal services and consultations in Syria.',
      ctaPrimary: 'Find a Legal Expert',
      ctaSecondary: 'Explore All Services',
      welcomeMessage: 'Welcome',
      features: [
        'Instant Legal Consultations',
        'Certified Experts',
        'Diverse Services',
        '24/7 Support'
      ]
    },
  };

  const currentText = t[language];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Welcome message for logged in users */}
          {user && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium">
              <Users className="h-4 w-4" />
              <span>
                {currentText.welcomeMessage}, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
              </span>
            </div>
          )}

          {/* Main headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {currentText.headline}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {currentText.subHeadline}
            </p>
          </div>

          {/* Feature badges */}
          <div className={`flex flex-wrap items-center justify-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            {currentText.features.map((feature, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base font-semibold px-8 py-3 rounded-xl"
              onClick={() => navigate('/providers')}
            >
              <Search className={`h-5 w-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
              {currentText.ctaPrimary}
              {language === 'ar' ? (
                <ChevronLeft className="h-5 w-5 mr-2" />
              ) : (
                <ChevronRight className="h-5 w-5 ml-2" />
              )}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/20 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-base font-semibold px-8 py-3 rounded-xl"
              onClick={() => navigate('/services')}
            >
              {currentText.ctaSecondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
