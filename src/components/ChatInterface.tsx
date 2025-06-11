
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, FileText, Lightbulb, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'مرحباً بك في المستشار القانوني السوري. أنا هنا لمساعدتك في استشاراتك القانونية. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      suggestions: [
        'استشارة حول قانون العمل',
        'البحث في القانون المدني',
        'تفسير مادة قانونية',
        'استشارة في قانون الأحوال الشخصية'
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    const responses = [
      {
        content: `بناءً على استفسارك "${userMessage}"، يمكنني تقديم التوجيه التالي:\n\nوفقاً للقانون السوري، هناك عدة جوانب قانونية يجب مراعاتها:\n\n1. المادة 123 من القانون المدني تنص على...\n2. يجب مراجعة الأحكام الواردة في...\n3. من المهم ملاحظة أن...\n\nننصح بمراجعة محامٍ مختص للحصول على مشورة قانونية مفصلة.`,
        citations: ['القانون المدني - المادة 123', 'قانون أصول المحاكمات - المادة 45'],
        type: 'legal_advice'
      },
      {
        content: `شكراً لك على استفسارك. بحسب التشريع السوري النافذ:\n\nالمبادئ القانونية ذات الصلة:\n• المبدأ الأول: حماية الحقوق المكتسبة\n• المبدأ الثاني: سيادة القانون\n• المبدأ الثالث: العدالة والإنصاف\n\nالإجراءات المطلوبة:\n1. تقديم الطلب وفق النموذج المحدد\n2. إرفاق الوثائق الثبوتية\n3. دفع الرسوم المقررة\n\nملاحظة: هذه المعلومات للإرشاد العام فقط.`,
        citations: ['قانون الإجراءات المدنية', 'النظام القضائي السوري'],
        type: 'procedure_guide'
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        citations: aiResponse.citations,
        responseType: aiResponse.type,
        timestamp: new Date(),
        suggestions: [
          'هل يمكن توضيح أكثر؟',
          'ما هي الخطوات التالية؟',
          'استشارة جديدة',
          'البحث في قوانين أخرى'
        ]
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      toast({
        title: "تم إرسال الرد",
        description: "تم تحليل استفسارك وتقديم الرد القانوني"
      });
    }, 2000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bot className="h-5 w-5" />
          المستشار القانوني المتخصص
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  
                  {message.citations && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 mb-2">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs font-medium">المراجع القانونية:</span>
                      </div>
                      <div className="space-y-1">
                        {message.citations.map((citation, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {citation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.responseType && (
                    <div className="mt-2 flex items-center gap-1">
                      {message.responseType === 'legal_advice' && (
                        <>
                          <Lightbulb className="h-3 w-3 text-yellow-600" />
                          <span className="text-xs text-yellow-600">استشارة قانونية</span>
                        </>
                      )}
                      {message.responseType === 'procedure_guide' && (
                        <>
                          <FileText className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">دليل إجراءات</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString('ar-SY')}
                </div>
              </div>
              
              {message.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Legal Disclaimer */}
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200">
          <div className="flex items-start gap-2 text-xs text-amber-800">
            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              تنويه: المعلومات المقدمة هي للاستشارة العامة فقط وليست بديلاً عن المشورة القانونية المهنية المتخصصة.
            </span>
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب استفسارك القانوني هنا... (اضغط Enter للإرسال)"
              className="flex-1 min-h-[60px] resize-none"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
