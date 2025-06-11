
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LegalConsultationWithFiles } from './LegalConsultationWithFiles';
import { RiskAssessment } from './RiskAssessment';
import { DocumentDrafting } from './DocumentDrafting';
import { ExplanationModeToggle } from './ExplanationModeToggle';
import { CollaborationHub } from './CollaborationHub';
import { AdvancedFeatures } from './AdvancedFeatures';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedLegalConsultationProps {
  language: 'ar' | 'en';
}

export const EnhancedLegalConsultation = ({ language }: EnhancedLegalConsultationProps) => {
  const [activeTab, setActiveTab] = useState('consultation');
  const [caseDetails, setCaseDetails] = useState('');
  const isMobile = useIsMobile();

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
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="w-full overflow-x-auto">
          <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} w-full min-w-max gap-1`}>
            <TabsTrigger 
              value="consultation"
              className={`${isMobile ? 'text-xs px-2' : 'text-sm px-3'} whitespace-nowrap`}
            >
              {t.consultation}
            </TabsTrigger>
            <TabsTrigger 
              value="risk-assessment"
              className={`${isMobile ? 'text-xs px-2' : 'text-sm px-3'} whitespace-nowrap`}
            >
              {isMobile ? 'المخاطر' : t.riskAssessment}
            </TabsTrigger>
            <TabsTrigger 
              value="document-drafting"
              className={`${isMobile ? 'text-xs px-2' : 'text-sm px-3'} whitespace-nowrap`}
            >
              {isMobile ? 'الوثائق' : t.documentDrafting}
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="explanations" className="text-sm px-3 whitespace-nowrap">
                  {t.explanations}
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="text-sm px-3 whitespace-nowrap">
                  {t.collaboration}
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-sm px-3 whitespace-nowrap">
                  {t.advanced}
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        <div className="w-full min-h-0">
          <TabsContent value="consultation" className="space-y-4 mt-4">
            <LegalConsultationWithFiles language={language} />
          </TabsContent>

          <TabsContent value="risk-assessment" className="space-y-4 mt-4">
            <RiskAssessment language={language} caseDetails={caseDetails} />
          </TabsContent>

          <TabsContent value="document-drafting" className="space-y-4 mt-4">
            <DocumentDrafting language={language} />
          </TabsContent>

          {!isMobile && (
            <>
              <TabsContent value="explanations" className="space-y-4 mt-4">
                <ExplanationModeToggle 
                  language={language} 
                  content="Sample legal content for explanation"
                />
              </TabsContent>

              <TabsContent value="collaboration" className="space-y-4 mt-4">
                <CollaborationHub language={language} />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <AdvancedFeatures language={language} />
              </TabsContent>
            </>
          )}
        </div>

        {isMobile && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                <h3 className="font-semibold text-blue-900 mb-2">{t.explanations}</h3>
                <ExplanationModeToggle 
                  language={language} 
                  content="Sample legal content for explanation"
                />
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                <h3 className="font-semibold text-blue-900 mb-2">{t.collaboration}</h3>
                <CollaborationHub language={language} />
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                <h3 className="font-semibold text-blue-900 mb-2">{t.advanced}</h3>
                <AdvancedFeatures language={language} />
              </div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
};
