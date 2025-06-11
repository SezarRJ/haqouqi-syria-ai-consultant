
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
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const menuItems = [
    {
      title: language === 'ar' ? 'الملف الشخصي' : 'Profile',
      icon: User,
      path: '/profile'
    },
    {
      title: language === 'ar' ? 'الإعدادات' : 'Settings',
      icon: Settings,
      path: '/settings'
    },
    {
      title: language === 'ar' ? 'الاشتراكات' : 'Subscriptions',
      icon: CreditCard,
      path: '/pricing'
    },
    {
      title: language === 'ar' ? 'الإدارة' : 'Admin',
      icon: Shield,
      path: '/admin'
    }
  ];

  const accountItems = [
    {
      title: language === 'ar' ? 'الرصيد' : 'Balance',
      icon: DollarSign,
      path: '/balance'
    },
    {
      title: language === 'ar' ? 'طرق الدفع' : 'Payment Methods',
      icon: Wallet,
      path: '/payment-methods'
    },
    {
      title: language === 'ar' ? 'كوبون الشحن' : 'Voucher',
      icon: Gift,
      path: '/voucher'
    },
    {
      title: language === 'ar' ? 'السجل' : 'History',
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
            <h2 className="font-bold text-blue-900">
              {language === 'ar' ? 'المستشار القانوني' : 'Legal Advisor'}
            </h2>
            <p className="text-sm text-blue-600">
              {language === 'ar' ? 'نظام ذكي للاستشارات' : 'Smart Legal System'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {language === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
          </SidebarGroupLabel>
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
            <SidebarGroupLabel>
              {language === 'ar' ? 'الحساب والدفع' : 'Account & Payment'}
            </SidebarGroupLabel>
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
              {language === 'ar' ? 'مرحباً،' : 'Hello,'} {user.email?.split('@')[0]}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant={language === 'ar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLanguageChange('ar')}
            className="flex-1"
          >
            العربية
          </Button>
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLanguageChange('en')}
            className="flex-1"
          >
            English
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
