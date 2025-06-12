
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    setLanguage(savedLanguage || 'ar');
  }, [location.pathname]);

  const texts = {
    ar: {
      title: 'الصفحة غير موجودة',
      subtitle: 'عذراً! الصفحة التي تبحث عنها غير متوفرة',
      description: 'قد تكون الصفحة قد تم نقلها أو حذفها، أو ربما كتبت العنوان خطأ.',
      goHome: 'العودة للصفحة الرئيسية',
      goBack: 'العودة للصفحة السابقة',
      exploreServices: 'استكشف الخدمات',
      needHelp: 'تحتاج مساعدة؟',
      errorCode: '404'
    },
    en: {
      title: 'Page Not Found',
      subtitle: 'Oops! The page you are looking for is not available',
      description: 'The page may have been moved or deleted, or you may have typed the address incorrectly.',
      goHome: 'Return to Home',
      goBack: 'Go Back',
      exploreServices: 'Explore Services',
      needHelp: 'Need Help?',
      errorCode: '404'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white dark:bg-gray-800">
        <CardHeader className="text-center pb-6">
          <div className="mb-6">
            <div className="text-6xl sm:text-8xl font-bold text-blue-500 dark:text-blue-400 mb-4">
              {t.errorCode}
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.title}
          </CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {t.subtitle}
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {t.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 py-3"
              size="lg"
            >
              <Home className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t.goHome}
            </Button>

            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 py-3"
              size="lg"
            >
              <ArrowLeft className={`h-5 w-5 ${language === 'ar' ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {t.goBack}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              onClick={() => navigate('/services')}
              variant="outline"
              className="w-full border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/20 shadow-md hover:shadow-lg transition-all duration-300 py-3"
              size="lg"
            >
              <Search className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t.exploreServices}
            </Button>

            <Button
              onClick={() => navigate('/consultation')}
              variant="outline"
              className="w-full border-2 border-green-200 hover:border-green-300 text-green-700 hover:bg-green-50 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-900/20 shadow-md hover:shadow-lg transition-all duration-300 py-3"
              size="lg"
            >
              <HelpCircle className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t.needHelp}
            </Button>
          </div>

          <div className="text-center pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'المسار المطلوب:' : 'Requested path:'} 
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs ml-2">
                {location.pathname}
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
