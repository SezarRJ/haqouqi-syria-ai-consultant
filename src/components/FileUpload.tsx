
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesChange, 
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt']
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "خطأ",
        description: `يمكنك رفع ${maxFiles} ملفات كحد أقصى`,
        variant: "destructive"
      });
      return;
    }

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);

    toast({
      title: "تم الرفع بنجاح",
      description: `تم رفع ${acceptedFiles.length} ملف`
    });
  }, [uploadedFiles, maxFiles, onFilesChange, toast]);

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    multiple: true
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg ${isMobile ? 'p-4' : 'p-6'} text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} mx-auto mb-4 text-gray-400`} />
            {isDragActive ? (
              <p className="text-blue-600 text-sm">اسحب الملفات هنا...</p>
            ) : (
              <div>
                <p className={`text-gray-600 mb-2 ${isMobile ? 'text-sm' : ''}`}>
                  {isMobile ? 'اضغط لاختيار الملفات' : 'اسحب الملفات هنا أو انقر للاختيار'}
                </p>
                <p className="text-xs text-gray-500">
                  الحد الأقصى: {maxFiles} ملفات
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <h4 className={`font-medium mb-3 ${isMobile ? 'text-sm' : ''}`}>الملفات المرفوعة ({uploadedFiles.length})</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className={`flex items-center justify-between ${isMobile ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg`}>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium truncate`}>{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
