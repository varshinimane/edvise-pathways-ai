// src/lib/multilingualQuizData.ts - Preloaded multilingual quiz questions
import { offlineStorage, QuizQuestion } from './offlineStorage';

const QUIZ_QUESTIONS_EN: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What subjects do you enjoy studying the most?',
    options: ['Science and Mathematics', 'Languages and Literature', 'Social Sciences', 'Arts and Design', 'Business and Economics'],
    category: 'academic_interests',
    language: 'en'
  },
  {
    id: 'q2',
    question: 'What type of work environment do you prefer?',
    options: ['Research laboratory', 'Office setting', 'Outdoor/Field work', 'Creative studio', 'Classroom/Teaching'],
    category: 'work_environment',
    language: 'en'
  },
  {
    id: 'q3',
    question: 'How do you like to solve problems?',
    options: ['Through data analysis', 'By discussing with others', 'Using creative approaches', 'Following established procedures', 'Through experimentation'],
    category: 'problem_solving',
    language: 'en'
  },
  {
    id: 'q4',
    question: 'What motivates you most in your work?',
    options: ['Making discoveries', 'Helping others', 'Creating something new', 'Leading teams', 'Teaching and mentoring'],
    category: 'motivation',
    language: 'en'
  },
  {
    id: 'q5',
    question: 'How do you prefer to learn new things?',
    options: ['Through hands-on practice', 'By reading and research', 'Through group discussions', 'By watching demonstrations', 'Through trial and error'],
    category: 'learning_style',
    language: 'en'
  },
  {
    id: 'q6',
    question: 'What type of impact do you want to make?',
    options: ['Scientific breakthroughs', 'Social change', 'Economic growth', 'Cultural enrichment', 'Educational advancement'],
    category: 'impact_goals',
    language: 'en'
  },
  {
    id: 'q7',
    question: 'How do you handle challenges?',
    options: ['Analyze systematically', 'Seek help from others', 'Try multiple approaches', 'Follow proven methods', 'Learn from mistakes'],
    category: 'challenge_handling',
    language: 'en'
  },
  {
    id: 'q8',
    question: 'What kind of team role do you prefer?',
    options: ['Technical expert', 'Team leader', 'Creative contributor', 'Supporting role', 'Independent worker'],
    category: 'team_role',
    language: 'en'
  },
  {
    id: 'q9',
    question: 'How important is work-life balance to you?',
    options: ['Very important', 'Somewhat important', 'Not very important', 'Depends on the job', 'I prefer flexible schedules'],
    category: 'work_life_balance',
    language: 'en'
  },
  {
    id: 'q10',
    question: 'What type of career growth interests you?',
    options: ['Technical specialization', 'Management roles', 'Entrepreneurship', 'Research and development', 'Consulting'],
    category: 'career_growth',
    language: 'en'
  }
];

const QUIZ_QUESTIONS_HI: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'आप किन विषयों का अध्ययन करना सबसे अधिक पसंद करते हैं?',
    options: ['विज्ञान और गणित', 'भाषा और साहित्य', 'सामाजिक विज्ञान', 'कला और डिजाइन', 'व्यापार और अर्थशास्त्र'],
    category: 'academic_interests',
    language: 'hi'
  },
  {
    id: 'q2',
    question: 'आप किस प्रकार के कार्य वातावरण को पसंद करते हैं?',
    options: ['अनुसंधान प्रयोगशाला', 'कार्यालय सेटिंग', 'बाहरी/क्षेत्र कार्य', 'रचनात्मक स्टूडियो', 'कक्षा/शिक्षण'],
    category: 'work_environment',
    language: 'hi'
  },
  {
    id: 'q3',
    question: 'आप समस्याओं को कैसे हल करना पसंद करते हैं?',
    options: ['डेटा विश्लेषण के माध्यम से', 'दूसरों के साथ चर्चा करके', 'रचनात्मक दृष्टिकोण का उपयोग करके', 'स्थापित प्रक्रियाओं का पालन करके', 'प्रयोग के माध्यम से'],
    category: 'problem_solving',
    language: 'hi'
  },
  {
    id: 'q4',
    question: 'आपके काम में आपको क्या सबसे अधिक प्रेरित करता है?',
    options: ['खोज करना', 'दूसरों की मदद करना', 'कुछ नया बनाना', 'टीमों का नेतृत्व करना', 'शिक्षण और मार्गदर्शन'],
    category: 'motivation',
    language: 'hi'
  },
  {
    id: 'q5',
    question: 'आप नई चीजें कैसे सीखना पसंद करते हैं?',
    options: ['हाथों से अभ्यास के माध्यम से', 'पढ़ने और शोध के माध्यम से', 'समूह चर्चा के माध्यम से', 'प्रदर्शन देखकर', 'प्रयास और त्रुटि के माध्यम से'],
    category: 'learning_style',
    language: 'hi'
  },
  {
    id: 'q6',
    question: 'आप किस प्रकार का प्रभाव डालना चाहते हैं?',
    options: ['वैज्ञानिक सफलताएं', 'सामाजिक परिवर्तन', 'आर्थिक विकास', 'सांस्कृतिक समृद्धि', 'शैक्षिक प्रगति'],
    category: 'impact_goals',
    language: 'hi'
  },
  {
    id: 'q7',
    question: 'आप चुनौतियों का सामना कैसे करते हैं?',
    options: ['व्यवस्थित रूप से विश्लेषण करके', 'दूसरों से मदद मांगकर', 'कई दृष्टिकोण आजमाकर', 'सिद्ध तरीकों का पालन करके', 'गलतियों से सीखकर'],
    category: 'challenge_handling',
    language: 'hi'
  },
  {
    id: 'q8',
    question: 'आप किस प्रकार की टीम भूमिका पसंद करते हैं?',
    options: ['तकनीकी विशेषज्ञ', 'टीम लीडर', 'रचनात्मक योगदानकर्ता', 'सहायक भूमिका', 'स्वतंत्र कार्यकर्ता'],
    category: 'team_role',
    language: 'hi'
  },
  {
    id: 'q9',
    question: 'आपके लिए काम-जीवन संतुलन कितना महत्वपूर्ण है?',
    options: ['बहुत महत्वपूर्ण', 'कुछ हद तक महत्वपूर्ण', 'बहुत महत्वपूर्ण नहीं', 'नौकरी पर निर्भर करता है', 'मैं लचीले समय को पसंद करता हूं'],
    category: 'work_life_balance',
    language: 'hi'
  },
  {
    id: 'q10',
    question: 'किस प्रकार का करियर विकास आपको रुचिकर लगता है?',
    options: ['तकनीकी विशेषज्ञता', 'प्रबंधन भूमिकाएं', 'उद्यमिता', 'अनुसंधान और विकास', 'परामर्श'],
    category: 'career_growth',
    language: 'hi'
  }
];

export class MultilingualQuizLoader {
  async loadQuizQuestionsToOfflineStorage(): Promise<void> {
    try {
      await offlineStorage.init();
      await offlineStorage.saveQuizQuestions([...QUIZ_QUESTIONS_EN, ...QUIZ_QUESTIONS_HI]);
      console.log('Multilingual quiz questions loaded to offline storage');
    } catch (error) {
      console.error('Error loading quiz questions:', error);
    }
  }

  async getQuizQuestions(language: 'en' | 'hi' = 'en'): Promise<QuizQuestion[]> {
    return await offlineStorage.getQuizQuestions(language);
  }

  async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    const enQuestions = await this.getQuizQuestions('en');
    const hiQuestions = await this.getQuizQuestions('hi');
    return [...enQuestions, ...hiQuestions];
  }

  async getQuestionsByCategory(category: string, language: 'en' | 'hi' = 'en'): Promise<QuizQuestion[]> {
    const questions = await this.getQuizQuestions(language);
    return questions.filter(q => q.category === category);
  }
}

export const multilingualQuizLoader = new MultilingualQuizLoader();
