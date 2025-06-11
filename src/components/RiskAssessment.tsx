
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

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
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const texts = {
    ar: {
      title: 'تقييم المخاطر القانونية',
      subtitle: 'تحليل ذكي لاحتمالات نجاح القضية',
      analyze: 'تحليل المخاطر',
      successRate: 'احتمالية النجاح',
      riskLevel: 'مستوى المخاطر',
      risks: 'المخاطر المحتملة',
      recommendations: 'التوصيات',
      precedents: 'السوابق القضائية',
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي'
    },
    en: {
      title: 'Legal Risk Assessment',
      subtitle: 'AI-powered case success probability analysis',
      analyze: 'Analyze Risks',
      successRate: 'Success Probability',
      riskLevel: 'Risk Level',
      risks: 'Potential Risks',
      recommendations: 'Recommendations',
      precedents: 'Legal Precedents',
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    }
  };

  const t = texts[language];

  const analyzeRisks = async () => {
    setLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      const mockAssessment = {
        successProbability: Math.floor(Math.random() * 40) + 60, // 60-100%
        riskLevel: 'medium' as const,
        risks: [
          language === 'ar' 
            ? 'تضارب في تفسير المادة 45 من قانون العمل'
            : 'Conflicting interpretations in Labor Law Article 45',
          language === 'ar'
            ? 'عدم وجود سوابق قضائية مماثلة'
            : 'Lack of similar legal precedents',
          language === 'ar'
            ? 'صعوبة في إثبات الأضرار المالية'
            : 'Difficulty proving financial damages'
        ],
        recommendations: [
          language === 'ar'
            ? 'جمع مزيد من الأدلة الموثقة'
            : 'Gather more documented evidence',
          language === 'ar'
            ? 'استشارة خبير قانوني متخصص'
            : 'Consult with specialized legal expert',
          language === 'ar'
            ? 'النظر في التسوية الودية'
            : 'Consider amicable settlement'
        ],
        precedents: [
          language === 'ar'
            ? 'قرار محكمة النقض رقم 1245/2020'
            : 'Supreme Court Decision No. 1245/2020',
          language === 'ar'
            ? 'حكم محكمة الاستئناف في دمشق 2019'
            : 'Damascus Court of Appeals Ruling 2019'
        ]
      };
      setAssessment(mockAssessment);
      setLoading(false);
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!assessment ? (
          <div className="text-center py-8">
            <Button onClick={analyzeRisks} disabled={loading || !caseDetails}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  {language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                </div>
              ) : (
                t.analyze
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Probability */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{t.successRate}</h4>
                <span className="text-2xl font-bold text-green-600">
                  {assessment.successProbability}%
                </span>
              </div>
              <Progress value={assessment.successProbability} className="h-3" />
            </div>

            {/* Risk Level */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t.riskLevel}</h4>
              <Badge className={`${getRiskColor(assessment.riskLevel)} flex items-center gap-1`}>
                {getRiskIcon(assessment.riskLevel)}
                {t[assessment.riskLevel]}
              </Badge>
            </div>

            {/* Risks */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                {t.risks}
              </h4>
              <ul className="space-y-2">
                {assessment.risks.map((risk, index) => (
                  <li key={index} className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                    • {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {t.recommendations}
              </h4>
              <ul className="space-y-2">
                {assessment.recommendations.map((rec, index) => (
                  <li key={index} className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    ✓ {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Precedents */}
            <div>
              <h4 className="font-medium mb-2">{t.precedents}</h4>
              <ul className="space-y-2">
                {assessment.precedents.map((precedent, index) => (
                  <li key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    📄 {precedent}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
