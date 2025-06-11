
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LegalConsultation = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    consultationId?: string;
  }>>([]);

  const consultationMutation = useMutation({
    mutationFn: async (queryText: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Simulate AI processing (in real implementation, this would call an AI service)
      const aiResponse = `بناءً على استفسارك: "${queryText}"، يمكنني تقديم التوجيه القانوني التالي:

هذا استفسار قانوني يتطلب مراجعة القوانين السورية ذات الصلة. يُنصح بمراجعة:
- القانون المدني السوري
- قانون أصول المحاكمات المدنية
- القوانين التنظيمية ذات الصلة

للحصول على استشارة قانونية دقيقة ومفصلة، يُنصح بمراجعة محامي مختص.

تنبيه: هذه معلومات قانونية عامة وليست استشارة قانونية مهنية.`;

      // Save consultation to database
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          user_id: user?.id,
          consultation_type: 'chat',
          query_text: queryText,
          ai_response: aiResponse,
          confidence_score: 0.85
        }])
        .select()
        .single();

      if (error) throw error;
      return { response: aiResponse, consultationId: data.id };
    },
    onSuccess: (data) => {
      setConversation(prev => [
        ...prev,
        { type: 'bot', content: data.response, timestamp: new Date(), consultationId: data.consultationId }
      ]);
      setQuery('');
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
    if (!query.trim()) return;

    setConversation(prev => [
      ...prev,
      { type: 'user', content: query, timestamp: new Date() }
    ]);

    consultationMutation.mutate(query);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          استشارة قانونية فورية
        </CardTitle>
        <CardDescription>
          احصل على مشورة قانونية دقيقة بناءً على القوانين السورية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conversation Area */}
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>ابدأ محادثتك واطرح استفسارك القانوني</p>
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
                  <span className="text-gray-600">جارٍ تحليل استفسارك...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب استفسارك القانوني هنا..."
            className="flex-1 min-h-[100px] resize-none"
            disabled={consultationMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={!query.trim() || consultationMutation.isPending}
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
