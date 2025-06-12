import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { 
  User, 
  Settings, 
  CreditCard, 
  Shield, 
  LogOut, 
  Wallet, 
  Gift, 
  History, 
  DollarSign,
  Scale,
  Brain,
  Home,
  Bell,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppSidebarProps {
  user: any;
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
}

export const AppSidebar = ({ user, language, onLanguageChange }: AppSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: language === 'ar' ? "تم تسجيل الخروج" : "Signed Out",
      description: language === 'ar' ? "تم تسجيل خروجك بنجاح" : "You have been signed out successfully",
    });
  };

  const texts = {
    ar: {
      legalAdvisor: 'المستشار القانوني',
      smartSystem: 'نظام ذكي للاستشارات',
      mainMenu: 'القائمة الرئيسية',
      settings: 'الإعدادات',
      accountPayment: 'الحساب والدفع',
      home: 'الرئيسية',
      profile: 'الملف الشخصي',
      settingsMenu: 'إعدادات النظام',
      advancedFeatures: 'الميزات المتقدمة',
      privacy: 'الخصوصية',
      subscriptions: 'الاشتراكات',
      admin: 'الإدارة',
      balance: 'الرصيد',
      notifications: 'الإشعارات',
      paymentMethods: 'طرق الدفع',
      voucher: 'كوبون الشحن',
      history: 'السجل',
      hello: 'مرحباً،',
      signOut: 'تسجيل الخروج'
    },
    en: {
      legalAdvisor: 'Legal Advisor',
      smartSystem: 'Smart Legal System',
      mainMenu: 'Main Menu',
      settings: 'Settings',
      accountPayment: 'Account & Payment',
      home: 'Home',
      profile: 'Profile',
      settingsMenu: 'System Settings',
      advancedFeatures: 'Advanced Features',
      privacy: 'Privacy',
      subscriptions: 'Subscriptions',
      admin: 'Admin',
      balance: 'Balance',
      notifications: 'Notifications',
      paymentMethods: 'Payment Methods',
      voucher: 'Voucher',
      history: 'History',
      hello: 'Hello,',
      signOut: 'Sign Out'
    }
  };

  const t = texts[language];

  const mainMenuItems = [
    {
      title: t.home,
      icon: Home,
      path: '/'
    },
    {
      title: t.balance,
      icon: DollarSign,
      path: '/balance'
    },
    {
      title: t.notifications,
      icon: Bell,
      path: '/notifications'
    },
    {
      title: t.admin,
      icon: Shield,
      path: '/admin'
    }
  ];

  const settingsItems = [
    {
      title: t.settingsMenu,
      icon: Settings,
      path: '/settings'
    },
    {
      title: t.advancedFeatures,
      icon: Wrench,
      path: '/advanced-features'
    },
    {
      title: t.privacy,
      icon: Shield,
      path: '/privacy'
    },
    {
      title: t.subscriptions,
      icon: CreditCard,
      path: '/pricing'
    }
  ];

  const accountItems = [
    {
      title: t.profile,
      icon: User,
      path: '/profile'
    },
    {
      title: t.paymentMethods,
      icon: Wallet,
      path: '/payment-methods'
    },
    {
      title: t.voucher,
      icon: Gift,
      path: '/voucher'
    },
    {
      title: t.history,
      icon: History,
      path: '/history'
    }
  ];

  return (
    <Sidebar side={language === 'ar' ? 'right' : 'left'} className="border-r border-blue-200">
      <SidebarHeader className="p-3 sm:p-4">
        <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Scale className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className={`font-bold text-blue-900 text-sm sm:text-base truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.legalAdvisor}
            </h2>
            <p className={`text-xs sm:text-sm text-blue-600 truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.smartSystem}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs sm:text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t.mainMenu}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    className="h-9 sm:h-10"
                  >
                    <Link to={item.path} className={`flex items-center gap-2 sm:gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className={`text-sm truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleSignOut}
                    className="h-9 sm:h-10"
                  >
                    <div className={`flex items-center gap-2 sm:gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      <span className={`text-sm truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.signOut}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs sm:text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t.settings}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    className="h-9 sm:h-10"
                  >
                    <Link to={item.path} className={`flex items-center gap-2 sm:gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className={`text-sm truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel className={`text-xs sm:text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.accountPayment}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.path}
                      className="h-9 sm:h-10"
                    >
                      <Link to={item.path} className={`flex items-center gap-2 sm:gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className={`text-sm truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4 space-y-3">
        {user && (
          <div className="space-y-2 sm:space-y-3">
            <div className={`text-xs sm:text-sm text-gray-600 truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.hello} {user.email?.split('@')[0]}
            </div>
          </div>
        )}
        
        <div className="mt-2 sm:mt-3">
          <LanguageSwitcher 
            language={language} 
            onLanguageChange={onLanguageChange}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
