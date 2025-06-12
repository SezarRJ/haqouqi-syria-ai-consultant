
import { User } from '@supabase/supabase-js';

interface WelcomeSectionProps {
  user: User | null;
  language: 'ar' | 'en';
}

export const WelcomeSection = ({ user, language }: WelcomeSectionProps) => {
  if (!user) return null;

  const texts = {
    ar: {
      welcomeBack: "مرحباً بعودتك",
      getStarted: "ابدأ الآن"
    },
    en: {
      welcomeBack: "Welcome Back",
      getStarted: "Get Started"
    }
  };

  const t = texts[language];

  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t.welcomeBack}, {user.email?.split('@')[0]}
      </h2>
      <p className="text-gray-600">{t.getStarted}</p>
    </div>
  );
};
