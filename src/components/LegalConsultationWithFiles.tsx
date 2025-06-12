
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, MessageSquare, FileText, AlertCircle, Brain, Settings } from 'lucide-react';

interface LegalConsultationWithFilesProps {
  language: 'ar' | 'en';
}

export const LegalConsultationWithFiles = ({ language }: LegalConsultationWithFilesProps) => {
  const [query, setQuery] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAIModel, setSelectedAIModel] = useState('jais');

  const texts = {
    ar: {
      title: 'الاستشارة القانونية مع الملفات',
      subtitle: 'احصل على استشارة قانونية مع إمكانية رفع المستندات',
      queryPlaceholder: 'اكتب استفسارك القانوني هنا...',
      uploadFiles: 'رفع الملفات',
      submit: 'إرسال الاستشارة',
      processing: 'جاري المعالجة...',
      filesUploaded: 'ملف مرفوع',
      aiResponse: 'رد المستشار القانوني',
      aiModel: 'نموذج الذكاء الاصطناعي',
      modelPoweredBy: 'مدعوم بـ'
    },
    en: {
      title: 'Legal Consultation with Files',
      subtitle: 'Get legal consultation with document upload capability',
      queryPlaceholder: 'Write your legal query here...',
      uploadFiles: 'Upload Files',
      submit: 'Submit Consultation',
      processing: 'Processing...',
      filesUploaded: 'files uploaded',
      aiResponse: 'Legal Advisor Response',
      aiModel: 'AI Model',
      modelPoweredBy: 'Powered by'
    }
  };

  const t = texts[language];

  const aiModels = {
    jais: {
      name: 'Jais',
      description: language === 'ar' ? 'النموذج الأساسي للتحليل القانوني العربي' : 'Primary Arabic legal analysis model',
      accuracy: '89%'
    },
    aratT5: {
      name: 'AraT5',
      description: language === 'ar' ? 'تبسيط المصطلحات القانونية' : 'Legal terminology simplification',
      accuracy: '82%'
    },
    camelBERT: {
      name: 'CamelBERT',
      description: language === 'ar' ? 'تحليل الوثائق القانونية' : 'Legal document analysis',
      accuracy: '85%'
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    // Simulate AI processing with Arabic-specialized models
    setTimeout(() => {
      const selectedModel = aiModels[selectedAIModel as keyof typeof aiModels];
      const modelInfo = `${t.modelPoweredBy} ${selectedModel.name} (${selectedModel.accuracy})`;
      
      const mockResponse = language === 'ar' ? `
${modelInfo}

بناءً على استفسارك والمستندات المرفقة، يمكنني تقديم التحليل التالي باستخدام نماذج الذكاء الاصطناعي العربية المتخصصة:

📋 تحليل الحالة باستخدام ${selectedModel.name}:
وفقاً للقانون السوري النافذ، والمستندات المرفقة، يتبين أن:

• النقطة الأولى: التحليل القانوني المفصل باستخدام النماذج العربية المتخصصة
• النقطة الثانية: الإجراءات المطلوبة مع مراعاة السياق السوري
• النقطة الثالثة: المخاطر المحتملة وفقاً للممارسات القضائية المحلية

⚖️ التوصيات المدعومة بالذكاء الاصطناعي:
1. مراجعة المحامي المختص في القانون السوري
2. جمع المستندات الإضافية المطلوبة حسب الأنظمة المحلية
3. تقديم الطلب خلال المهلة القانونية المحددة

📄 المراجع القانونية السورية:
- القانون المدني السوري، المادة 163
- قانون أصول المحاكمات المدنية السوري
- قرارات محكمة النقض السورية ذات الصلة

🤖 معلومات النموذج المستخدم:
النموذج: ${selectedModel.name}
الوصف: ${selectedModel.description}
دقة التحليل: ${selectedModel.accuracy}

تنبيه: هذه استشارة أولية مدعومة بالذكاء الاصطناعي وتحتاج لمراجعة قانونية متخصصة.
      ` : `
${modelInfo}

Based on your query and the uploaded documents, I can provide the following analysis using specialized Arabic AI models:

📋 Case Analysis using ${selectedModel.name}:
According to Syrian law and the attached documents, it appears that:

• First point: Detailed legal analysis using specialized Arabic models
• Second point: Required procedures considering Syrian context
• Third point: Potential risks according to local judicial practices

⚖️ AI-Powered Recommendations:
1. Consult with a lawyer specialized in Syrian law
2. Gather additional required documents per local regulations
3. Submit the application within the specified legal deadline

📄 Syrian Legal References:
- Syrian Civil Code, Article 163
- Syrian Civil Procedure Code
- Relevant Syrian Supreme Court decisions

🤖 Model Information:
Model: ${selectedModel.name}
Description: ${selectedModel.description}
Analysis Accuracy: ${selectedModel.accuracy}

Notice: This is a preliminary AI-powered consultation and requires specialized legal review.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.aiModel}</label>
            <Select value={selectedAIModel} onValueChange={setSelectedAIModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(aiModels).map(([key, model]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>{model.name} - {model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              {t.submit}
            </div>
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
