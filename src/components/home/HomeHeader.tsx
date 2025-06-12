
import { useNavigate } from 'react-router-dom';
import { Scale, Bell, LogIn, Menu } from 'lucide-react';
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
    <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 dark:bg-gray-900/95 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-16 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Left section (or right in RTL) */}
          <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <SidebarTrigger className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            
            <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div className={`hidden sm:block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t.title}</h1>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{t.subtitle}</p>
              </div>
            </div>
          </div>
          
          {/* Right section (or left in RTL) */}
          <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            {!user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
                className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t.signIn}</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/notifications')}
              className="relative p-2"
              title={t.notifications}
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-600 flex items-center justify-center">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
