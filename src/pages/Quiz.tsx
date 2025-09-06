import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  BookOpen,
  Code,
  Palette,
  Stethoscope,
  Calculator
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  icon: any;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'Interests',
    question: 'Which activities do you find most engaging?',
    options: [
      'Solving complex mathematical problems',
      'Creating art or design projects', 
      'Building or fixing things',
      'Helping and caring for others',
      'Analyzing data and patterns'
    ],
    icon: Brain
  },
  {
    id: 2,
    category: 'Skills',
    question: 'What are your strongest skills?',
    options: [
      'Logical reasoning and problem-solving',
      'Creative thinking and innovation',
      'Communication and leadership', 
      'Technical and analytical skills',
      'Interpersonal and empathy skills'
    ],
    icon: Sparkles
  },
  {
    id: 3,
    category: 'Work Environment',
    question: 'What type of work environment appeals to you?',
    options: [
      'Quiet office with individual focus',
      'Collaborative team environment',
      'Hands-on workshop or lab',
      'Dynamic field work',
      'Research and academic setting'
    ],
    icon: BookOpen
  },
  {
    id: 4,
    category: 'Career Goals',
    question: 'What motivates you most in a career?',
    options: [
      'Making a positive impact on society',
      'Financial stability and growth',
      'Creative expression and innovation',
      'Continuous learning and discovery',
      'Leadership and influence'
    ],
    icon: CheckCircle
  },
  {
    id: 5,
    category: 'Subjects',
    question: 'Which subjects interest you the most?',
    options: [
      'Mathematics and Physics',
      'Biology and Chemistry',
      'Arts and Literature',
      'Computer Science and Technology',
      'Business and Economics'
    ],
    icon: Calculator
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const CurrentIcon = quizQuestions[currentQuestion]?.icon || Brain;

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="card-gradient border-border overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Quiz Completed Successfully! 🎉
              </h1>
              
              <p className="text-muted-foreground mb-8">
                Your responses have been analyzed using our AI system. 
                Generating personalized career recommendations...
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Code className="h-5 w-5 text-primary" />
                    <span className="font-medium">Computer Science Engineering</span>
                  </div>
                  <span className="text-primary font-bold">92% Match</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calculator className="h-5 w-5 text-accent" />
                    <span className="font-medium">Data Science & Analytics</span>
                  </div>
                  <span className="text-accent font-bold">87% Match</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-secondary/20 border border-secondary/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="h-5 w-5 text-secondary-foreground" />
                    <span className="font-medium">Artificial Intelligence</span>
                  </div>
                  <span className="text-secondary-foreground font-bold">84% Match</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="accent"
                      size="lg"
                    >
                      View Detailed Report
                    </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleRestart}
                >
                  Retake Quiz
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Career Assessment Quiz</h1>
              <p className="text-muted-foreground">Discover your ideal career path</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-medium">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{question.category}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="card-gradient border-border overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CurrentIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {question.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground leading-relaxed">
                  {question.question}
                </h2>
              </div>
            </div>

            <RadioGroup 
              value={answers[currentQuestion] || ''} 
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-secondary/20 transition-colors border border-transparent hover:border-border/50">
                  <RadioGroupItem 
                    value={option} 
                    id={`option-${index}`}
                    className="text-primary" 
                  />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 text-foreground font-medium cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-2">
            {quizQuestions.map((_, index) => (
              <div 
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion 
                    ? 'bg-primary' 
                    : index < currentQuestion 
                      ? 'bg-accent' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button 
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            variant="accent"
            className="font-medium flex items-center space-x-2"
          >
            <span>{currentQuestion === quizQuestions.length - 1 ? 'Complete' : 'Next'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;