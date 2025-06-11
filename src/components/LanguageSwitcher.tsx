
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export const LanguageSwitcher = ({ language, onLanguageChange, variant = 'default', className }: LanguageSwitcherProps) => {
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Globe className="h-4 w-4 text-blue-600" />
        <Button
          variant={language === 'ar' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onLanguageChange('ar')}
          className="h-8 px-2 text-xs"
        >
          عربي
        </Button>
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onLanguageChange('en')}
          className="h-8 px-2 text-xs"
        >
          EN
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe className="h-5 w-5 text-blue-600" />
      <Button
        variant={language === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('ar')}
        className="flex-1"
      >
        العربية
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLanguageChange('en')}
        className="flex-1"
      >
        English
      </Button>
    </div>
  );
};
