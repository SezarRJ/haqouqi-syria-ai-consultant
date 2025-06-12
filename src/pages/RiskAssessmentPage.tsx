import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, TrendingUp, Shield, Target, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { RiskAssessmentAlgorithm } from '@/components/ai/RiskAssessmentAlgorithm';

const RiskAssessmentPage = () => {
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
      title: 'تقييم المخاطر والنجاح',
      description: 'تقييم المخاطر المحتملة ومعدل نجاح القضية',
      backToHome: 'العودة للرئيسية',
      riskAnalysis: 'تحليل المخاطر',
      successRate: 'معدل النجاح',
      timeline: 'الجدول الزمني',
      resources: 'الموارد المطلوبة',
      legalComplexity: 'التعقيد القانوني',
      caseStrength: 'قوة القضية'
    },
    en: {
      title: 'Risk Assessment & Success Scoring',
      description: 'Evaluate potential risks and success rate of cases',
      backToHome: 'Back to Home',
      riskAnalysis: 'Risk Analysis',
      successRate: 'Success Rate',
      timeline: 'Timeline',
      resources: 'Required Resources',
      legalComplexity: 'Legal Complexity',
      caseStrength: 'Case Strength'
    }
  };

  const t = texts[language];

  const assessmentCategories = [
    {
      title: t.riskAnalysis,
      description: language === 'ar' ? 'تحليل شامل للمخاطر المحتملة' : 'Comprehensive analysis of potential risks',
      icon: Shield,
      color: 'from-red-600 to-orange-600',
      bgColor: 'from-red-50 to-orange-50'
    },
    {
      title: t.successRate,
      description: language === 'ar' ? 'تقدير احتمالية النجاح بناءً على البيانات' : 'Success probability based on historical data',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: t.timeline,
      description: language === 'ar' ? 'تقدير المدة الزمنية المطلوبة' : 'Estimated timeline for case resolution',
      icon: Calendar,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: t.resources,
      description: language === 'ar' ? 'تحديد الموارد والخبرات المطلوبة' : 'Required resources and expertise',
      icon: Users,
      color: 'from-purple-600 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
          </div>
        </div>

        {/* Assessment Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {assessmentCategories.map((category, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
              <CardHeader className={`bg-gradient-to-br ${category.bgColor} pb-4`}>
                <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className={`text-lg text-gray-900 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {category.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className={`text-gray-600 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Risk Assessment Tool */}
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
            <CardTitle className="flex items-center gap-3 text-orange-900">
              <Target className="h-5 w-5" />
              {language === 'ar' ? 'أداة تقييم المخاطر بالذكاء الاصطناعي' : 'AI Risk Assessment Tool'}
            </CardTitle>
            <CardDescription className="text-orange-600">
              {language === 'ar' ? 'استخدم الذكاء الاصطناعي لتقييم شامل ودقيق للمخاطر ومعدل النجاح' : 'Use AI for comprehensive and accurate risk assessment and success rate evaluation'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <RiskAssessmentAlgorithm language={language} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessmentPage;
