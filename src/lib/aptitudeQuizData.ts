// Comprehensive Aptitude & Interest Assessment Data
export interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'academic_interest' | 'personality' | 'aptitude' | 'learning_style' | 'career_preference';
  weight: number;
  language: 'en' | 'hi';
}

export interface StreamRecommendation {
  stream: 'Arts' | 'Science' | 'Commerce' | 'Vocational';
  match_percentage: number;
  reasoning: string;
  subjects: string[];
  career_paths: string[];
  government_exams: string[];
  private_jobs: string[];
  higher_education: string[];
}

// Enhanced Quiz Questions for Comprehensive Assessment
export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  // Academic Interest Questions
  {
    id: 'academic_1',
    question: 'Which subjects do you find most engaging?',
    options: [
      'Mathematics and Physics',
      'Literature and Languages',
      'History and Social Studies',
      'Biology and Chemistry',
      'Economics and Business Studies',
      'Computer Science and Technology'
    ],
    category: 'academic_interest',
    weight: 3,
    language: 'en'
  },
  {
    id: 'academic_2',
    question: 'What type of problems do you enjoy solving?',
    options: [
      'Mathematical equations and formulas',
      'Creative writing and storytelling',
      'Social issues and human behavior',
      'Scientific experiments and research',
      'Business strategies and planning',
      'Technical problems and coding'
    ],
    category: 'academic_interest',
    weight: 2,
    language: 'en'
  },

  // Personality Assessment Questions
  {
    id: 'personality_1',
    question: 'How do you prefer to work?',
    options: [
      'Independently with clear instructions',
      'In creative teams with freedom',
      'Helping others and community service',
      'In research labs with detailed analysis',
      'Leading teams and making decisions',
      'With technology and innovation'
    ],
    category: 'personality',
    weight: 2,
    language: 'en'
  },
  {
    id: 'personality_2',
    question: 'What motivates you most?',
    options: [
      'Solving complex problems',
      'Expressing creativity and ideas',
      'Making a positive social impact',
      'Discovering new knowledge',
      'Achieving financial success',
      'Building innovative solutions'
    ],
    category: 'personality',
    weight: 3,
    language: 'en'
  },

  // Aptitude Questions
  {
    id: 'aptitude_1',
    question: 'Which activities come naturally to you?',
    options: [
      'Logical reasoning and calculations',
      'Artistic expression and design',
      'Communication and public speaking',
      'Scientific observation and analysis',
      'Strategic thinking and planning',
      'Technical problem-solving'
    ],
    category: 'aptitude',
    weight: 3,
    language: 'en'
  },
  {
    id: 'aptitude_2',
    question: 'What type of learning environment suits you best?',
    options: [
      'Structured classrooms with clear rules',
      'Creative spaces with artistic freedom',
      'Interactive discussions and debates',
      'Laboratories with hands-on experiments',
      'Business simulations and case studies',
      'Technology labs with modern equipment'
    ],
    category: 'aptitude',
    weight: 2,
    language: 'en'
  },

  // Learning Style Questions
  {
    id: 'learning_1',
    question: 'How do you learn best?',
    options: [
      'Through step-by-step instructions',
      'Through creative projects and art',
      'Through group discussions and debates',
      'Through experiments and observations',
      'Through real-world applications',
      'Through technology and simulations'
    ],
    category: 'learning_style',
    weight: 2,
    language: 'en'
  },

  // Career Preference Questions
  {
    id: 'career_1',
    question: 'What type of work environment appeals to you?',
    options: [
      'Research institutions and laboratories',
      'Creative studios and media companies',
      'Educational institutions and NGOs',
      'Hospitals and healthcare facilities',
      'Corporate offices and business centers',
      'Tech companies and startups'
    ],
    category: 'career_preference',
    weight: 3,
    language: 'en'
  },
  {
    id: 'career_2',
    question: 'What kind of impact do you want to make?',
    options: [
      'Scientific breakthroughs and discoveries',
      'Cultural and artistic contributions',
      'Social change and community development',
      'Healthcare and medical advancements',
      'Economic growth and business success',
      'Technological innovation and digital transformation'
    ],
    category: 'career_preference',
    weight: 3,
    language: 'en'
  }
];

// Hindi Questions
export const APTITUDE_QUESTIONS_HI: AptitudeQuestion[] = [
  {
    id: 'academic_1',
    question: 'आपको कौन से विषय सबसे अधिक रुचिकर लगते हैं?',
    options: [
      'गणित और भौतिकी',
      'साहित्य और भाषाएं',
      'इतिहास और सामाजिक अध्ययन',
      'जीव विज्ञान और रसायन विज्ञान',
      'अर्थशास्त्र और व्यापार अध्ययन',
      'कंप्यूटर विज्ञान और प्रौद्योगिकी'
    ],
    category: 'academic_interest',
    weight: 3,
    language: 'hi'
  },
  {
    id: 'academic_2',
    question: 'आप किस प्रकार की समस्याओं को हल करना पसंद करते हैं?',
    options: [
      'गणितीय समीकरण और सूत्र',
      'रचनात्मक लेखन और कहानी कहना',
      'सामाजिक मुद्दे और मानव व्यवहार',
      'वैज्ञानिक प्रयोग और शोध',
      'व्यापार रणनीतियां और योजना',
      'तकनीकी समस्याएं और कोडिंग'
    ],
    category: 'academic_interest',
    weight: 2,
    language: 'hi'
  },
  {
    id: 'personality_1',
    question: 'आप कैसे काम करना पसंद करते हैं?',
    options: [
      'स्पष्ट निर्देशों के साथ स्वतंत्र रूप से',
      'स्वतंत्रता के साथ रचनात्मक टीमों में',
      'दूसरों की मदद करना और सामुदायिक सेवा',
      'विस्तृत विश्लेषण के साथ अनुसंधान प्रयोगशालाओं में',
      'टीमों का नेतृत्व करना और निर्णय लेना',
      'प्रौद्योगिकी और नवाचार के साथ'
    ],
    category: 'personality',
    weight: 2,
    language: 'hi'
  },
  {
    id: 'personality_2',
    question: 'आपको क्या सबसे अधिक प्रेरित करता है?',
    options: [
      'जटिल समस्याओं को हल करना',
      'रचनात्मकता और विचारों को व्यक्त करना',
      'सकारात्मक सामाजिक प्रभाव डालना',
      'नया ज्ञान खोजना',
      'आर्थिक सफलता प्राप्त करना',
      'नवाचार समाधान बनाना'
    ],
    category: 'personality',
    weight: 3,
    language: 'hi'
  },
  {
    id: 'aptitude_1',
    question: 'कौन सी गतिविधियां आपके लिए स्वाभाविक हैं?',
    options: [
      'तार्किक तर्क और गणना',
      'कलात्मक अभिव्यक्ति और डिजाइन',
      'संचार और सार्वजनिक बोलना',
      'वैज्ञानिक अवलोकन और विश्लेषण',
      'रणनीतिक सोच और योजना',
      'तकनीकी समस्या समाधान'
    ],
    category: 'aptitude',
    weight: 3,
    language: 'hi'
  },
  {
    id: 'aptitude_2',
    question: 'कौन सा सीखने का वातावरण आपके लिए सबसे उपयुक्त है?',
    options: [
      'स्पष्ट नियमों के साथ संरचित कक्षाएं',
      'कलात्मक स्वतंत्रता के साथ रचनात्मक स्थान',
      'अंतःक्रियात्मक चर्चाएं और बहस',
      'हाथों से प्रयोगों के साथ प्रयोगशालाएं',
      'व्यापार सिमुलेशन और केस स्टडी',
      'आधुनिक उपकरणों के साथ प्रौद्योगिकी प्रयोगशालाएं'
    ],
    category: 'aptitude',
    weight: 2,
    language: 'hi'
  },
  {
    id: 'learning_1',
    question: 'आप सबसे अच्छा कैसे सीखते हैं?',
    options: [
      'चरण-दर-चरण निर्देशों के माध्यम से',
      'रचनात्मक परियोजनाओं और कला के माध्यम से',
      'समूह चर्चाओं और बहस के माध्यम से',
      'प्रयोगों और अवलोकनों के माध्यम से',
      'वास्तविक दुनिया के अनुप्रयोगों के माध्यम से',
      'प्रौद्योगिकी और सिमुलेशन के माध्यम से'
    ],
    category: 'learning_style',
    weight: 2,
    language: 'hi'
  },
  {
    id: 'career_1',
    question: 'कौन सा कार्य वातावरण आपको आकर्षित करता है?',
    options: [
      'अनुसंधान संस्थान और प्रयोगशालाएं',
      'रचनात्मक स्टूडियो और मीडिया कंपनियां',
      'शैक्षिक संस्थान और एनजीओ',
      'अस्पताल और स्वास्थ्य सुविधाएं',
      'कॉर्पोरेट कार्यालय और व्यापार केंद्र',
      'तकनीकी कंपनियां और स्टार्टअप'
    ],
    category: 'career_preference',
    weight: 3,
    language: 'hi'
  },
  {
    id: 'career_2',
    question: 'आप किस प्रकार का प्रभाव डालना चाहते हैं?',
    options: [
      'वैज्ञानिक सफलताएं और खोजें',
      'सांस्कृतिक और कलात्मक योगदान',
      'सामाजिक परिवर्तन और सामुदायिक विकास',
      'स्वास्थ्य सेवा और चिकित्सा प्रगति',
      'आर्थिक विकास और व्यापार सफलता',
      'तकनीकी नवाचार और डिजिटल परिवर्तन'
    ],
    category: 'career_preference',
    weight: 3,
    language: 'hi'
  }
];

// Stream Analysis and Recommendations
export const STREAM_ANALYSIS = {
  Science: {
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
    career_paths: ['Doctor', 'Engineer', 'Scientist', 'Researcher', 'Data Scientist'],
    government_exams: ['NEET', 'JEE', 'GATE', 'CSIR NET', 'DRDO'],
    private_jobs: ['Software Engineer', 'Research Scientist', 'Medical Professional', 'Data Analyst'],
    higher_education: ['MBBS', 'B.Tech', 'M.Sc', 'Ph.D', 'M.Tech']
  },
  Arts: {
    subjects: ['History', 'Political Science', 'Literature', 'Psychology', 'Sociology'],
    career_paths: ['Teacher', 'Writer', 'Journalist', 'Social Worker', 'Counselor'],
    government_exams: ['UPSC', 'State PSC', 'SSC', 'Banking', 'Railway'],
    private_jobs: ['Content Writer', 'Social Media Manager', 'HR Professional', 'Marketing Executive'],
    higher_education: ['B.A', 'M.A', 'M.Phil', 'Ph.D', 'B.Ed']
  },
  Commerce: {
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Statistics'],
    career_paths: ['CA', 'MBA', 'Banker', 'Financial Analyst', 'Entrepreneur'],
    government_exams: ['CA', 'CS', 'CMA', 'Banking', 'SSC'],
    private_jobs: ['Accountant', 'Financial Advisor', 'Business Analyst', 'Investment Banker'],
    higher_education: ['B.Com', 'M.Com', 'MBA', 'CA', 'CFA']
  },
  Vocational: {
    subjects: ['Skill-based Training', 'Technical Skills', 'Trade Skills', 'Applied Sciences'],
    career_paths: ['Technician', 'Skilled Worker', 'Craftsman', 'Service Professional'],
    government_exams: ['ITI', 'Polytechnic', 'Skill Development', 'Trade Tests'],
    private_jobs: ['Electrician', 'Mechanic', 'Plumber', 'Beautician', 'Chef'],
    higher_education: ['ITI', 'Diploma', 'Certificate Courses', 'Skill Development Programs']
  }
};
