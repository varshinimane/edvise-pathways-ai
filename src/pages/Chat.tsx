import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
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

const Chat = () => {
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

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('scholarship')) {
      return 'Based on your profile, you may be eligible for several scholarships. I recommend checking the National Merit Scholarship (₹50,000/year) and the Girls Education Scholarship if applicable. Would you like me to show you a personalized list?';
    }
    
    if (lowerMessage.includes('college') || lowerMessage.includes('computer science')) {
      return 'For computer science, I recommend looking into IITs, NITs, and top private colleges like BITS Pilani. Based on your quiz results showing 92% match with CS, you should also consider specialized AI/ML programs. Would you like me to show colleges near your location?';
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('12th')) {
      return 'After 12th science, you have excellent options in Engineering, Medical, Research, and emerging fields like Data Science and AI. Your quiz results suggest strong analytical skills - have you considered taking our detailed aptitude test for more specific recommendations?';
    }
    
    return 'That\'s a great question! I can provide detailed guidance on career paths, college selections, and scholarship opportunities. Could you be more specific about what aspect you\'d like to explore? For example, you could ask about specific courses, entrance exams, or career prospects.';
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Career Advisor</h1>
              <p className="text-muted-foreground">Get instant answers to your career questions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="card-gradient border-border h-[600px] flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'bot' 
                            ? 'bg-primary/10' 
                            : 'bg-accent/10'
                        }`}>
                          {message.sender === 'bot' ? (
                            <Bot className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-accent" />
                          )}
                        </div>
                        
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'bot'
                            ? 'bg-secondary/50 text-secondary-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Ask about careers, colleges, or scholarships..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    variant="accent"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Questions Sidebar */}
          <div className="space-y-6">
            <Card className="card-gradient border-border">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Questions</h3>
                <div className="space-y-3">
                  {quickQuestions.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left p-3 h-auto hover:bg-secondary/30"
                      onClick={() => handleQuickQuestion(item.question)}
                    >
                      <item.icon className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                      <span className="text-sm">{item.question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="card-gradient border-border">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Need Backend Features?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To enable AI-powered recommendations, user authentication, and data storage, connect your project to Supabase.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Connect Supabase
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;