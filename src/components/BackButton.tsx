
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

  return (
    <Button
      variant={variant}
      size={isMobile ? "icon" : size}
      onClick={handleBack}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {!isMobile && <span>العودة</span>}
    </Button>
  );
};
