
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
  className?: string;
  variant?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  onLanguageChange,
  className,
  variant
}) => {
  const handleValueChange = (value: string) => {
    onLanguageChange(value as 'ar' | 'en');
    
    // Update document direction immediately
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = value === 'ar' ? 'ar' : 'en';
    
    // Store preference
    localStorage.setItem('language', value);
    localStorage.setItem('direction', value === 'ar' ? 'rtl' : 'ltr');
  };

  const isCompact = variant === 'compact';
  const triggerWidth = isCompact ? 'w-[50px]' : 'w-[70px]';

  React.useEffect(() => {
    // Set initial direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
  }, [language]);

  return (
    <div className="relative">
      <Select value={language} onValueChange={handleValueChange}>
        <SelectTrigger 
          className={`${triggerWidth} h-8 text-xs focus:ring-offset-0 focus:ring-1 focus:ring-blue-500 mobile-touch border-blue-200 ${className || ''}`}
          aria-label={language === 'ar' ? 'اختيار اللغة' : 'Select Language'}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className={`flex items-center gap-1 min-w-0 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <Globe className="h-3 w-3 flex-shrink-0 text-blue-600" />
            <SelectValue 
              placeholder={language.toUpperCase()} 
              className="min-w-0 font-medium text-xs"
            />
          </div>
        </SelectTrigger>
        <SelectContent 
          className="min-w-[100px] z-50 bg-white border-blue-200"
          align={language === 'ar' ? 'end' : 'start'}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <SelectItem 
            value="ar" 
            className={`flex items-center justify-between text-xs ${language === 'ar' ? 'rtl-text-right' : 'rtl-text-left'}`}
            dir="rtl"
          >
            <div className={`flex items-center justify-between w-full ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="arabic-text font-medium">العربية</span>
              <span className="text-xs text-gray-500 ml-1">AR</span>
            </div>
          </SelectItem>
          <SelectItem 
            value="en" 
            className={`flex items-center justify-between text-xs ${language === 'ar' ? 'rtl-text-left' : 'rtl-text-right'}`}
            dir="ltr"
          >
            <div className={`flex items-center justify-between w-full ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="english-text font-medium">English</span>
              <span className="text-xs text-gray-500 ml-1">EN</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
