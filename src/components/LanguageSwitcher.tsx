// You might need to install Shadcn UI's select component:
// npx shadcn-ui@latest add select

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Adjust path if necessary
import { Globe } from 'lucide-react'; // For a small icon if desired

interface LanguageSwitcherProps {
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
  // You can still accept a className if you want to apply external styles to the trigger
  className?: string; 
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  onLanguageChange,
  className
}) => {
  const handleValueChange = (value: string) => {
    onLanguageChange(value as 'ar' | 'en');
  };

  return (
    <Select value={language} onValueChange={handleValueChange}>
      <SelectTrigger 
        className={`w-[60px] h-9 text-sm focus:ring-offset-0 focus:ring-0 ${className || ''}`}
        aria-label="Select Language"
      >
        {/* <Globe className="h-4 w-4 text-blue-600 mr-2" /> Removed for extreme compactness if needed */}
        <SelectValue placeholder={language.toUpperCase()} className="min-w-0" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ar">العربية</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
};
