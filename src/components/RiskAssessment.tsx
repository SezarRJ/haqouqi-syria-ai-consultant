
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Shield, Scale, FileText } from 'lucide-react';

interface RiskAssessmentProps {
  language: 'ar' | 'en';
  caseDetails: string;
}

export const RiskAssessment = ({ language, caseDetails }: RiskAssessmentProps) => {
  const [assessment, setAssessment] = useState<{
    successProbability: number;
    riskLevel: 'low' | 'medium' | 'high';
    risks: string[];
    recommendations: string[];
    precedents: string[];
    legalStrength: number;
    timeframe: string;
    costs: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const texts = {
    ar: {
      title: 'تقييم المخاطر القانونية',
      subtitle: 'تحليل ذكي لاحتمالات نجاح القضية والمخاطر المحتملة',
      analyze: 'تحليل المخاطر',
      successRate: 'احتمالية النجاح',
      riskLevel: 'مستوى المخاطر',
      legalStrength: 'قوة الموقف القانوني',
      timeframe: 'الإطار الزمني المتوقع',
      estimatedCosts: 'التكاليف المقدرة',
      risks: 'المخاطر المحتملة',
      recommendations: 'التوصيات',
      precedents: 'السوابق القضائية',
      analyzing: 'جاري تحليل القضية...',
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي'
    },
    en: {
      title: 'Legal Risk Assessment',
      subtitle: 'AI-powered analysis of case success probability and potential risks',
      analyze: 'Analyze Risks',
      successRate: 'Success Probability',
      riskLevel: 'Risk Level',
      legalStrength: 'Legal Position Strength',
      timeframe: 'Expected Timeframe',
      estimatedCosts: 'Estimated Costs',
      risks: 'Potential Risks',
      recommendations: 'Recommendations',
      precedents: 'Legal Precedents',
      analyzing: 'Analyzing case...',
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    }
  };

  const t = texts[language];

  const analyzeRisks = async () => {
    setLoading(true);
    // Enhanced AI analysis simulation
    setTimeout(() => {
      const successProb = Math.floor(Math.random() * 40) + 60; // 60-100%
      const legalStrength = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      // Fix the type issue by explicitly typing the riskLevel
      const riskLevel: 'low' | 'medium' | 'high' = successProb > 80 ? 'low' : successProb > 60 ? 'medium' : 'high';
      
      const mockAssessment = {
        successProbability: successProb,
        legalStrength,
        riskLevel,
        timeframe: language === 'ar' ? '6-12 شهر' : '6-12 months',
        costs: language === 'ar' ? '50,000 - 150,000 ل.س' : '50,000 - 150,000 SYP',
        risks: [
          language === 'ar' 
            ? 'تضارب في تفسير المادة 45 من قانون العمل'
            : 'Conflicting interpretations in Labor Law Article 45',
          language === 'ar'
            ? 'عدم وجود سوابق قضائية مماثلة'
            : 'Lack of similar legal precedents',
          language === 'ar'
            ? 'صعوبة في إثبات الأضرار المالية'
            : 'Difficulty proving financial damages',
          language === 'ar'
            ? 'احتمالية الطعن في القرار'
            : 'Possibility of appeal against decision'
        ],
        recommendations: [
          language === 'ar'
            ? 'جمع مزيد من الأدلة الموثقة والشهادات'
            : 'Gather more documented evidence and testimonies',
          language === 'ar'
            ? 'استشارة خبير قانوني متخصص في القانون المدني'
            : 'Consult with specialized civil law expert',
          language === 'ar'
            ? 'النظر في التسوية الودية لتوفير الوقت والتكلفة'
            : 'Consider amicable settlement to save time and costs',
          language === 'ar'
            ? 'إعداد استراتيجية دفاع شاملة'
            : 'Prepare comprehensive defense strategy'
        ],
        precedents: [
          language === 'ar'
            ? 'قرار محكمة النقض رقم 1245/2020 - قضية مماثلة'
            : 'Supreme Court Decision No. 1245/2020 - Similar case',
          language === 'ar'
            ? 'حكم محكمة الاستئناف في دمشق 2019'
            : 'Damascus Court of Appeals Ruling 2019',
          language === 'ar'
            ? 'اجتهاد قضائي في قضية مشابهة 2021'
            : 'Judicial precedent in similar case 2021'
        ]
      };
      setAssessment(mockAssessment);
      setLoading(false);
    }, 3000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!assessment ? (
          <div className="text-center py-12">
            <Button 
              onClick={analyzeRisks} 
              disabled={loading || !caseDetails}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  {t.analyzing}
                </div>
              ) : (
                <>
                  <Scale className="h-4 w-4 mr-2" />
                  {t.analyze}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Success Probability */}
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {assessment.successProbability}%
                  </div>
                  <p className="text-sm text-gray-600">{t.successRate}</p>
                  <Progress 
                    value={assessment.successProbability} 
                    className="h-2 mt-2"
                  />
                </div>
              </Card>

              {/* Legal Strength */}
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {assessment.legalStrength}%
                  </div>
                  <p className="text-sm text-gray-600">{t.legalStrength}</p>
                  <Progress 
                    value={assessment.legalStrength} 
                    className="h-2 mt-2"
                  />
                </div>
              </Card>

              {/* Timeframe */}
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600 mb-1">
                    {assessment.timeframe}
                  </div>
                  <p className="text-sm text-gray-600">{t.timeframe}</p>
                </div>
              </Card>

              {/* Estimated Costs */}
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600 mb-1">
                    {assessment.costs}
                  </div>
                  <p className="text-sm text-gray-600">{t.estimatedCosts}</p>
                </div>
              </Card>
            </div>

            {/* Risk Level */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-600" />
                {t.riskLevel}
              </h4>
              <Badge className={`${getRiskColor(assessment.riskLevel)} flex items-center gap-1 border`}>
                {getRiskIcon(assessment.riskLevel)}
                {t[assessment.riskLevel]}
              </Badge>
            </div>

            {/* Risks */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                {t.risks}
              </h4>
              <div className="grid gap-2">
                {assessment.risks.map((risk, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <span className="font-medium text-orange-800">⚠️</span> {risk}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {t.recommendations}
              </h4>
              <div className="grid gap-2">
                {assessment.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <span className="font-medium text-green-800">✓</span> {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Precedents */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                {t.precedents}
              </h4>
              <div className="grid gap-2">
                {assessment.precedents.map((precedent, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <span className="font-medium text-blue-800">📄</span> {precedent}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
