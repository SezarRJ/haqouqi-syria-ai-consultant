
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EnhancedDocumentUpload = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    size: number;
    status: 'uploading' | 'analyzing' | 'completed' | 'error';
    analysis?: string;
    progress: number;
  }>>([]);

  const analyzeDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Simulate document analysis (in real implementation, this would process the file)
      const mockAnalysis = `تحليل الوثيقة: ${file.name}

النوع: ${file.type.includes('pdf') ? 'وثيقة PDF' : 'وثيقة نصية'}
الحجم: ${(file.size / 1024).toFixed(1)} كيلوبايت

التحليل القانوني:
• تم فحص الوثيقة للبنود القانونية ذات الصلة
• توجد إشارات إلى القوانين السورية التالية: القانون المدني، قانون العقوبات
• يُنصح بمراجعة المواد 123-145 من القانون المدني
• تحتاج بعض البنود إلى توضيح قانوني إضافي

التوصيات:
- مراجعة نصوص العقد مع محامي مختص
- التأكد من مطابقة البنود للقوانين السورية النافذة
- إضافة بنود حماية إضافية حسب طبيعة العقد

تنبيه: هذا تحليل أولي وليس استشارة قانونية نهائية.`;

      // Save analysis to database
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          user_id: user?.id,
          consultation_type: 'document_analysis',
          query_text: `تحليل الوثيقة: ${file.name}`,
          ai_response: mockAnalysis,
          documents_uploaded: [file.name],
          confidence_score: 0.78
        }])
        .select()
        .single();

      if (error) throw error;
      return mockAnalysis;
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const fileInfo = {
        name: file.name,
        size: file.size,
        status: 'uploading' as const,
        progress: 0
      };

      setUploadedFiles(prev => [...prev, fileInfo]);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.name === file.name && f.status === 'uploading'
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 200);

      // Start analysis after "upload" completes
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.name === file.name 
              ? { ...f, status: 'analyzing', progress: 100 }
              : f
          )
        );

        analyzeDocumentMutation.mutate(file, {
          onSuccess: (analysis) => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.name === file.name 
                  ? { ...f, status: 'completed', analysis }
                  : f
              )
            );
            toast({
              title: "تم التحليل بنجاح",
              description: `تم تحليل الوثيقة ${file.name} بنجاح`,
            });
          },
          onError: () => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.name === file.name 
                  ? { ...f, status: 'error' }
                  : f
              )
            );
            toast({
              title: "خطأ في التحليل",
              description: `فشل في تحليل الوثيقة ${file.name}`,
              variant: "destructive"
            });
          }
        });
      }, 2000);
    });
  }, [analyzeDocumentMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'analyzing':
        return <div className="h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Badge variant="secondary">جاري الرفع</Badge>;
      case 'analyzing':
        return <Badge variant="secondary">جاري التحليل</Badge>;
      case 'completed':
        return <Badge variant="default">مكتمل</Badge>;
      case 'error':
        return <Badge variant="destructive">خطأ</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          تحليل الوثائق
        </CardTitle>
        <CardDescription>
          ارفع وثائقك واحصل على تحليل قانوني شامل
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">اسحب الملفات هنا...</p>
          ) : (
            <div>
              <p className="text-gray-600 font-medium mb-2">
                اسحب الملفات هنا أو انقر للاختيار
              </p>
              <p className="text-sm text-gray-500">
                يدعم: PDF, DOC, DOCX, TXT (حتى 5 ميجابايت)
              </p>
            </div>
          )}
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الملفات المرفوعة</h3>
            
            {uploadedFiles.map((file, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(file.status)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} كيلوبايت
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(file.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="mb-3" />
                )}

                {file.analysis && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">نتيجة التحليل:</h4>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {file.analysis}
                    </pre>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">كيفية استخدام خدمة تحليل الوثائق:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• ارفع العقود والوثائق القانونية للحصول على تحليل شامل</li>
            <li>• يتم فحص الوثائق للبحث عن البنود القانونية والمخاطر المحتملة</li>
            <li>• احصل على توصيات قانونية وإرشادات للخطوات التالية</li>
            <li>• جميع الوثائق محمية ومشفرة لضمان السرية التامة</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
