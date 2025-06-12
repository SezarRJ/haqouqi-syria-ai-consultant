
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const texts = {
    ar: {
      title: 'الإشعارات',
      description: 'إدارة وعرض جميع الإشعارات',
      backToHome: 'العودة للرئيسية',
      noNotifications: 'لا توجد إشعارات في الوقت الحالي'
    },
    en: {
      title: 'Notifications',
      description: 'Manage and view all notifications',
      backToHome: 'Back to Home',
      noNotifications: 'No notifications at this time'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className={`flex items-center gap-4 mb-6 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-blue-900">
              <Bell className="h-5 w-5" />
              {t.title}
            </CardTitle>
            <CardDescription className="text-blue-600">
              {t.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t.noNotifications}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
