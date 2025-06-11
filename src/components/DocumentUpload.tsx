
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Image, X, Check } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  extractedText?: string;
}

const DocumentUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const simulateFileProcessing = (file: UploadedFile) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setFiles(prev => prev.map(f => 
        f.id === file.id && f.progress < 100 
          ? { ...f, progress: f.progress + 10 }
          : f
      ));
    }, 200);

    setTimeout(() => {
      clearInterval(uploadInterval);
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { 
              ...f, 
              status: 'processing',
              progress: 100
            }
          : f
      ));

      // Simulate OCR processing
      setTimeout(() => {
        const extractedText = `نص مُستخرج من الملف: ${file.name}
        
هذا نص تجريبي يمثل محتوى الوثيقة المُحمّلة. في التطبيق الفعلي، سيتم استخدام تقنية OCR لاستخراج النص من الصور والملفات الممسوحة ضوئياً.

المحتوى المُستخرج سيتم تحليله بواسطة الذكاء الاصطناعي لتقديم الاستشارة القانونية المناسبة.`;

        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'completed',
                extractedText
              }
            : f
        ));
      }, 2000);
    }, 2000);
  };

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Start processing each file
    newFiles.forEach(file => {
      simulateFileProcessing(file);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading': return 'جاري الرفع...';
      case 'processing': return 'جاري المعالجة...';
      case 'completed': return 'مكتمل';
      case 'error': return 'خطأ';
      default: return '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          رفع الوثائق
        </CardTitle>
        <CardDescription>
          قم برفع الوثائق والصور للحصول على تحليل قانوني دقيق
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-legal-blue bg-blue-50' 
              : 'border-gray-300 hover:border-legal-blue'
          }`}
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">اسحب الملفات هنا أو اضغط للاختيار</h3>
          <p className="text-sm text-muted-foreground mb-4">
            يدعم ملفات PDF، Word، والصور (JPG، PNG)
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            className="hidden"
            id="file-upload"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              اختيار الملفات
            </label>
          </Button>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">الملفات المُحمّلة</h4>
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${getStatusColor(file.status)}`}>
                      {getStatusText(file.status)}
                    </span>
                    {file.status === 'completed' && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="mb-2" />
                )}
                
                {file.extractedText && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border">
                    <h5 className="font-medium mb-2">النص المُستخرج:</h5>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {file.extractedText}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
