
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CaseAnalysisEngine } from './CaseAnalysisEngine';
import { IntelligentLegalSearch } from './IntelligentLegalSearch';
import { DocumentDraftingModule } from './DocumentDraftingModule';
import { RiskAssessmentAlgorithm } from './RiskAssessmentAlgorithm';
import { OCRServiceIntegration } from './OCRServiceIntegration';
import { Brain, Search, FileEdit, AlertTriangle, Upload } from 'lucide-react';

interface AILegalSuiteProps {
  language: 'ar' | 'en';
}

export const AILegalSuite: React.FC<AILegalSuiteProps> = ({ language }) => {
  const texts = {
    ar: {
      title: "مجموعة الأدوات القانونية بالذكاء الاصطناعي",
      subtitle: "أدوات متقدمة لتحليل القضايا والبحث والصياغة وتقييم المخاطر",
      caseAnalysis: "تحليل القضايا",
      legalSearch: "البحث القانوني",
      documentDrafting: "صياغة الوثائق",
      riskAssessment: "تقييم المخاطر",
      ocrService: "استخراج النصوص"
    },
    en: {
      title: "AI Legal Suite",
      subtitle: "Advanced tools for case analysis, legal search, drafting, and risk assessment",
      caseAnalysis: "Case Analysis",
      legalSearch: "Legal Search",
      documentDrafting: "Document Drafting",
      riskAssessment: "Risk Assessment",
      ocrService: "OCR Service"
    }
  };

  const t = texts[language];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">{t.title}</CardTitle>
          <p className="text-gray-600">{t.subtitle}</p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="case-analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="case-analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">{t.caseAnalysis}</span>
          </TabsTrigger>
          <TabsTrigger value="legal-search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">{t.legalSearch}</span>
          </TabsTrigger>
          <TabsTrigger value="document-drafting" className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            <span className="hidden sm:inline">{t.documentDrafting}</span>
          </TabsTrigger>
          <TabsTrigger value="risk-assessment" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">{t.riskAssessment}</span>
          </TabsTrigger>
          <TabsTrigger value="ocr-service" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">{t.ocrService}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="case-analysis">
          <CaseAnalysisEngine language={language} />
        </TabsContent>

        <TabsContent value="legal-search">
          <IntelligentLegalSearch language={language} />
        </TabsContent>

        <TabsContent value="document-drafting">
          <DocumentDraftingModule language={language} />
        </TabsContent>

        <TabsContent value="risk-assessment">
          <RiskAssessmentAlgorithm language={language} />
        </TabsContent>

        <TabsContent value="ocr-service">
          <OCRServiceIntegration language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
