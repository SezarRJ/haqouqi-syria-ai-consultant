
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BackButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  className = "",
  variant = "outline",
  size = "sm"
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleBack = () => {
    navigate(-1);
  };

  console.log('BackButton render - isMobile:', isMobile);

  // Always render as a regular button element, never with asChild
  if (isMobile) {
    return (
      <button
        onClick={handleBack}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 ${className}`}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      العودة
    </button>
  );
};
