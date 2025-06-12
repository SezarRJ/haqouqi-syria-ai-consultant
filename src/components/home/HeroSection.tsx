// src/components/home/HeroSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react'; // Import ChevronLeft too for RTL arrow
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  language: 'ar' | 'en';
  user: any; // User type from Supabase, or null
}

export const HeroSection = ({ language, user }: HeroSectionProps) => {
  const navigate = useNavigate();

  const t = {
    ar: {
      headline: 'الوصول إلى العدالة أصبح أسهل',
      subHeadline: 'منصة رائدة للخدمات والاستشارات القانونية عبر الإنترنت.',
      ctaPrimary: 'ابحث عن خبير قانوني',
      ctaSecondary: 'استكشف جميع الخدمات',
      welcomeMessage: 'أهلاً بك',
      getStarted: 'ابدأ الآن',
    },
    en: {
      headline: 'Justice Access Made Easier',
      subHeadline: 'Your leading online platform for legal services and consultations.',
      ctaPrimary: 'Find a Legal Expert',
      ctaSecondary: 'Explore All Services',
      welcomeMessage: 'Welcome,',
      getStarted: 'Get Started',
    },
  };

  const currentText = t[language];

  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 shadow-inner">
      {/* Background patterns/shapes for visual interest */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="url(#gradient-hero)" d="M0,64L80,80C160,96,320,128,480,128C640,128,800,96,960,112C1120,128,1280,192,1360,224L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
          <defs>
            <linearGradient id="gradient-hero" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: language === 'ar' ? 'var(--tw-gradient-to)' : 'var(--tw-gradient-from)', stopOpacity:1}} /> {/* Reversed gradient direction for RTL */}
              <stop offset="100%" style={{stopColor: language === 'ar' ? 'var(--tw-gradient-from)' : 'var(--tw-gradient-to)', stopOpacity:1}} /> {/* Reversed gradient direction for RTL */}
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center"> {/* Keep text-center for the main container */}
        {user ? (
          <p className="text-xl md:text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4 animate-fade-in-down">
            {currentText.welcomeMessage} {user.user_metadata?.full_name || user.email}!
          </p>
        ) : (
          <p className="text-xl md:text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4 animate-fade-in-down">
             {currentText.headline}
          </p>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            {currentText.headline}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-100">
          {currentText.subHeadline}
        </p>

        <div className={`flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300 text-lg py-3 px-8 rounded-full"
            onClick={() => navigate('/providers')}
          >
            {currentText.ctaPrimary}
            {language === 'ar' ? (
              <ChevronLeft className="h-5 w-5 mr-2" /> // Arrow points left for RTL
            ) : (
              <ChevronRight className="h-5 w-5 ml-2" /> // Arrow points right for LTR
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-500 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-gray-700 shadow-md transform hover:scale-105 transition-all duration-300 text-lg py-3 px-8 rounded-full"
            onClick={() => { /* Consider scrolling to ServicesGrid or navigating to a services overview page */ }}
          >
            {currentText.ctaSecondary}
          </Button>
        </div>
      </div>
    </section>
  );
};
