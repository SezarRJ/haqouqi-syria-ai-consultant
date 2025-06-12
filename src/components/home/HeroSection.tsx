
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Shield, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  language: 'ar' | 'en';
  user: any;
}

export const HeroSection = ({ language, user }: HeroSectionProps) => {
  const navigate = useNavigate();

  const t = {
    ar: {
      headline: 'العدالة في متناول يدك',
      subHeadline: 'منصة رائدة للخدمات والاستشارات القانونية عبر الإنترنت مع خبراء معتمدين',
      ctaPrimary: 'ابحث عن خبير قانوني',
      ctaSecondary: 'استكشف جميع الخدمات',
      welcomeMessage: 'أهلاً بك',
      feature1: 'خبراء معتمدون',
      feature2: 'استشارة فورية',
      feature3: 'حماية كاملة',
      trustBadge: '1000+ عميل راضٍ'
    },
    en: {
      headline: 'Justice Within Your Reach',
      subHeadline: 'Leading online platform for legal services and consultations with certified experts',
      ctaPrimary: 'Find a Legal Expert',
      ctaSecondary: 'Explore All Services',
      welcomeMessage: 'Welcome,',
      feature1: 'Certified Experts',
      feature2: 'Instant Consultation',
      feature3: 'Complete Protection',
      trustBadge: '1000+ Satisfied Clients'
    },
  };

  const currentText = t[language];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-20 blur-3xl transform translate-x-32 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-full opacity-20 blur-3xl transform -translate-x-16 translate-y-16"></div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${language === 'ar' ? 'lg:text-right text-center' : 'lg:text-left text-center'}`}>
            {user && (
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
                <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                  {currentText.welcomeMessage} {user.user_metadata?.full_name || user.email}!
                </span>
              </div>
            )}

            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {currentText.headline}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {currentText.subHeadline}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{currentText.feature3}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{currentText.feature1}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{currentText.feature2}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 rounded-xl text-base font-semibold"
                onClick={() => navigate('/providers')}
              >
                <span className="flex items-center justify-center gap-2">
                  {currentText.ctaPrimary}
                  <ChevronRight className={`h-5 w-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/20 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 px-8 py-3 rounded-xl text-base font-semibold"
                onClick={() => navigate('/services')}
              >
                {currentText.ctaSecondary}
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{currentText.trustBadge}</span>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl rotate-12 opacity-80"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl rotate-45 opacity-60"></div>
              
              {/* Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">استشارة قانونية فورية</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">متاح 24/7</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">محامي متاح الآن</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">معدل الاستجابة: 95%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">متاح دائماً</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">1000+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">قضية منجزة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
