
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, MessageSquare, FileText, AlertCircle } from 'lucide-react';

interface LegalConsultationWithFilesProps {
  language: 'ar' | 'en';
}

export const LegalConsultationWithFiles = ({ language }: LegalConsultationWithFilesProps) => {
  const [query, setQuery] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const texts = {
    ar: {
      title: 'الاستشارة القانونية مع الملفات',
      subtitle: 'احصل على استشارة قانونية مع إمكانية رفع المستندات',
      queryPlaceholder: 'اكتب استفسارك القانوني هنا...',
      uploadFiles: 'رفع الملفات',
      submit: 'إرسال الاستشارة',
      processing: 'جاري المعالجة...',
      filesUploaded: 'ملف مرفوع',
      aiResponse: 'رد المستشار القانوني'
    },
    en: {
      title: 'Legal Consultation with Files',
      subtitle: 'Get legal consultation with document upload capability',
      queryPlaceholder: 'Write your legal query here...',
      uploadFiles: 'Upload Files',
      submit: 'Submit Consultation',
      processing: 'Processing...',
      filesUploaded: 'files uploaded',
      aiResponse: 'Legal Advisor Response'
    }
  };

  const t = texts[language];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      const mockResponse = language === 'ar' ? `
بناءً على استفسارك والمستندات المرفقة، يمكنني تقديم التحليل التالي:

📋 تحليل الحالة:
وفقاً للقانون السوري النافذ، والمستندات المرفقة، يتبين أن:

• النقطة الأولى: التحليل القانوني المفصل
• النقطة الثانية: الإجراءات المطلوبة
• النقطة الثالثة: المخاطر المحتملة

⚖️ التوصيات:
1. مراجعة المحامي المختص
2. جمع المستندات الإضافية المطلوبة
3. تقديم الطلب خلال المهلة القانونية

📄 المراجع القانونية:
- القانون المدني السوري، المادة 163
- قانون أصول المحاكمات المدنية
- قرارات محكمة النقض ذات الصلة

تنبيه: هذه استشارة أولية وتحتاج لمراجعة قانونية متخصصة.
      ` : `
Based on your query and the uploaded documents, I can provide the following analysis:

📋 Case Analysis:
According to Syrian law and the attached documents, it appears that:

• First point: Detailed legal analysis
• Second point: Required procedures
• Third point: Potential risks

⚖️ Recommendations:
1. Consult with a specialized lawyer
2. Gather additional required documents
3. Submit the application within the legal deadline

📄 Legal References:
- Syrian Civil Code, Article 163
- Civil Procedure Code
- Relevant Supreme Court decisions

Notice: This is a preliminary consultation and requires specialized legal review.
      `;
      
      setResponse(mockResponse);
      setLoading(false);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.queryPlaceholder}
            className="min-h-32"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {t.uploadFiles}
                </span>
              </Button>
            </label>
          </div>
          
          {files.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {files.length} {t.filesUploaded}
            </Badge>
          )}
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={!query.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              {t.processing}
            </div>
          ) : (
            t.submit
          )}
        </Button>

        {response && (
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              {t.aiResponse}
            </h4>
            <div className="border rounded-lg p-4 bg-blue-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <pre className="whitespace-pre-wrap text-sm">
                {response}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
