
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import { LegalConsultation } from '@/components/LegalConsultation';
import { SmartLegalSearch } from '@/components/SmartLegalSearch';
import { EnhancedDocumentUpload } from '@/components/EnhancedDocumentUpload';
import ChatInterface from '@/components/ChatInterface';
import { MessageSquare, Search, FileText, Upload, Scale, Shield, Clock, Users, BookOpen, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">المستشار القانوني السوري</h1>
                <p className="text-sm text-gray-600">نظام ذكي للاستشارات القانونية</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 ml-2" />
                  لوحة الإدارة
                </Button>
              </Link>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">مرحباً، {user.name}</span>
                  <Button variant="outline" onClick={() => setUser(null)}>
                    تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            استشارات قانونية ذكية بناءً على القوانين السورية
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            احصل على إجابات دقيقة وسريعة لاستفساراتك القانونية مع نظام ذكي يعتمد على أحدث تقنيات الذكاء الاصطناعي
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            <Card className="legal-card-hover">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">استشارة قانونية فورية</h3>
                <p className="text-sm text-gray-600">احصل على مشورة قانونية دقيقة بناءً على القوانين السورية</p>
              </CardContent>
            </Card>
            
            <Card className="legal-card-hover">
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">بحث ذكي في القوانين</h3>
                <p className="text-sm text-gray-600">ابحث في جميع القوانين السورية بالرقم أو المحتوى</p>
              </CardContent>
            </Card>
            
            <Card className="legal-card-hover">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">تحليل الوثائق</h3>
                <p className="text-sm text-gray-600">ارفع وثائقك واحصل على تحليل قانوني شامل</p>
              </CardContent>
            </Card>
            
            <Card className="legal-card-hover">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">محادثة تفاعلية</h3>
                <p className="text-sm text-gray-600">تفاعل مع المساعد القانوني لتوضيحات إضافية</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <Tabs defaultValue="consultation" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="consultation" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                استشارة
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                بحث
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                وثائق
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                محادثة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consultation">
              <LegalConsultation />
            </TabsContent>

            <TabsContent value="search">
              <SmartLegalSearch />
            </TabsContent>

            <TabsContent value="documents">
              <EnhancedDocumentUpload />
            </TabsContent>

            <TabsContent value="chat">
              <ChatInterface />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">لماذا تثق بالمستشار القانوني السوري؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">أمان وسرية</h4>
              <p className="text-gray-600">جميع البيانات محمية ومشفرة بأعلى معايير الأمان</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">مصادر موثوقة</h4>
              <p className="text-gray-600">يعتمد على النصوص الرسمية للقوانين السورية</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">إجابات فورية</h4>
              <p className="text-gray-600">احصل على إجابات سريعة ودقيقة على مدار الساعة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-8 w-8" />
            <h3 className="text-xl font-bold">المستشار القانوني السوري</h3>
          </div>
          <p className="text-gray-400 mb-4">
            نظام ذكي للاستشارات القانونية يوفر إجابات دقيقة وموثوقة بناءً على القوانين السورية
          </p>
          <div className="text-sm text-gray-500">
            <p>جميع الحقوق محفوظة © 2024</p>
            <p className="mt-2">
              هذا التطبيق يقدم استشارات قانونية عامة وليس بديلاً عن الاستشارة القانونية المهنية
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
