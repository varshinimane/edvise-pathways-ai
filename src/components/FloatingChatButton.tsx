import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  X,
  Minimize2,
  Sparkles,
  BookOpen,
  Award,
  MapPin
} from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI career advisor from EdVise. I can help you with career guidance, scholarship information, and college recommendations. What would you like to know?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { callGeminiAPI, isLoading } = useGemini();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      question: 'What scholarships am I eligible for?',
      icon: Award
    },
    {
      question: 'Best colleges for computer science?',
      icon: MapPin
    },
    {
      question: 'Career options after 12th science?',
      icon: BookOpen
    },
    {
      question: 'How to prepare for engineering entrance exams?',
      icon: Sparkles
    }
  ];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');

    // Determine context based on message content
    let context: 'career_guidance' | 'quiz_analysis' | 'scholarship_guidance' = 'career_guidance';
    if (currentMessage.toLowerCase().includes('scholarship')) {
      context = 'scholarship_guidance';
    }

    const response = await callGeminiAPI(currentMessage, context);
    
    if (response) {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } else {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting to my AI services right now. Please try again later or contact support if the issue persists.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render if user is not authenticated
  if (!user) return null;

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-accent shadow-large hover:shadow-xl transition-all duration-300 z-50 border-2 border-background/20"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          <Card className="card-gradient border-border h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">AI Career Advisor</h3>
                  {!isMinimized && (
                    <p className="text-xs text-muted-foreground">Ask me anything about careers!</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className="h-6 w-6 p-0 hover:bg-secondary/60"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0 hover:bg-secondary/60"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[85%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            message.sender === 'bot' 
                              ? 'bg-primary/10' 
                              : 'bg-accent/10'
                          }`}>
                            {message.sender === 'bot' ? (
                              <Bot className="h-3 w-3 text-primary" />
                            ) : (
                              <User className="h-3 w-3 text-accent" />
                            )}
                          </div>
                          
                          <div className={`rounded-lg px-3 py-2 text-xs ${
                            message.sender === 'bot'
                              ? 'bg-secondary/50 text-secondary-foreground'
                              : 'bg-primary text-primary-foreground'
                          }`}>
                            <p className="leading-relaxed">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-3 w-3 text-primary" />
                          </div>
                          <div className="bg-secondary/50 rounded-lg px-3 py-2">
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="px-4 py-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                    <div className="grid grid-cols-1 gap-1">
                      {quickQuestions.slice(0, 2).map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickQuestion(item.question)}
                          className="justify-start text-xs h-8 px-2"
                        >
                          <item.icon className="h-3 w-3 mr-2" />
                          <span className="truncate">{item.question}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-3 border-t border-border">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about careers, colleges, or scholarships..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 text-xs h-8"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      variant="accent"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;