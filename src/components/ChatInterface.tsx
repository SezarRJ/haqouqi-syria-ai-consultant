
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Scale, FileText } from "lucide-react";

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  citations?: string[];
  responseType?: 'legal-advice' | 'law-reference' | 'general';
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'أهلاً وسهلاً بك في المستشار القانوني السوري. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      suggestions: [
        'أريد استشارة حول قانون العمل',
        'ما هي حقوقي في قانون الأحوال الشخصية؟',
        'استفسار حول القانون التجاري'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const simulateAIResponse = (userMessage: string): Message => {
    const responses = [
      {
        content: 'بناءً على استفسارك حول قانون العمل السوري، يمكنني تقديم المعلومات التالية...',
        responseType: 'legal-advice' as const,
        citations: ['قانون العمل السوري رقم 17 لعام 2010، المادة 45', 'قرار وزاري رقم 8741 لعام 2018']
      },
      {
        content: 'وفقاً للقانون المدني السوري، المادة 163...',
        responseType: 'law-reference' as const,
        citations: ['القانون المدني السوري، المادة 163', 'تفسير محكمة النقض رقم 1245/2019']
      }
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now(),
      type: 'bot',
      content: randomResponse.content,
      timestamp: new Date(),
      citations: randomResponse.citations,
      responseType: randomResponse.responseType,
      suggestions: [
        'هل يمكن توضيح هذه النقطة أكثر؟',
        'ما هي الإجراءات المطلوبة؟',
        'أريد معرفة المزيد حول هذا الموضوع'
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      suggestions: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('ar-SY', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-legal-gradient text-white">
        <Scale className="h-6 w-6" />
        <div>
          <h3 className="font-semibold">المستشار القانوني</h3>
          <p className="text-sm opacity-90">متاح للاستشارة</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 bg-legal-blue rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-legal-blue text-white ml-auto'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {/* Citations for bot messages */}
                  {message.type === 'bot' && message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <FileText className="h-3 w-3" />
                        المراجع القانونية:
                      </div>
                      {message.citations.map((citation, index) => (
                        <p key={index} className="text-xs text-muted-foreground">
                          • {citation}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {/* Response type indicator */}
                  {message.type === 'bot' && message.responseType && (
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        message.responseType === 'legal-advice' ? 'bg-green-100 text-green-800' :
                        message.responseType === 'law-reference' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {message.responseType === 'legal-advice' ? 'استشارة قانونية' :
                         message.responseType === 'law-reference' ? 'مرجع قانوني' : 'عام'}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {formatTimestamp(message.timestamp)}
                </p>
                
                {/* Suggestions for bot messages */}
                {message.type === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-1 px-2"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-legal-gold rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-legal-blue rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted text-foreground p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب استفسارك القانوني هنا..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-legal-blue hover:bg-legal-blue-dark"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          تنبيه: هذه استشارة تقنية وليست استشارة قانونية رسمية
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
