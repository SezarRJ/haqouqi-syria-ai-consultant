
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  MessageCircle, 
  Upload, 
  Search, 
  User, 
  BookOpen, 
  FileText,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import ChatInterface from '@/components/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import LegalSearch from '@/components/LegalSearch';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('consultation');
  const [userProfile, setUserProfile] = useState(null);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserProfile(userData);
    setShowAuthModal(false);
  };

  const features = [
    {
      icon: Scale,
      title: "استشارة قانونية فورية",
      description: "احصل على مشورة قانونية دقيقة بناءً على القوانين السورية"
    },
    {
      icon: Search,
      title: "بحث ذكي في القوانين",
      description: "ابحث في جميع القوانين السورية بالرقم أو المحتوى"
    },
    {
      icon: Upload,
      title: "تحليل الوثائق",
      description: "ارفع وثائقك واحصل على تحليل قانوني شامل"
    },
    {
      icon: MessageCircle,
      title: "محادثة تفاعلية",
      description: "تفاعل مع المساعد القانوني لتوضيحات إضافية"
    }
  ];

  const stats = [
    { number: "1000+", label: "قانون ومادة", icon: BookOpen },
    { number: "50+", label: "تفسير فقهي", icon: FileText },
    { number: "24/7", label: "متاح دائماً", icon: Clock },
    { number: "99%", label: "دقة النتائج", icon: CheckCircle }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50" dir="rtl">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900">المستشار القانوني السوري</h1>
                  <p className="text-sm text-blue-600">بالذكاء الاصطناعي</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <User className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-blue-900 mb-6">
                استشاراتك القانونية
                <span className="text-amber-600"> بذكاء اصطناعي متقدم</span>
              </h2>
              <p className="text-xl text-blue-700 mb-8 leading-relaxed">
                احصل على استشارات قانونية دقيقة وفورية بناءً على القوانين السورية النافذة والتفاسير الفقهية المعتمدة
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Shield className="ml-1 h-4 w-4" />
                  آمن ومحمي
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <CheckCircle className="ml-1 h-4 w-4" />
                  دقيق وموثوق
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Clock className="ml-1 h-4 w-4" />
                  متاح ٢٤/٧
                </Badge>
              </div>
              <Button 
                size="lg" 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              >
                ابدأ استشارتك المجانية
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">
              خدماتنا القانونية المتخصصة
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-blue-100">
                  <CardHeader>
                    <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-700 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="text-white">
                  <div className="mx-auto p-3 bg-blue-800 rounded-full w-fit mb-4">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-950 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scale className="h-6 w-6" />
              <span className="text-xl font-bold">المستشار القانوني السوري</span>
            </div>
            <p className="text-blue-200 mb-4">
              منصة استشارات قانونية متخصصة بالقانون السوري
            </p>
            <div className="text-sm text-blue-300">
              © 2024 جميع الحقوق محفوظة - المستشار القانوني السوري
            </div>
          </div>
        </footer>

        <AuthModal 
          open={showAuthModal} 
          onOpenChange={setShowAuthModal}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">المستشار القانوني السوري</h1>
                <p className="text-sm text-blue-600">مرحباً، {userProfile?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <User className="ml-2 h-4 w-4" />
                الملف الشخصي
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsLoggedIn(false)}
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'consultation', label: 'استشارة قانونية', icon: MessageCircle },
            { id: 'search', label: 'البحث في القوانين', icon: Search },
            { id: 'upload', label: 'تحليل الوثائق', icon: Upload }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'consultation' && <ChatInterface />}
            {activeTab === 'search' && <LegalSearch />}
            {activeTab === 'upload' && <DocumentUpload />}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">إرشادات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">للاستشارة القانونية</h4>
                  <p className="text-sm text-blue-700">اشرح قضيتك بالتفصيل واذكر جميع الوقائع المهمة</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-1">للبحث في القوانين</h4>
                  <p className="text-sm text-amber-700">استخدم رقم القانون أو المادة أو الكلمات المفتاحية</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">لتحليل الوثائق</h4>
                  <p className="text-sm text-green-700">ارفع ملفات PDF أو صور واضحة للوثائق</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">إخلاء مسؤولية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  المعلومات المقدمة هي للاستشارة فقط وليست بديلاً عن المشورة القانونية المهنية. 
                  ننصح بمراجعة محامٍ مختص للقضايا المعقدة.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
