
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OCRServiceIntegrationProps {
  language: 'ar' | 'en';
}

export const OCRServiceIntegration: React.FC<OCRServiceIntegrationProps> = ({ language }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [ocrResults, setOcrResults] = useState<any[]>([]);
  const { toast } = useToast();

  const texts = {
    ar: {
      title: "خدمة استخراج النصوص من الوثائق (OCR)",
      uploadDocuments: "رفع الوثائق",
      supportedFormats: "الصيغ المدعومة: PDF, JPG, PNG",
      processDocuments: "معالجة الوثائق",
      processing: "جاري المعالجة...",
      extractedText: "النص المستخرج",
      confidence: "درجة الثقة",
      downloadText: "تحميل النص",
      status: "الحالة",
      completed: "مكتمل",
      failed: "فشل",
      pending: "في الانتظار",
      noFiles: "لا توجد ملفات مرفوعة",
      processingComplete: "تمت المعالجة بنجاح",
      processingError: "خطأ في المعالجة"
    },
    en: {
      title: "OCR Service Integration",
      uploadDocuments: "Upload Documents",
      supportedFormats: "Supported formats: PDF, JPG, PNG",
      processDocuments: "Process Documents",
      processing: "Processing...",
      extractedText: "Extracted Text",
      confidence: "Confidence",
      downloadText: "Download Text",
      status: "Status",
      completed: "Completed",
      failed: "Failed",
      pending: "Pending",
      noFiles: "No files uploaded",
      processingComplete: "Processing completed successfully",
      processingError: "Processing error"
    }
  };

  const t = texts[language];

  const handleFilesSelected = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      status: 'pending',
      extractedText: '',
      confidence: 0
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleProcessDocuments = async () => {
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
    
    if (pendingFiles.length === 0) {
      toast({
        title: language === 'ar' ? "تنبيه" : "Warning",
        description: language === 'ar' ? "لا توجد ملفات للمعالجة" : "No files to process",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    for (const fileItem of pendingFiles) {
      try {
        // Update status to processing
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'processing' } : f
        ));

        const formData = new FormData();
        formData.append('file', fileItem.file);

        const { data, error } = await supabase.functions.invoke('ocr-service', {
          body: formData
        });

        if (error) throw error;

        // Update with results
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileItem.id ? {
            ...f,
            status: 'completed',
            extractedText: data.extracted_text,
            confidence: data.confidence,
            uploadId: data.upload_id
          } : f
        ));

        setOcrResults(prev => [...prev, {
          ...data,
          fileName: fileItem.file.name
        }]);

      } catch (error) {
        console.error('OCR processing error:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'failed' } : f
        ));
      }
    }

    setIsProcessing(false);
    toast({
      title: language === 'ar' ? "تمت المعالجة" : "Processing Complete",
      description: t.processingComplete
    });
  };

  const handleDownloadText = (text: string, fileName: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t.completed;
      case 'failed': return t.failed;
      case 'processing': return t.processing;
      default: return t.pending;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <Upload className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.uploadDocuments}</label>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
              maxFiles={10}
              multiple
            />
            <p className="text-xs text-gray-500 mt-2">{t.supportedFormats}</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
                <Button
                  onClick={handleProcessDocuments}
                  disabled={isProcessing || uploadedFiles.every(f => f.status !== 'pending')}
                  size="sm"
                >
                  {isProcessing ? t.processing : t.processDocuments}
                </Button>
              </div>

              <div className="space-y-2">
                {uploadedFiles.map((fileItem) => (
                  <div key={fileItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(fileItem.status)}
                      <div>
                        <p className="text-sm font-medium">{fileItem.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {t.status}: {getStatusText(fileItem.status)}
                          {fileItem.confidence > 0 && (
                            <span className="ml-2">
                              {t.confidence}: {(fileItem.confidence * 100).toFixed(1)}%
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {fileItem.extractedText && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadText(fileItem.extractedText, fileItem.file.name)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        {t.downloadText}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadedFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {t.noFiles}
            </div>
          )}
        </CardContent>
      </Card>

      {ocrResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.extractedText}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ocrResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium">{result.fileName}</h5>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {t.confidence}: {(result.confidence * 100).toFixed(1)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadText(result.extracted_text, result.fileName)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t.downloadText}
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {result.extracted_text}
                  </pre>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
