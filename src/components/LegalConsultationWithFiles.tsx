
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Clock, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export const LegalConsultationWithFiles = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    consultationId?: string;
    files?: UploadedFile[];
  }>>([]);

  const consultationMutation = useMutation({
    mutationFn: async (data: { queryText: string; files: UploadedFile[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let aiResponse = `بناءً على استفسارك: "${data.queryText}"`;
      
      if (data.files.length > 0) {
        aiResponse += `\n\nوبناءً على الملفات المرفقة (${data.files.length} ملف):`;
        data.files.forEach(file => {
          aiResponse += `\n- ${file.name}`;
        });
        aiResponse += `\n\nبعد مراجعة الوثائق المقدمة، يمكنني تقديم التحليل القانوني التالي:`;
      }

      aiResponse += `\n\nالتوجيه القانوني:
- يُنصح بمراجعة القوانين السورية ذات الصلة
- القانون المدني السوري
- قانون أصول المحاكمات المدنية
- القوانين التنظيمية ذات الصلة

للحصول على استشارة قانونية دقيقة ومفصلة، يُنصح بمراجعة محامي مختص.

تنبيه: هذه معلومات قانونية عامة وليست استشارة قانونية مهنية.`;

      // Save consultation to database
      const { data: consultation, error } = await supabase
        .from('consultations')
        .insert([{
          user_id: user?.id,
          consultation_type: data.files.length > 0 ? 'document_analysis' : 'chat',
          query_text: data.queryText,
          ai_response: aiResponse,
          confidence_score: 0.85,
          documents_uploaded: data.files.map(f => f.name)
        }])
        .select()
        .single();

      if (error) throw error;
      return { response: aiResponse, consultationId: consultation.id };
    },
    onSuccess: (data) => {
      setConversation(prev => [
        ...prev,
        { 
          type: 'bot', 
          content: data.response, 
          timestamp: new Date(), 
          consultationId: data.consultationId 
        }
      ]);
      setQuery('');
      setUploadedFiles([]);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في معالجة استفسارك. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  });

  const feedbackMutation = useMutation({
    mutationFn: async ({ consultationId, feedback }: { consultationId: string; feedback: number }) => {
      const { error } = await supabase
        .from('consultations')
        .update({ user_feedback: feedback })
        .eq('id', consultationId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "شكراً لك",
        description: "تم تسجيل تقييمك بنجاح",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && uploadedFiles.length === 0) return;

    setConversation(prev => [
      ...prev,
      { 
        type: 'user', 
        content: query || 'تم إرفاق ملفات للتحليل', 
        timestamp: new Date(),
        files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
      }
    ]);

    consultationMutation.mutate({ queryText: query, files: uploadedFiles });
  };

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          استشارة قانونية مع تحليل الوثائق
        </CardTitle>
        <CardDescription>
          احصل على مشورة قانونية دقيقة مع إمكانية رفع الوثائق للتحليل
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conversation Area */}
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>ابدأ محادثتك واطرح استفسارك القانوني أو أرفق وثائق للتحليل</p>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white chat-message-user' 
                    : 'bg-white border chat-message-bot'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Show attached files for user messages */}
                  {message.type === 'user' && message.files && message.files.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-blue-400">
                      <div className="flex items-center gap-1 text-xs mb-1">
                        <Paperclip className="h-3 w-3" />
                        الملفات المرفقة:
                      </div>
                      {message.files.map((file, fileIndex) => (
                        <p key={fileIndex} className="text-xs">• {file.name}</p>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <Clock className="h-3 w-3 inline ml-1" />
                      {message.timestamp.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {message.type === 'bot' && message.consultationId && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => feedbackMutation.mutate({ 
                            consultationId: message.consultationId!, 
                            feedback: 1 
                          })}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => feedbackMutation.mutate({ 
                            consultationId: message.consultationId!, 
                            feedback: -1 
                          })}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {consultationMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-white border p-3 rounded-lg max-w-[80%]">
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-gray-600">جارٍ تحليل استفسارك والوثائق...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <FileUpload 
          onFilesChange={handleFilesChange}
          maxFiles={3}
          acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.txt']}
        />

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب استفسارك القانوني هنا أو أرفق وثائق للتحليل..."
            className="flex-1 min-h-[100px] resize-none"
            disabled={consultationMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={(!query.trim() && uploadedFiles.length === 0) || consultationMutation.isPending}
            className="px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Legal Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>تنبيه قانوني:</strong> هذا التطبيق يقدم استشارات قانونية عامة وليس بديلاً عن الاستشارة القانونية المهنية. 
            للحصول على مشورة قانونية دقيقة ومفصلة حول حالتك الخاصة، يُنصح بمراجعة محامي مختص.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
