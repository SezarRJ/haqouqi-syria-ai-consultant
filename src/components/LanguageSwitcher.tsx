
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
  };

  const isCompact = variant === 'compact';
  const triggerWidth = isCompact ? 'w-[50px]' : 'w-[60px]';

  return (
    <Select value={language} onValueChange={handleValueChange}>
      <SelectTrigger 
        className={`${triggerWidth} h-9 text-sm focus:ring-offset-0 focus:ring-0 ${className || ''}`}
        aria-label="Select Language"
      >
        <SelectValue placeholder={language.toUpperCase()} className="min-w-0" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ar">العربية</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
};
