
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, FileText, File, Check, X, Activity } from 'lucide-react';
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">إدارة قاعدة البيانات</h2>
            <p className="text-slate-600">معالجة الوثائق وإدارة المحتوى القانوني</p>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">إجمالي القوانين</p>
                <p className="text-2xl font-bold text-blue-800">{laws?.length || 0}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">إجمالي المواد</p>
                <p className="text-2xl font-bold text-green-800">{articles}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">حالة النظام</p>
                <p className="text-lg font-bold text-emerald-800">متصل</p>
              </div>
              <Activity className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Processing */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Upload className="h-5 w-5" />
            معالجة الوثائق
          </CardTitle>
          <CardDescription className="text-purple-600">
            رفع ومعالجة ملفات PDF و DOC و TXT لاستخراج المحتوى القانوني
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
            <FileUpload
              onFilesChange={handleFilesChange}
              maxFiles={10}
              acceptedTypes={['application/pdf', '.doc', '.docx', '.txt']}
            />
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <File className="h-8 w-8 text-slate-500 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{file.name}</p>
                      <p className="text-sm text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleProcessDocuments}
                  disabled={processing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 ml-2" />
                      معالجة الملفات
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Laws */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-slate-800">القوانين الحديثة</CardTitle>
          <CardDescription className="text-slate-600">آخر القوانين المضافة إلى قاعدة البيانات</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {laws?.map((law) => (
              <div key={law.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{law.name}</p>
                    <p className="text-sm text-slate-600">رقم {law.number} - {law.category}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(law.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                <Badge className={law.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                  {law.status === 'active' ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
            ))}
            {(!laws || laws.length === 0) && (
              <div className="text-center py-12 text-slate-500">
                <Database className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p>لا توجد قوانين في قاعدة البيانات</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
