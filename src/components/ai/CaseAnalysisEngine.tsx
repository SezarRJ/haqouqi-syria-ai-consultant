
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, FileSearch, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CaseAnalysisEngineProps {
  language: 'ar' | 'en';
}

export const CaseAnalysisEngine: React.FC<CaseAnalysisEngineProps> = ({ language }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [caseData, setCaseData] = useState({
    title: '',
    description: '',
    legalArea: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const texts = {
    ar: {
      title: "محرك تحليل القضايا والاستراتيجية بالذكاء الاصطناعي",
      caseTitle: "عنوان القضية",
      caseDescription: "وصف القضية",
      legalArea: "المجال القانوني",
      analyze: "تحليل القضية",
      analyzing: "جاري التحليل...",
      legalAreas: {
        civil: "القانون المدني",
        commercial: "القانون التجاري",
        criminal: "القانون الجنائي",
        family: "قانون الأحوال الشخصية",
        administrative: "القانون الإداري"
      },
      analysisResults: "نتائج التحليل",
      legalPrecedents: "السوابق القانونية",
      keyIssues: "القضايا الرئيسية",
      strengthAssessment: "تقييم القوة",
      estimatedDuration: "المدة المتوقعة",
      strategyRecommendations: "التوصيات الاستراتيجية",
      immediateActions: "الإجراءات الفورية",
      legalStrategies: "الاستراتيجيات القانونية",
      riskMitigation: "تخفيف المخاطر"
    },
    en: {
      title: "AI Case Analysis & Strategy Engine",
      caseTitle: "Case Title",
      caseDescription: "Case Description",
      legalArea: "Legal Area",
      analyze: "Analyze Case",
      analyzing: "Analyzing...",
      legalAreas: {
        civil: "Civil Law",
        commercial: "Commercial Law",
        criminal: "Criminal Law",
        family: "Family Law",
        administrative: "Administrative Law"
      },
      analysisResults: "Analysis Results",
      legalPrecedents: "Legal Precedents",
      keyIssues: "Key Issues",
      strengthAssessment: "Strength Assessment",
      estimatedDuration: "Estimated Duration",
      strategyRecommendations: "Strategy Recommendations",
      immediateActions: "Immediate Actions",
      legalStrategies: "Legal Strategies",
      riskMitigation: "Risk Mitigation"
    }
  };

  const t = texts[language];

  const handleAnalyze = async () => {
    if (!caseData.title || !caseData.description || !caseData.legalArea) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى ملء جميع الحقول" : "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-case-analysis', {
        body: {
          case_title: caseData.title,
          case_description: caseData.description,
          legal_area: caseData.legalArea
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: language === 'ar' ? "تم التحليل بنجاح" : "Analysis Complete",
        description: language === 'ar' ? "تم تحليل القضية بنجاح" : "Case analysis completed successfully"
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: language === 'ar' ? "خطأ في التحليل" : "Analysis Error",
        description: language === 'ar' ? "حدث خطأ أثناء تحليل القضية" : "An error occurred during analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <Brain className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.caseTitle}</label>
              <Input
                value={caseData.title}
                onChange={(e) => setCaseData({ ...caseData, title: e.target.value })}
                placeholder={t.caseTitle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.legalArea}</label>
              <Select value={caseData.legalArea} onValueChange={(value) => setCaseData({ ...caseData, legalArea: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t.legalArea} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="civil">{t.legalAreas.civil}</SelectItem>
                  <SelectItem value="commercial">{t.legalAreas.commercial}</SelectItem>
                  <SelectItem value="criminal">{t.legalAreas.criminal}</SelectItem>
                  <SelectItem value="family">{t.legalAreas.family}</SelectItem>
                  <SelectItem value="administrative">{t.legalAreas.administrative}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t.caseDescription}</label>
            <Textarea
              value={caseData.description}
              onChange={(e) => setCaseData({ ...caseData, description: e.target.value })}
              placeholder={t.caseDescription}
              rows={4}
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? t.analyzing : t.analyze}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <FileSearch className="h-5 w-5" />
              {t.analysisResults}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t.legalPrecedents}
                </h4>
                <ul className="space-y-2">
                  {analysis.ai_analysis?.legal_precedents?.map((precedent: string, index: number) => (
                    <li key={index} className="text-sm bg-blue-50 p-3 rounded-lg">
                      {precedent}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {t.keyIssues}
                </h4>
                <ul className="space-y-2">
                  {analysis.ai_analysis?.key_issues?.map((issue: string, index: number) => (
                    <li key={index} className="text-sm bg-amber-50 p-3 rounded-lg">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">{t.strengthAssessment}</h5>
                <p className="text-sm">{analysis.ai_analysis?.strength_assessment}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">{t.estimatedDuration}</h5>
                <p className="text-sm">{analysis.ai_analysis?.estimated_duration}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">Complexity Score</h5>
                <p className="text-sm">{analysis.ai_analysis?.complexity_score}/10</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.strategyRecommendations}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-red-700">{t.immediateActions}</h5>
                  <ul className="space-y-1">
                    {analysis.strategy_recommendations?.immediate_actions?.map((action: string, index: number) => (
                      <li key={index} className="text-sm bg-red-50 p-2 rounded">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-blue-700">{t.legalStrategies}</h5>
                  <ul className="space-y-1">
                    {analysis.strategy_recommendations?.legal_strategies?.map((strategy: string, index: number) => (
                      <li key={index} className="text-sm bg-blue-50 p-2 rounded">
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-green-700">{t.riskMitigation}</h5>
                  <ul className="space-y-1">
                    {analysis.strategy_recommendations?.risk_mitigation?.map((mitigation: string, index: number) => (
                      <li key={index} className="text-sm bg-green-50 p-2 rounded">
                        {mitigation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
