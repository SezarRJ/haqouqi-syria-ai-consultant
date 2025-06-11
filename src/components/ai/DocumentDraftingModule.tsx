
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileEdit, Download, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentDraftingModuleProps {
  language: 'ar' | 'en';
}

export const DocumentDraftingModule: React.FC<DocumentDraftingModuleProps> = ({ language }) => {
  const [isDrafting, setIsDrafting] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [documentData, setDocumentData] = useState<any>({});
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);
  const { toast } = useToast();

  const texts = {
    ar: {
      title: "وحدة صياغة الوثائق القانونية",
      selectTemplate: "اختر قالب الوثيقة",
      fillFields: "املأ البيانات المطلوبة",
      generateDocument: "إنشاء الوثيقة",
      generating: "جاري الإنشاء...",
      downloadDocument: "تحميل الوثيقة",
      saveDocument: "حفظ الوثيقة",
      documentGenerated: "تم إنشاء الوثيقة بنجاح",
      noTemplates: "لا توجد قوالب متاحة",
      preview: "معاينة الوثيقة"
    },
    en: {
      title: "Legal Document Drafting Module",
      selectTemplate: "Select Document Template",
      fillFields: "Fill Required Fields",
      generateDocument: "Generate Document",
      generating: "Generating...",
      downloadDocument: "Download Document",
      saveDocument: "Save Document",
      documentGenerated: "Document generated successfully",
      noTemplates: "No templates available",
      preview: "Document Preview"
    }
  };

  const t = texts[language];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);
    
    // Initialize document data with empty values for required fields
    if (template?.required_fields) {
      const initialData: any = {};
      template.required_fields.forEach((field: any) => {
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
      toast({
        title: language === 'ar' ? "خطأ في الإنشاء" : "Generation Error",
        description: language === 'ar' ? "حدث خطأ أثناء إنشاء الوثيقة" : "An error occurred during document generation",
        variant: "destructive"
      });
    } finally {
      setIsDrafting(false);
    }
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
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {templates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {t.noTemplates}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{t.fillFields}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate.required_fields?.map((field: any) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-2">
                  {field.label || field.name}
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadDocument}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t.downloadDocument}
                </Button>
              </div>
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
