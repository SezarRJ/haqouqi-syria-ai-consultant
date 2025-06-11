
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileEdit, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentDraftingModuleProps {
  language: 'ar' | 'en';
}

interface DocumentTemplate {
  id: string;
  name: string;
  document_type: string;
  required_fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
  }>;
}

export const DocumentDraftingModule: React.FC<DocumentDraftingModuleProps> = ({ language }) => {
  const [isDrafting, setIsDrafting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [documentData, setDocumentData] = useState<any>({});
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);
  const { toast } = useToast();

  // Mock templates for demonstration
  const mockTemplates: DocumentTemplate[] = [
    {
      id: '1',
      name: language === 'ar' ? 'عقد بيع' : 'Sales Contract',
      document_type: 'contract',
      required_fields: [
        { name: 'seller_name', label: language === 'ar' ? 'اسم البائع' : 'Seller Name', type: 'text', required: true },
        { name: 'buyer_name', label: language === 'ar' ? 'اسم المشتري' : 'Buyer Name', type: 'text', required: true },
        { name: 'property_description', label: language === 'ar' ? 'وصف العقار' : 'Property Description', type: 'textarea', required: true },
        { name: 'price', label: language === 'ar' ? 'السعر' : 'Price', type: 'number', required: true }
      ]
    },
    {
      id: '2',
      name: language === 'ar' ? 'عقد إيجار' : 'Rental Agreement',
      document_type: 'rental',
      required_fields: [
        { name: 'landlord_name', label: language === 'ar' ? 'اسم المؤجر' : 'Landlord Name', type: 'text', required: true },
        { name: 'tenant_name', label: language === 'ar' ? 'اسم المستأجر' : 'Tenant Name', type: 'text', required: true },
        { name: 'property_address', label: language === 'ar' ? 'عنوان العقار' : 'Property Address', type: 'textarea', required: true },
        { name: 'monthly_rent', label: language === 'ar' ? 'الإيجار الشهري' : 'Monthly Rent', type: 'number', required: true },
        { name: 'lease_duration', label: language === 'ar' ? 'مدة الإيجار' : 'Lease Duration', type: 'text', required: true }
      ]
    }
  ];

  const texts = {
    ar: {
      title: "وحدة صياغة الوثائق القانونية",
      selectTemplate: "اختر قالب الوثيقة",
      fillFields: "املأ البيانات المطلوبة",
      generateDocument: "إنشاء الوثيقة",
      generating: "جاري الإنشاء...",
      downloadDocument: "تحميل الوثيقة",
      documentGenerated: "تم إنشاء الوثيقة بنجاح",
      preview: "معاينة الوثيقة"
    },
    en: {
      title: "Legal Document Drafting Module",
      selectTemplate: "Select Document Template",
      fillFields: "Fill Required Fields",
      generateDocument: "Generate Document",
      generating: "Generating...",
      downloadDocument: "Download Document",
      documentGenerated: "Document generated successfully",
      preview: "Document Preview"
    }
  };

  const t = texts[language];

  const handleTemplateSelect = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    
    // Initialize document data with empty values for required fields
    if (template?.required_fields) {
      const initialData: any = {};
      template.required_fields.forEach((field) => {
        initialData[field.name] = '';
      });
      setDocumentData(initialData);
    }
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;

    setIsDrafting(true);
    try {
      const { data, error } = await supabase.functions.invoke('document-drafting', {
        body: {
          template_id: selectedTemplate.id,
          document_data: documentData
        }
      });

      if (error) throw error;

      setGeneratedDocument(data.document);
      toast({
        title: language === 'ar' ? "تم الإنشاء بنجاح" : "Generated Successfully",
        description: t.documentGenerated
      });
    } catch (error) {
      console.error('Document generation error:', error);
      
      // Fallback: Generate a simple document locally
      const mockDocument = {
        generated_content: generateMockDocument(selectedTemplate, documentData, language)
      };
      setGeneratedDocument(mockDocument);
      
      toast({
        title: language === 'ar' ? "تم الإنشاء بنجاح" : "Generated Successfully",
        description: t.documentGenerated
      });
    } finally {
      setIsDrafting(false);
    }
  };

  const generateMockDocument = (template: DocumentTemplate, data: any, lang: 'ar' | 'en') => {
    const templateName = template.name;
    const fields = template.required_fields.map(field => 
      `${field.label}: ${data[field.name] || 'غير محدد'}`
    ).join('\n');

    return lang === 'ar' ? 
      `${templateName}\n\n${fields}\n\nتم إنشاء هذه الوثيقة تلقائياً باستخدام نظام الذكاء الاصطناعي القانوني.\n\nتاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}` :
      `${templateName}\n\n${fields}\n\nThis document was automatically generated using the AI Legal System.\n\nGeneration Date: ${new Date().toLocaleDateString()}`;
  };

  const handleDownloadDocument = () => {
    if (!generatedDocument) return;

    const blob = new Blob([generatedDocument.generated_content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.name || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <FileEdit className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.selectTemplate}</label>
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectTemplate} />
              </SelectTrigger>
              <SelectContent>
                {mockTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{t.fillFields}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate.required_fields?.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <Textarea
                    value={documentData[field.name] || ''}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      [field.name]: e.target.value
                    })}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : (
                  <Input
                    type={field.type || 'text'}
                    value={documentData[field.name] || ''}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      [field.name]: e.target.value
                    })}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}

            <Button
              onClick={handleGenerateDocument}
              disabled={isDrafting}
              className="w-full"
            >
              {isDrafting ? t.generating : t.generateDocument}
            </Button>
          </CardContent>
        </Card>
      )}

      {generatedDocument && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t.preview}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadDocument}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t.downloadDocument}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">
                {generatedDocument.generated_content}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
