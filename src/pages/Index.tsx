
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, FileSearch, Upload, Scale, Gavel, BookOpen, Users, Menu } from 'lucide-react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import AuthModal from '@/components/AuthModal';
import ChatInterface from '@/components/ChatInterface';
import { LegalConsultationWithFiles } from '@/components/LegalConsultationWithFiles';
import { SmartLegalSearch } from '@/components/SmartLegalSearch';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [subscription, setSubscription] = useState<any>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscription(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscription(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscription = async (currentUser: any) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    checkSubscription(userData);
    toast({
      title: language === 'ar' ? "مرحباً بك" : "Welcome",
      description: language === 'ar' ? "تم تسجيل الدخول بنجاح" : "Successfully logged in",
    });
  };

  const stats = [
    { 
      icon: <Scale className="h-8 w-8 text-blue-500" />, 
      title: language === 'ar' ? "القوانين المتاحة" : "Available Laws", 
      value: "500+" 
    },
    { 
      icon: <Gavel className="h-8 w-8 text-green-500" />, 
      title: language === 'ar' ? "الاستشارات المقدمة" : "Consultations Provided", 
      value: "10,000+" 
    },
    { 
      icon: <BookOpen className="h-8 w-8 text-purple-500" />, 
      title: language === 'ar' ? "المواد القانونية" : "Legal Articles", 
      value: "2,500+" 
    },
    { 
      icon: <Users className="h-8 w-8 text-orange-500" />, 
      title: language === 'ar' ? "المستخدمون النشطون" : "Active Users", 
      value: "1,200+" 
    }
  ];

  return (
    <div className="flex min-h-screen w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <AppSidebar user={user} language={language} onLanguageChange={setLanguage} />
      
      <SidebarInset className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="flex h-16 items-center gap-4 px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'المستشار القانوني السوري' : 'Syrian Legal Advisor'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'نظام ذكي للاستشارات القانونية' : 'Smart Legal Consultation System'}
                </p>
              </div>
            </div>
            
            {!user && (
              <Button onClick={() => setShowAuthModal(true)}>
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Button>
            )}
          </div>
        </header>

        <div className="flex-1 bg-gradient-to-br from-blue-50 to-gray-100">
          <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {language === 'ar' 
                  ? 'مرحباً بك في المستشار القانوني السوري'
                  : 'Welcome to Syrian Legal Advisor'
                }
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'ar'
                  ? 'نظام ذكي متطور يوفر استشارات قانونية دقيقة وموثوقة باللغة العربية، مع إمكانية البحث في القوانين السورية وتحليل الوثائق القانونية'
                  : 'An advanced intelligent system providing accurate and reliable legal consultations in Arabic, with the ability to search Syrian laws and analyze legal documents'
                }
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      {stat.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Services */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {language === 'ar' ? 'الخدمات القانونية المتاحة' : 'Available Legal Services'}
                </CardTitle>
                <CardDescription className="text-center">
                  {language === 'ar'
                    ? 'اختر نوع الخدمة التي تحتاجها للحصول على المساعدة القانونية المناسبة'
                    : 'Choose the type of service you need to get appropriate legal assistance'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Subscription status indicator */}
                {user && (
                  <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-900">
                          {language === 'ar' ? 'حالة الاشتراك' : 'Subscription Status'}
                        </h3>
                        {subscription?.subscribed ? (
                          <p className="text-green-600">
                            {language === 'ar' 
                              ? `مشترك - ${subscription.subscription_tier}` 
                              : `Subscribed - ${subscription.subscription_tier}`
                            }
                            {subscription.subscription_end && (
                              <span className="text-sm text-gray-600 mr-2">
                                ({language === 'ar' ? 'ينتهي:' : 'Ends:'} {new Date(subscription.subscription_end).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')})
                              </span>
                            )}
                          </p>
                        ) : (
                          <p className="text-orange-600">
                            {language === 'ar' ? 'غير مشترك - وصول محدود' : 'Not subscribed - Limited access'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {language === 'ar' ? 'الاستشارة المباشرة' : 'Direct Consultation'}
                    </TabsTrigger>
                    <TabsTrigger value="consultation" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {language === 'ar' ? 'تحليل الوثائق' : 'Document Analysis'}
                    </TabsTrigger>
                    <TabsTrigger value="search" className="flex items-center gap-2">
                      <FileSearch className="h-4 w-4" />
                      {language === 'ar' ? 'البحث القانوني' : 'Legal Search'}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          {language === 'ar' ? 'الاستشارة القانونية المباشرة' : 'Direct Legal Consultation'}
                          {subscription?.subscribed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {language === 'ar' ? 'متاح' : 'Available'}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {language === 'ar'
                            ? 'تحدث مع المستشار القانوني الذكي واحصل على إجابات فورية لاستفساراتك القانونية'
                            : 'Chat with the smart legal advisor and get instant answers to your legal inquiries'
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {user ? (
                          <ChatInterface />
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">
                              {language === 'ar' 
                                ? 'يرجى تسجيل الدخول للوصول إلى الاستشارة المباشرة' 
                                : 'Please sign in to access direct consultation'
                              }
                            </p>
                            <Button onClick={() => setShowAuthModal(true)}>
                              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="consultation" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Upload className="h-5 w-5" />
                          {language === 'ar' ? 'تحليل الوثائق القانونية' : 'Legal Document Analysis'}
                          {subscription?.subscribed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {language === 'ar' ? 'متاح' : 'Available'}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {language === 'ar'
                            ? 'ارفع وثائقك القانونية واحصل على تحليل مفصل وتوضيحات قانونية شاملة'
                            : 'Upload your legal documents and get detailed analysis and comprehensive legal explanations'
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {user ? (
                          subscription?.subscribed ? (
                            <LegalConsultationWithFiles />
                          ) : (
                            <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50">
                              <Upload className="h-12 w-12 mx-auto mb-4 text-orange-400" />
                              <p className="text-orange-700 mb-4">
                                {language === 'ar' 
                                  ? 'تحليل الوثائق متاح للمشتركين فقط' 
                                  : 'Document analysis is available for subscribers only'
                                }
                              </p>
                            </div>
                          )
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">
                              {language === 'ar' 
                                ? 'يرجى تسجيل الدخول للوصول إلى خدمة تحليل الوثائق' 
                                : 'Please sign in to access document analysis service'
                              }
                            </p>
                            <Button onClick={() => setShowAuthModal(true)}>
                              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="search" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileSearch className="h-5 w-5" />
                          {language === 'ar' ? 'البحث في القوانين السورية' : 'Search Syrian Laws'}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {language === 'ar' ? 'مجاني' : 'Free'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {language === 'ar'
                            ? 'ابحث في قاعدة بيانات شاملة للقوانين واللوائح السورية واحصل على النصوص القانونية ذات الصلة'
                            : 'Search a comprehensive database of Syrian laws and regulations and get relevant legal texts'
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SmartLegalSearch />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
