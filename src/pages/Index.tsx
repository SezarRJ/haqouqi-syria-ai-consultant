
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, FileSearch, Upload, Settings, User, CreditCard, LogOut, Scale, Gavel, BookOpen, Users } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import ChatInterface from '@/components/ChatInterface';
import { LegalConsultationWithFiles } from '@/components/LegalConsultationWithFiles';
import { SmartLegalSearch } from '@/components/SmartLegalSearch';
import { UserBalance } from '@/components/UserBalance';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [subscription, setSubscription] = useState<any>(null);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSubscription(null);
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    checkSubscription(userData);
    toast({
      title: "مرحباً بك",
      description: "تم تسجيل الدخول بنجاح",
    });
  };

  const stats = [
    { icon: <Scale className="h-8 w-8 text-blue-500" />, title: "القوانين المتاحة", value: "500+" },
    { icon: <Gavel className="h-8 w-8 text-green-500" />, title: "الاستشارات المقدمة", value: "10,000+" },
    { icon: <BookOpen className="h-8 w-8 text-purple-500" />, title: "المواد القانونية", value: "2,500+" },
    { icon: <Users className="h-8 w-8 text-orange-500" />, title: "المستخدمون النشطون", value: "1,200+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">المستشار القانوني السوري</h1>
                <p className="text-sm text-gray-600">نظام ذكي للاستشارات القانونية</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <UserBalance />
                  <span className="text-sm text-gray-600">مرحباً، {user.email}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/profile">
                        <User className="h-4 w-4 ml-1" />
                        الملف الشخصي
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/settings">
                        <Settings className="h-4 w-4 ml-1" />
                        الإعدادات
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/pricing">
                        <CreditCard className="h-4 w-4 ml-1" />
                        الاشتراكات
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin">
                        <Settings className="h-4 w-4 ml-1" />
                        الإدارة
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 ml-1" />
                      تسجيل الخروج
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            مرحباً بك في المستشار القانوني السوري
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نظام ذكي متطور يوفر استشارات قانونية دقيقة وموثوقة باللغة العربية، 
            مع إمكانية البحث في القوانين السورية وتحليل الوثائق القانونية
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
            <CardTitle className="text-2xl text-center">الخدمات القانونية المتاحة</CardTitle>
            <CardDescription className="text-center">
              اختر نوع الخدمة التي تحتاجها للحصول على المساعدة القانونية المناسبة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Subscription status indicator */}
            {user && (
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">حالة الاشتراك</h3>
                    {subscription?.subscribed ? (
                      <p className="text-green-600">
                        مشترك - {subscription.subscription_tier}
                        {subscription.subscription_end && (
                          <span className="text-sm text-gray-600 mr-2">
                            (ينتهي: {new Date(subscription.subscription_end).toLocaleDateString('ar-SA')})
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-orange-600">غير مشترك - وصول محدود</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => checkSubscription(user)}
                    >
                      تحديث الحالة
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/pricing">
                        <CreditCard className="h-4 w-4 ml-1" />
                        إدارة الاشتراك
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  الاستشارة المباشرة
                </TabsTrigger>
                <TabsTrigger value="consultation" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  تحليل الوثائق
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <FileSearch className="h-4 w-4" />
                  البحث القانوني
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      الاستشارة القانونية المباشرة
                      {subscription?.subscribed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          متاح
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      تحدث مع المستشار القانوني الذكي واحصل على إجابات فورية لاستفساراتك القانونية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <ChatInterface />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">يرجى تسجيل الدخول للوصول إلى الاستشارة المباشرة</p>
                        <Button onClick={() => setShowAuthModal(true)}>
                          تسجيل الدخول
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
                      تحليل الوثائق القانونية
                      {subscription?.subscribed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          متاح
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      ارفع وثائقك القانونية واحصل على تحليل مفصل وتوضيحات قانونية شاملة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      subscription?.subscribed ? (
                        <LegalConsultationWithFiles />
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-orange-400" />
                          <p className="text-orange-700 mb-4">تحليل الوثائق متاح للمشتركين فقط</p>
                          <Button variant="outline" asChild>
                            <Link to="/pricing">
                              اشترك الآن
                            </Link>
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">يرجى تسجيل الدخول للوصول إلى خدمة تحليل الوثائق</p>
                        <Button onClick={() => setShowAuthModal(true)}>
                          تسجيل الدخول
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
                      البحث في القوانين السورية
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        مجاني
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      ابحث في قاعدة بيانات شاملة للقوانين واللوائح السورية واحصل على النصوص القانونية ذات الصلة
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

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                استشارات فورية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                احصل على استشارات قانونية فورية ودقيقة من خلال نظام الذكاء الاصطناعي المتطور
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                قاعدة بيانات شاملة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                وصول إلى قاعدة بيانات شاملة تضم جميع القوانين واللوائح السورية المحدثة
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-500" />
                تحليل الوثائق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                تحليل ذكي للوثائق القانونية مع توضيحات مفصلة وتفسيرات قانونية دقيقة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">ابدأ رحلتك القانونية اليوم</h3>
            <p className="text-blue-100 mb-6">
              انضم إلى آلاف المستخدمين الذين يثقون في خدماتنا القانونية المتطورة
            </p>
            <div className="flex gap-4 justify-center">
              {!user ? (
                <Button variant="secondary" size="lg" onClick={() => setShowAuthModal(true)}>
                  ابدأ الآن مجاناً
                </Button>
              ) : (
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/pricing">
                    اشترك في الخطة المميزة
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link to="/pricing">
                  عرض الأسعار
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
