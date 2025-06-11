
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, TrendingDown, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RiskAssessmentAlgorithmProps {
  language: 'ar' | 'en';
}

export const RiskAssessmentAlgorithm: React.FC<RiskAssessmentAlgorithmProps> = ({ language }) => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentData, setAssessmentData] = useState({
    complexity_level: 5,
    evidence_quality: 7,
    procedural_issues: false,
    claim_amount: 0,
    urgency_level: 3,
    opponent_resources: 5
  });
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const { toast } = useToast();

  const texts = {
    ar: {
      title: "خوارزمية تقييم المخاطر",
      complexityLevel: "مستوى التعقيد القانوني",
      evidenceQuality: "جودة الأدلة",
      proceduralIssues: "وجود مشاكل إجرائية",
      claimAmount: "قيمة المطالبة (ليرة سورية)",
      urgencyLevel: "مستوى الإلحاح",
      opponentResources: "موارد الطرف المقابل",
      assessRisk: "تقييم المخاطر",
      assessing: "جاري التقييم...",
      riskScore: "درجة المخاطر",
      riskLevel: "مستوى المخاطر",
      low: "منخفض",
      moderate: "متوسط",
      high: "عالي",
      critical: "حرج",
      riskFactors: "عوامل المخاطر",
      mitigationStrategies: "استراتيجيات التخفيف",
      yes: "نعم",
      no: "لا"
    },
    en: {
      title: "Risk Assessment Algorithm",
      complexityLevel: "Legal Complexity Level",
      evidenceQuality: "Evidence Quality",
      proceduralIssues: "Procedural Issues Present",
      claimAmount: "Claim Amount (SYP)",
      urgencyLevel: "Urgency Level",
      opponentResources: "Opponent Resources",
      assessRisk: "Assess Risk",
      assessing: "Assessing...",
      riskScore: "Risk Score",
      riskLevel: "Risk Level",
      low: "Low",
      moderate: "Moderate",
      high: "High",
      critical: "Critical",
      riskFactors: "Risk Factors",
      mitigationStrategies: "Mitigation Strategies",
      yes: "Yes",
      no: "No"
    }
  };

  const t = texts[language];

  const handleAssessRisk = async () => {
    setIsAssessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('risk-assessment', {
        body: {
          case_id: null, // Can be linked to a specific case
          assessment_data: assessmentData
        }
      });

      if (error) throw error;

      setRiskAssessment(data.assessment);
      toast({
        title: language === 'ar' ? "تم التقييم بنجاح" : "Assessment Complete",
        description: language === 'ar' ? "تم تقييم المخاطر بنجاح" : "Risk assessment completed successfully"
      });
    } catch (error) {
      console.error('Risk assessment error:', error);
      toast({
        title: language === 'ar' ? "خطأ في التقييم" : "Assessment Error",
        description: language === 'ar' ? "حدث خطأ أثناء تقييم المخاطر" : "An error occurred during risk assessment",
        variant: "destructive"
      });
    } finally {
      setIsAssessing(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 25) return { level: t.low, color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score < 50) return { level: t.moderate, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (score < 75) return { level: t.high, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { level: t.critical, color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const getRiskIcon = (score: number) => {
    if (score < 25) return <Shield className="h-6 w-6 text-green-600" />;
    if (score < 50) return <TrendingDown className="h-6 w-6 text-yellow-600" />;
    if (score < 75) return <TrendingUp className="h-6 w-6 text-orange-600" />;
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <AlertTriangle className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                {t.complexityLevel}: {assessmentData.complexity_level}/10
              </label>
              <Slider
                value={[assessmentData.complexity_level]}
                onValueChange={(value) => setAssessmentData({
                  ...assessmentData,
                  complexity_level: value[0]
                })}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                {t.evidenceQuality}: {assessmentData.evidence_quality}/10
              </label>
              <Slider
                value={[assessmentData.evidence_quality]}
                onValueChange={(value) => setAssessmentData({
                  ...assessmentData,
                  evidence_quality: value[0]
                })}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.proceduralIssues}</label>
              <Select 
                value={assessmentData.procedural_issues.toString()} 
                onValueChange={(value) => setAssessmentData({
                  ...assessmentData,
                  procedural_issues: value === 'true'
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">{t.no}</SelectItem>
                  <SelectItem value="true">{t.yes}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.claimAmount}</label>
              <Input
                type="number"
                value={assessmentData.claim_amount}
                onChange={(e) => setAssessmentData({
                  ...assessmentData,
                  claim_amount: Number(e.target.value)
                })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                {t.urgencyLevel}: {assessmentData.urgency_level}/10
              </label>
              <Slider
                value={[assessmentData.urgency_level]}
                onValueChange={(value) => setAssessmentData({
                  ...assessmentData,
                  urgency_level: value[0]
                })}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                {t.opponentResources}: {assessmentData.opponent_resources}/10
              </label>
              <Slider
                value={[assessmentData.opponent_resources]}
                onValueChange={(value) => setAssessmentData({
                  ...assessmentData,
                  opponent_resources: value[0]
                })}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <Button
            onClick={handleAssessRisk}
            disabled={isAssessing}
            className="w-full"
          >
            {isAssessing ? t.assessing : t.assessRisk}
          </Button>
        </CardContent>
      </Card>

      {riskAssessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t.riskScore}
              <div className="flex items-center gap-2">
                {getRiskIcon(riskAssessment.risk_score)}
                <span className={`text-2xl font-bold ${getRiskLevel(riskAssessment.risk_score).color}`}>
                  {riskAssessment.risk_score.toFixed(1)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 rounded-lg ${getRiskLevel(riskAssessment.risk_score).bgColor}`}>
              <div className="flex items-center gap-2 mb-2">
                {getRiskIcon(riskAssessment.risk_score)}
                <span className={`font-semibold ${getRiskLevel(riskAssessment.risk_score).color}`}>
                  {t.riskLevel}: {getRiskLevel(riskAssessment.risk_score).level}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.riskFactors}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(riskAssessment.risk_factors || {}).map(([factor, score]) => (
                  <div key={factor} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium capitalize">
                        {factor.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-semibold">{Number(score).toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(Number(score), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {riskAssessment.mitigation_strategies && riskAssessment.mitigation_strategies.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">{t.mitigationStrategies}</h4>
                <div className="space-y-2">
                  {riskAssessment.mitigation_strategies.map((strategy: string, index: number) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                      <p className="text-sm">{strategy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
