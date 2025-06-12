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
} from '@/components/ui/sidebar'; // Ensure these are correctly imported from your sidebar.tsx
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
  Home,
  Bell,
  Wrench,
  Users // Added Users icon for Service Providers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming this hook exists

interface AppSidebarProps {
  user: any;
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
}

export const AppSidebar = ({ user, language, onLanguageChange }: AppSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile(); // Use useIsMobile from your hooks

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
      balance: 'الرصيد',
      notifications: 'الإشعارات',
      admin: 'الإدارة',
      serviceProviders: 'مقدمو الخدمات', // Added Service Providers menu item
      settingsMenu: 'إعدادات النظام',
      advancedFeatures: 'الميزات المتقدمة',
      privacy: 'الخصوصية',
      subscriptions: 'الاشتراكات',
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
      balance: 'Balance',
      notifications: 'Notifications',
      admin: 'Admin',
      serviceProviders: 'Service Providers', // Added Service Providers menu item
      settingsMenu: 'System Settings',
      advancedFeatures: 'Advanced Features',
      privacy: 'Privacy',
      subscriptions: 'Subscriptions',
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
      title: t.profile,
      icon: User,
      path: '/profile'
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
      title: t.serviceProviders, // Added Service Providers to Main Menu
      icon: Users,
      path: '/providers' // Link to the list page
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
      icon: Shield, // Re-using Shield, consider a different icon if available
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
    <Sidebar
      side={language === 'ar' ? 'right' : 'left'} // Crucial for positioning in RTL
      className="border-r border-blue-200 bg-white dark:bg-gray-900 dark:border-gray-800" // Dark mode for sidebar
    >
      <SidebarHeader className="p-3 sm:p-4 bg-blue-50 dark:bg-gray-800 dark:border-b dark:border-gray-700"> {/* Dark mode for header */}
        <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-blue-700"> {/* Dark mode for icon background */}
            <Scale className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className={`font-bold text-blue-900 dark:text-blue-300 text-sm sm:text-base truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}> {/* Dark mode for title */}
              {t.legalAdvisor}
            </h2>
            <p className={`text-xs sm:text-sm text-blue-600 dark:text-blue-400 truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}> {/* Dark mode for subtitle */}
              {t.smartSystem}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 bg-white dark:bg-gray-900"> {/* Dark mode for content background */}
        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}> {/* Dark mode for group label */}
            {t.mainMenu}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    className="h-9 sm:h-10 dark:text-gray-200 hover:dark:bg-gray-800 hover:dark:text-white data-[active=true]:dark:bg-blue-900/30 data-[active=true]:dark:text-blue-200" // Dark mode for menu item
                  >
                    <Link to={item.path} className={`flex items-center gap-2 sm:gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <item.icon className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" /> {/* Dark mode for icon color */}
                      <span className={`text-sm truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleSignOut}
                    className="h-9 sm:h-10 dark:text-gray-200 hover:dark:bg-gray-800 hover:dark:text-white" // Dark mode for sign out button
                  >
                    <div className={`flex items-center gap-2 sm:gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <LogOut className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" /> {/* Dark mode for icon color */}
                      <span className={`text-sm truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.signOut}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t.settings}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    className="h-9 sm:h-10 dark:text-gray-200 hover:dark:bg-gray-800 hover:dark:text-white data-[active=true]:dark:bg-blue-900/30 data-[active=true]:dark:text-blue-200" // Dark mode for menu item
                  >
                    <Link to={item.path} className={`flex items-center gap-2 sm:gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <item.icon className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" /> {/* Dark mode for icon color */}
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
            <SidebarGroupLabel className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.accountPayment}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      className="h-9 sm:h-10 dark:text-gray-200 hover:dark:bg-gray-800 hover:dark:text-white data-[active=true]:dark:bg-blue-900/30 data-[active=true]:dark:text-blue-200" // Dark mode for menu item
                    >
                      <Link to={item.path} className={`flex items-center gap-2 sm:gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <item.icon className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" /> {/* Dark mode for icon color */}
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

      <SidebarFooter className="p-3 sm:p-4 space-y-3 bg-blue-50 dark:bg-gray-800 dark:border-t dark:border-gray-700"> {/* Dark mode for footer */}
        {user && (
          <div className="space-y-2 sm:space-y-3">
            <div className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate ${language === 'ar' ? 'text-right' : 'text-left'}`}> {/* Dark mode for text */}
              {t.hello} {user.user_metadata?.full_name || user.email?.split('@')[0]}
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
