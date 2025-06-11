
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LegalConsultationWithFiles } from './LegalConsultationWithFiles';
import { RiskAssessment } from './RiskAssessment';
import { DocumentDrafting } from './DocumentDrafting';
import { ExplanationModeToggle } from './ExplanationModeToggle';
import { CollaborationHub } from './CollaborationHub';
import { AdvancedFeatures } from './AdvancedFeatures';

interface EnhancedLegalConsultationProps {
  language: 'ar' | 'en';
}

export const EnhancedLegalConsultation = ({ language }: EnhancedLegalConsultationProps) => {
  const [activeTab, setActiveTab] = useState('consultation');
  const [caseDetails, setCaseDetails] = useState('');

  const texts = {
    ar: {
      consultation: 'الاستشارة',
      riskAssessment: 'تقييم المخاطر',
      documentDrafting: 'صياغة الوثائق',
      explanations: 'الشرح',
      collaboration: 'التعاون',
      advanced: 'متقدم'
    },
    en: {
      consultation: 'Consultation',
      riskAssessment: 'Risk Assessment',
      documentDrafting: 'Document Drafting',
      explanations: 'Explanations',
      collaboration: 'Collaboration',
      advanced: 'Advanced'
    }
  };

  const t = texts[language];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="consultation">{t.consultation}</TabsTrigger>
          <TabsTrigger value="risk-assessment">{t.riskAssessment}</TabsTrigger>
          <TabsTrigger value="document-drafting">{t.documentDrafting}</TabsTrigger>
          <TabsTrigger value="explanations">{t.explanations}</TabsTrigger>
          <TabsTrigger value="collaboration">{t.collaboration}</TabsTrigger>
          <TabsTrigger value="advanced">{t.advanced}</TabsTrigger>
        </TabsList>

        <TabsContent value="consultation" className="space-y-4">
          <LegalConsultationWithFiles language={language} />
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-4">
          <RiskAssessment language={language} caseDetails={caseDetails} />
        </TabsContent>

        <TabsContent value="document-drafting" className="space-y-4">
          <DocumentDrafting language={language} />
        </TabsContent>

        <TabsContent value="explanations" className="space-y-4">
          <ExplanationModeToggle 
            language={language} 
            content="Sample legal content for explanation"
          />
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          <CollaborationHub language={language} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedFeatures language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
