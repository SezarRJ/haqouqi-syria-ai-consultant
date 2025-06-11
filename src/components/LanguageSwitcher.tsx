
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
  const triggerWidth = isCompact ? 'w-[60px]' : 'w-[80px]';

  React.useEffect(() => {
    // Set initial direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
  }, [language]);

  return (
    <div className="relative">
      <Select value={language} onValueChange={handleValueChange}>
        <SelectTrigger 
          className={`${triggerWidth} h-10 text-sm focus:ring-offset-0 focus:ring-1 focus:ring-blue-500 mobile-touch ${className || ''}`}
          aria-label={language === 'ar' ? 'اختيار اللغة' : 'Select Language'}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="h-4 w-4 flex-shrink-0 text-blue-600" />
            <SelectValue 
              placeholder={language.toUpperCase()} 
              className="min-w-0 font-medium"
            />
          </div>
        </SelectTrigger>
        <SelectContent 
          className="min-w-[120px]"
          align={language === 'ar' ? 'end' : 'start'}
        >
          <SelectItem 
            value="ar" 
            className="flex items-center justify-between rtl-text-right"
          >
            <span className="arabic-text">العربية</span>
            <span className="text-xs text-gray-500 ml-2">AR</span>
          </SelectItem>
          <SelectItem 
            value="en" 
            className="flex items-center justify-between rtl-text-left"
          >
            <span>English</span>
            <span className="text-xs text-gray-500 ml-2">EN</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
