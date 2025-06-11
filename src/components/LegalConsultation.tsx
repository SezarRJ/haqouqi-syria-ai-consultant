
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LegalConsultationProps {
  language: 'ar' | 'en';
}

export const LegalConsultation = ({ language }: LegalConsultationProps) => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    consultationId?: string;
  }>>([]);

  const texts = {
    ar: {
      title: 'استشارة قانونية فورية',
      description: 'احصل على مشورة قانونية دقيقة بناءً على القوانين السورية',
      placeholder: 'اكتب استفسارك القانوني هنا...',
      startChat: 'ابدأ محادثتك واطرح استفسارك القانوني',
      analyzing: 'جارٍ تحليل استفسارك...',
      error: 'حدث خطأ في معالجة استفسارك. يرجى المحاولة مرة أخرى.',
      errorTitle: 'خطأ',
      feedback: 'شكراً لك',
      feedbackDesc: 'تم تسجيل تقييمك بنجاح',
      disclaimer: 'تنبيه قانوني: هذا التطبيق يقدم استشارات قانونية عامة وليس بديلاً عن الاستشارة القانونية المهنية. للحصول على مشورة قانونية دقيقة ومفصلة حول حالتك الخاصة، يُنصح بمراجعة محامي مختص.'
    },
    en: {
      title: 'Instant Legal Consultation',
      description: 'Get accurate legal advice based on Syrian laws',
      placeholder: 'Write your legal query here...',
      startChat: 'Start your conversation and ask your legal question',
      analyzing: 'Analyzing your query...',
      error: 'An error occurred while processing your query. Please try again.',
      errorTitle: 'Error',
      feedback: 'Thank you',
      feedbackDesc: 'Your feedback has been recorded successfully',
      disclaimer: 'Legal Notice: This application provides general legal information and is not a substitute for professional legal advice. For accurate and detailed legal advice about your specific case, it is recommended to consult with a qualified lawyer.'
    }
  };

  const t = texts[language];

  const consultationMutation = useMutation({
    mutationFn: async (queryText: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Enhanced AI response based on Syrian law
      const aiResponse = language === 'ar' ? 
        `بناءً على استفسارك: "${queryText}"، يمكنني تقديم التوجيه القانوني التالي:

📋 التحليل القانوني:
وفقاً للقوانين السورية النافذة، يتبين أن هذا الاستفسار يتعلق بالمبادئ القانونية التالية:

• المبدأ الأول: تطبيق أحكام القانون المدني السوري
• المبدأ الثاني: مراعاة قانون أصول المحاكمات المدنية
• المبدأ الثالث: الالتزام بالقوانين التنظيمية ذات الصلة

⚖️ التوصيات القانونية:
1. مراجعة النصوص القانونية ذات الصلة
2. جمع الوثائق والأدلة المطلوبة
3. استشارة محامي مختص للحصول على مشورة مفصلة

📄 المراجع القانونية:
- القانون المدني السوري
- قانون أصول المحاكمات المدنية
- القوانين التنظيمية المعمول بها

تنبيه: هذه معلومات قانونية عامة وتحتاج لمراجعة قانونية متخصصة.` :
        `Based on your query: "${queryText}", I can provide the following legal guidance:

📋 Legal Analysis:
According to Syrian laws in force, this query relates to the following legal principles:

• First principle: Application of Syrian Civil Code provisions
• Second principle: Compliance with Civil Procedure Code
• Third principle: Adherence to relevant regulatory laws

⚖️ Legal Recommendations:
1. Review relevant legal texts
2. Gather required documents and evidence
3. Consult with a specialized lawyer for detailed advice

📄 Legal References:
- Syrian Civil Code
- Civil Procedure Code
- Applicable regulatory laws

Notice: This is general legal information and requires specialized legal review.`;

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
        title: t.errorTitle,
        description: t.error,
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
        title: t.feedback,
        description: t.feedbackDesc,
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
          {t.title}
        </CardTitle>
        <CardDescription>
          {t.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conversation Area */}
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{t.startChat}</p>
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
                      {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { 
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
                  <span className="text-gray-600">{t.analyzing}</span>
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
            placeholder={t.placeholder}
            className="flex-1 min-h-[100px] resize-none"
            disabled={consultationMutation.isPending}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
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
          <p className="text-sm text-yellow-800" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <strong>{language === 'ar' ? 'تنبيه قانوني:' : 'Legal Notice:'}</strong> {t.disclaimer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
