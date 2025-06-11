import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, FileText, File, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export const DatabaseManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);

  const { data: laws } = useQuery({
    queryKey: ['laws-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laws')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    }
  });

  const { data: articles } = useQuery({
    queryKey: ['articles-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('law_articles')
        .select('id', { count: 'exact' });
      return count || 0;
    }
  });

  const processDocumentsMutation = useMutation({
    mutationFn: async (files: UploadedFile[]) => {
      setProcessing(true);
      // Simulate document processing - in real implementation, this would:
      // 1. Extract text from PDF/DOC files
      // 2. Parse legal content
      // 3. Insert into laws and law_articles tables
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock data insertion
      const { data: { user } } = await supabase.auth.getUser();
      
      for (const file of files) {
        await supabase.from('laws').insert({
          name: `قانون مستخرج من ${file.name}`,
          number: `AUTO-${Date.now()}`,
          category: 'مستخرج تلقائياً',
          description: `تم استخراجه من الملف: ${file.name}`,
          content: `محتوى مستخرج من الملف ${file.name}`,
          created_by: user?.id
        });
      }
      
      setProcessing(false);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laws-list'] });
      queryClient.invalidateQueries({ queryKey: ['articles-count'] });
      setSelectedFiles([]);
      toast({
        title: "تم بنجاح",
        description: "تم معالجة الملفات وإضافتها إلى قاعدة البيانات",
      });
    },
    onError: () => {
      setProcessing(false);
      toast({
        title: "خطأ",
        description: "فشل في معالجة الملفات",
        variant: "destructive",
      });
    }
  });

  const handleFilesChange = (files: UploadedFile[]) => {
    setSelectedFiles(files);
  };

  const handleProcessDocuments = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "تحذير",
        description: "يرجى اختيار ملفات للمعالجة",
        variant: "destructive",
      });
      return;
    }
    processDocumentsMutation.mutate(selectedFiles);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">إدارة قاعدة البيانات</h2>
        <p className="text-gray-600">معالجة الوثائق وإدارة المحتوى القانوني</p>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي القوانين</p>
                <p className="text-2xl font-bold">{laws?.length || 0}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المواد</p>
                <p className="text-2xl font-bold">{articles}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">حالة النظام</p>
                <p className="text-lg font-bold text-green-600">متصل</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            معالجة الوثائق
          </CardTitle>
          <CardDescription>
            رفع ومعالجة ملفات PDF و DOC و TXT لاستخراج المحتوى القانوني
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            onFilesChange={handleFilesChange}
            maxFiles={10}
            acceptedTypes={['application/pdf', '.doc', '.docx', '.txt']}
          />
          
          {selectedFiles.length > 0 && (
            <div className="flex justify-end">
              <Button 
                onClick={handleProcessDocuments}
                disabled={processing}
                className="flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    معالجة الملفات
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Laws */}
      <Card>
        <CardHeader>
          <CardTitle>القوانين الحديثة</CardTitle>
          <CardDescription>آخر القوانين المضافة إلى قاعدة البيانات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {laws?.map((law) => (
              <div key={law.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{law.name}</p>
                  <p className="text-sm text-gray-600">رقم {law.number} - {law.category}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(law.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <Badge variant={law.status === 'active' ? 'default' : 'secondary'}>
                  {law.status === 'active' ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
            ))}
            {(!laws || laws.length === 0) && (
              <p className="text-gray-500 text-center py-4">لا توجد قوانين في قاعدة البيانات</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
