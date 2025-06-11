
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Clock, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: string;
}

interface LegalChatProps {
  language: 'ar' | 'en';
}

export const LegalChat = ({ language }: LegalChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const texts = {
    ar: {
      title: 'المحادثة القانونية الذكية',
      subtitle: 'اطرح أسئلتك القانونية واحصل على إجابات فورية',
      placeholder: 'اكتب سؤالك القانوني...',
      welcome: 'مرحباً! أنا مساعدك القانوني الذكي. يمكنني مساعدتك في الاستفسارات القانونية المتعلقة بالقوانين السورية.',
      typing: 'يكتب...',
      civilLaw: 'قانون مدني',
      criminalLaw: 'قانون جنائي',
      commercialLaw: 'قانون تجاري',
      personalStatus: 'أحوال شخصية',
      labor: 'قانون عمل',
      examples: [
        'ما هي شروط صحة عقد البيع؟',
        'كيف يتم تقسيم الميراث؟',
        'ما هي حقوق العامل عند الفصل؟',
        'متى يعتبر العقد باطلاً؟'
      ]
    },
    en: {
      title: 'Smart Legal Chat',
      subtitle: 'Ask your legal questions and get instant answers',
      placeholder: 'Type your legal question...',
      welcome: 'Hello! I am your smart legal assistant. I can help you with legal inquiries related to Syrian laws.',
      typing: 'Typing...',
      civilLaw: 'Civil Law',
      criminalLaw: 'Criminal Law',
      commercialLaw: 'Commercial Law',
      personalStatus: 'Personal Status',
      labor: 'Labor Law',
      examples: [
        'What are the conditions for a valid sales contract?',
        'How is inheritance divided?',
        'What are worker rights upon termination?',
        'When is a contract considered void?'
      ]
    }
  };

  const t = texts[language];

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: t.welcome,
        timestamp: new Date(),
        category: 'welcome'
      }]);
    }
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateResponse = async (userMessage: string): Promise<{ content: string; category: string }> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Determine category based on keywords
    let category = 'general';
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('بيع') || lowerMessage.includes('شراء') || lowerMessage.includes('عقد')) {
      category = language === 'ar' ? 'قانون مدني' : 'Civil Law';
    } else if (lowerMessage.includes('عمل') || lowerMessage.includes('موظف') || lowerMessage.includes('راتب')) {
      category = language === 'ar' ? 'قانون عمل' : 'Labor Law';
    } else if (lowerMessage.includes('ميراث') || lowerMessage.includes('زواج') || lowerMessage.includes('طلاق')) {
      category = language === 'ar' ? 'أحوال شخصية' : 'Personal Status';
    } else if (lowerMessage.includes('تجارة') || lowerMessage.includes('شركة') || lowerMessage.includes('تجاري')) {
      category = language === 'ar' ? 'قانون تجاري' : 'Commercial Law';
    }

    // Generate contextual response
    const responses = language === 'ar' ? [
      `بناءً على استفسارك، وفقاً للقانون السوري:

📋 الإجابة القانونية:
هذا السؤال يتعلق بـ${category}، وتنص القوانين ذات الصلة على:

• النقطة الأولى: التطبيق العملي للقانون
• النقطة الثانية: الشروط والأحكام المطلوبة  
• النقطة الثالثة: الإجراءات القانونية اللازمة

⚖️ التوضيح:
يجب مراعاة جميع الشروط القانونية المنصوص عليها في القانون السوري.

📄 للمزيد من التفاصيل، يُنصح بمراجعة محامي مختص.`,

      `حسب القانون السوري النافذ:

🔍 تحليل قانوني:
استفسارك يندرج تحت ${category}، والأحكام القانونية تشير إلى:

• المبدأ القانوني الأول
• الشروط الواجب توفرها
• الآثار القانونية المترتبة

⚠️ تنبيه: هذه إرشادات عامة، للحصول على مشورة دقيقة يُفضل استشارة محامي.`
    ] : [
      `Based on your inquiry, according to Syrian law:

📋 Legal Answer:
This question relates to ${category}, and the relevant laws state:

• First point: Practical application of the law
• Second point: Required conditions and provisions
• Third point: Necessary legal procedures

⚖️ Clarification:
All legal conditions stipulated in Syrian law must be observed.

📄 For more details, it is advised to consult a specialized lawyer.`,

      `According to current Syrian law:

🔍 Legal Analysis:
Your inquiry falls under ${category}, and legal provisions indicate:

• First legal principle
• Conditions that must be met
• Resulting legal effects

⚠️ Notice: These are general guidelines. For accurate advice, it's preferable to consult a lawyer.`
    ];

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      category
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { content, category } = await generateResponse(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        category
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'حدث خطأ في معالجة رسالتك' : 'An error occurred processing your message',
        variant: 'destructive'
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-center gap-2 mb-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-1 rounded-full ${message.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {message.type === 'user' ? <User className="h-3 w-3 text-blue-600" /> : <Bot className="h-3 w-3 text-gray-600" />}
                  </div>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {message.category && message.category !== 'welcome' && (
                    <Badge variant="outline" className="text-xs">
                      {message.category}
                    </Badge>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-gray-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">{t.typing}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t bg-gray-50">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {language === 'ar' ? 'أسئلة شائعة:' : 'Common Questions:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {t.examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs text-left justify-start h-auto p-2"
                  onClick={() => handleQuickQuestion(example)}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              className="flex-1"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
