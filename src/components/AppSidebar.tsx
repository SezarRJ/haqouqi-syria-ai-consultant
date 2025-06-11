
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
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppSidebarProps {
  user: any;
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
}

export const AppSidebar = ({ user, language, onLanguageChange }: AppSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();

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
      accountPayment: 'الحساب والدفع',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      subscriptions: 'الاشتراكات',
      admin: 'الإدارة',
      balance: 'الرصيد',
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
      accountPayment: 'Account & Payment',
      profile: 'Profile',
      settings: 'Settings',
      subscriptions: 'Subscriptions',
      admin: 'Admin',
      balance: 'Balance',
      paymentMethods: 'Payment Methods',
      voucher: 'Voucher',
      history: 'History',
      hello: 'Hello,',
      signOut: 'Sign Out'
    }
  };

  const t = texts[language];

  const menuItems = [
    {
      title: t.profile,
      icon: User,
      path: '/profile'
    },
    {
      title: t.settings,
      icon: Settings,
      path: '/settings'
    },
    {
      title: t.subscriptions,
      icon: CreditCard,
      path: '/pricing'
    },
    {
      title: t.admin,
      icon: Shield,
      path: '/admin'
    }
  ];

  const accountItems = [
    {
      title: t.balance,
      icon: DollarSign,
      path: '/balance'
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
    <Sidebar side={language === 'ar' ? 'right' : 'left'}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-blue-900">{t.legalAdvisor}</h2>
            <p className="text-sm text-blue-600">{t.smartSystem}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.mainMenu}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>{t.accountPayment}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.path}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              {t.hello} {user.email?.split('@')[0]}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.signOut}
            </Button>
          </div>
        )}
        
        <div className="mt-3">
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
