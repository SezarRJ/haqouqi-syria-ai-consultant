
import { useNavigate } from 'react-router-dom';
import { Scale, Bell, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User } from '@supabase/supabase-js';

interface HomeHeaderProps {
  user: User | null;
  language: 'ar' | 'en';
}

export const HomeHeader = ({ user, language }: HomeHeaderProps) => {
  const navigate = useNavigate();

  const texts = {
    ar: {
      title: "المستشار القانوني الذكي",
      subtitle: "منصة الخدمات القانونية المتطورة",
      notifications: "الإشعارات",
      signIn: "تسجيل الدخول"
    },
    en: {
      title: "Smart Legal Advisor",
      subtitle: "Advanced Legal Services Platform",
      notifications: "Notifications",
      signIn: "Sign In"
    }
  };

  const t = texts[language];

  return (
    <div className="bg-white/95 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-40 shadow-sm">
      <div className={`flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-blue-600 font-medium">{t.subtitle}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              {t.signIn}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/notifications')}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-600">
              3
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
};
