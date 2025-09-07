// src/lib/indianMultilingualQuiz.ts - Comprehensive Indian language support
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: string;
  language: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as';

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  'en': 'English',
  'hi': 'हिंदी',
  'bn': 'বাংলা',
  'te': 'తెలుగు',
  'mr': 'मराठी',
  'ta': 'தமிழ்',
  'gu': 'ગુજરાતી',
  'kn': 'ಕನ್ನಡ',
  'ml': 'മലയാളം',
  'pa': 'ਪੰਜਾਬੀ',
  'or': 'ଓଡ଼ିଆ',
  'as': 'অসমীয়া'
};

// English Questions (Base)
const ENGLISH_QUESTIONS: QuizQuestion[] = [
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

// Hindi Questions
const HINDI_QUESTIONS: QuizQuestion[] = [
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

// Bengali Questions
const BENGALI_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'আপনি কোন বিষয়গুলো অধ্যয়ন করতে সবচেয়ে বেশি পছন্দ করেন?',
    options: ['বিজ্ঞান এবং গণিত', 'ভাষা এবং সাহিত্য', 'সামাজিক বিজ্ঞান', 'শিল্প এবং ডিজাইন', 'ব্যবসা এবং অর্থনীতি'],
    category: 'academic_interests',
    language: 'bn'
  },
  {
    id: 'q2',
    question: 'আপনি কোন ধরনের কাজের পরিবেশ পছন্দ করেন?',
    options: ['গবেষণাগার', 'অফিস সেটিং', 'বাইরের/ক্ষেত্রের কাজ', 'সৃজনশীল স্টুডিও', 'ক্লাসরুম/শিক্ষাদান'],
    category: 'work_environment',
    language: 'bn'
  },
  {
    id: 'q3',
    question: 'আপনি কিভাবে সমস্যা সমাধান করতে পছন্দ করেন?',
    options: ['ডেটা বিশ্লেষণের মাধ্যমে', 'অন্যদের সাথে আলোচনা করে', 'সৃজনশীল পদ্ধতি ব্যবহার করে', 'প্রতিষ্ঠিত পদ্ধতি অনুসরণ করে', 'পরীক্ষার মাধ্যমে'],
    category: 'problem_solving',
    language: 'bn'
  },
  {
    id: 'q4',
    question: 'আপনার কাজে আপনাকে সবচেয়ে বেশি কী অনুপ্রাণিত করে?',
    options: ['আবিষ্কার করা', 'অন্যদের সাহায্য করা', 'কিছু নতুন তৈরি করা', 'দল পরিচালনা করা', 'শিক্ষাদান এবং পরামর্শ দেওয়া'],
    category: 'motivation',
    language: 'bn'
  },
  {
    id: 'q5',
    question: 'আপনি নতুন জিনিস কিভাবে শিখতে পছন্দ করেন?',
    options: ['হাতে-কলমে অনুশীলনের মাধ্যমে', 'পড়া এবং গবেষণার মাধ্যমে', 'দলগত আলোচনার মাধ্যমে', 'প্রদর্শন দেখে', 'চেষ্টা এবং ভুলের মাধ্যমে'],
    category: 'learning_style',
    language: 'bn'
  },
  {
    id: 'q6',
    question: 'আপনি কোন ধরনের প্রভাব ফেলতে চান?',
    options: ['বৈজ্ঞানিক আবিষ্কার', 'সামাজিক পরিবর্তন', 'অর্থনৈতিক বৃদ্ধি', 'সাংস্কৃতিক সমৃদ্ধি', 'শিক্ষাগত অগ্রগতি'],
    category: 'impact_goals',
    language: 'bn'
  },
  {
    id: 'q7',
    question: 'আপনি চ্যালেঞ্জের মুখোমুখি কিভাবে হন?',
    options: ['পদ্ধতিগতভাবে বিশ্লেষণ করে', 'অন্যদের কাছ থেকে সাহায্য চেয়ে', 'বিভিন্ন পদ্ধতি চেষ্টা করে', 'প্রমাণিত পদ্ধতি অনুসরণ করে', 'ভুল থেকে শিখে'],
    category: 'challenge_handling',
    language: 'bn'
  },
  {
    id: 'q8',
    question: 'আপনি কোন ধরনের দলীয় ভূমিকা পছন্দ করেন?',
    options: ['প্রযুক্তিগত বিশেষজ্ঞ', 'দল নেতা', 'সৃজনশীল অবদানকারী', 'সহায়ক ভূমিকা', 'স্বাধীন কর্মী'],
    category: 'team_role',
    language: 'bn'
  },
  {
    id: 'q9',
    question: 'আপনার জন্য কাজ-জীবনের ভারসাম্য কতটা গুরুত্বপূর্ণ?',
    options: ['খুব গুরুত্বপূর্ণ', 'কিছুটা গুরুত্বপূর্ণ', 'খুব গুরুত্বপূর্ণ নয়', 'চাকরির উপর নির্ভর করে', 'আমি নমনীয় সময়সূচী পছন্দ করি'],
    category: 'work_life_balance',
    language: 'bn'
  },
  {
    id: 'q10',
    question: 'কোন ধরনের ক্যারিয়ার বৃদ্ধি আপনাকে আগ্রহী করে?',
    options: ['প্রযুক্তিগত বিশেষীকরণ', 'ব্যবস্থাপনা ভূমিকা', 'উদ্যোগিতা', 'গবেষণা এবং উন্নয়ন', 'পরামর্শ'],
    category: 'career_growth',
    language: 'bn'
  }
];

// Telugu Questions
const TELUGU_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'మీరు ఏ విషయాలను అధ్యయనం చేయడానికి ఎక్కువగా ఇష్టపడతారు?',
    options: ['సైన్స్ మరియు గణితం', 'భాషలు మరియు సాహిత్యం', 'సామాజిక శాస్త్రాలు', 'కళలు మరియు డిజైన్', 'వ్యాపారం మరియు ఆర్థిక శాస్త్రం'],
    category: 'academic_interests',
    language: 'te'
  },
  {
    id: 'q2',
    question: 'మీరు ఏ రకమైన పని వాతావరణాన్ని ఇష్టపడతారు?',
    options: ['రీసెర్చ్ ల్యాబ్', 'ఆఫీస్ సెట్టింగ్', 'బయటి/ఫీల్డ్ పని', 'క్రియేటివ్ స్టూడియో', 'క్లాస్ రూమ్/టీచింగ్'],
    category: 'work_environment',
    language: 'te'
  },
  {
    id: 'q3',
    question: 'మీరు సమస్యలను ఎలా పరిష్కరించడానికి ఇష్టపడతారు?',
    options: ['డేటా విశ్లేషణ ద్వారా', 'ఇతరులతో చర్చించడం ద్వారా', 'క్రియేటివ్ విధానాలను ఉపయోగించడం ద్వారా', 'స్థాపించబడిన విధానాలను అనుసరించడం ద్వారా', 'ప్రయోగం ద్వారా'],
    category: 'problem_solving',
    language: 'te'
  },
  {
    id: 'q4',
    question: 'మీ పనిలో మిమ్మల్ని ఏది ఎక్కువగా ప్రేరేపిస్తుంది?',
    options: ['కనుగొనడం', 'ఇతరులకు సహాయం చేయడం', 'కొత్తది సృష్టించడం', 'టీమ్లను నడిపించడం', 'బోధించడం మరియు మార్గదర్శకత్వం చేయడం'],
    category: 'motivation',
    language: 'te'
  },
  {
    id: 'q5',
    question: 'మీరు కొత్త విషయాలను ఎలా నేర్చుకోవడానికి ఇష్టపడతారు?',
    options: ['చేతితో అభ్యాసం ద్వారా', 'చదవడం మరియు పరిశోధన ద్వారా', 'గ్రూప్ చర్చల ద్వారా', 'డెమో చూడడం ద్వారా', 'ప్రయత్నం మరియు లోపం ద్వారా'],
    category: 'learning_style',
    language: 'te'
  },
  {
    id: 'q6',
    question: 'మీరు ఏ రకమైన ప్రభావాన్ని చూపించాలనుకుంటున్నారు?',
    options: ['విజ్ఞాన సాధనలు', 'సామాజిక మార్పు', 'ఆర్థిక వృద్ధి', 'సాంస్కృతిక సంపద', 'విద్యాపరమైన అభివృద్ధి'],
    category: 'impact_goals',
    language: 'te'
  },
  {
    id: 'q7',
    question: 'మీరు సవాళ్లను ఎలా ఎదుర్కొంటారు?',
    options: ['వ్యవస్థాపకంగా విశ్లేషించడం ద్వారా', 'ఇతరుల నుండి సహాయం అడగడం ద్వారా', 'అనేక విధానాలను ప్రయత్నించడం ద్వారా', 'నిరూపించబడిన పద్ధతులను అనుసరించడం ద్వారా', 'లోపాల నుండి నేర్చుకోవడం ద్వారా'],
    category: 'challenge_handling',
    language: 'te'
  },
  {
    id: 'q8',
    question: 'మీరు ఏ రకమైన టీమ్ రోల్ ఇష్టపడతారు?',
    options: ['సాంకేతిక నిపుణుడు', 'టీమ్ లీడర్', 'క్రియేటివ్ కంట్రిబ్యూటర్', 'సహాయక పాత్ర', 'స్వతంత్ర కార్మికుడు'],
    category: 'team_role',
    language: 'te'
  },
  {
    id: 'q9',
    question: 'మీకు వర్క్-లైఫ్ బ్యాలెన్స్ ఎంత ముఖ్యమైనది?',
    options: ['చాలా ముఖ్యమైనది', 'కొంత ముఖ్యమైనది', 'చాలా ముఖ్యమైనది కాదు', 'ఉద్యోగంపై ఆధారపడి ఉంటుంది', 'నేను ఫ్లెక్సిబుల్ షెడ్యూల్ ఇష్టపడతాను'],
    category: 'work_life_balance',
    language: 'te'
  },
  {
    id: 'q10',
    question: 'ఏ రకమైన కెరీర్ గ్రోత్ మిమ్మల్ని ఆసక్తిగా చేస్తుంది?',
    options: ['సాంకేతిక స్పెషలైజేషన్', 'మేనేజ్మెంట్ రోల్స్', 'ఎంటర్ ప్రెన్యూర్ షిప్', 'రీసెర్చ్ అండ్ డెవలప్మెంట్', 'కన్సల్టింగ్'],
    category: 'career_growth',
    language: 'te'
  }
];

// Tamil Questions
const TAMIL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'நீங்கள் எந்த பாடங்களை படிக்க விரும்புகிறீர்கள்?',
    options: ['அறிவியல் மற்றும் கணிதம்', 'மொழிகள் மற்றும் இலக்கியம்', 'சமூக அறிவியல்', 'கலை மற்றும் வடிவமைப்பு', 'வணிகம் மற்றும் பொருளாதாரம்'],
    category: 'academic_interests',
    language: 'ta'
  },
  {
    id: 'q2',
    question: 'நீங்கள் எந்த வகையான பணி சூழலை விரும்புகிறீர்கள்?',
    options: ['ஆராய்ச்சி ஆய்வகம்', 'அலுவலக அமைப்பு', 'வெளிப்புற/கள வேலை', 'படைப்பாற்றல் ஸ்டூடியோ', 'வகுப்பறை/கற்பித்தல்'],
    category: 'work_environment',
    language: 'ta'
  },
  {
    id: 'q3',
    question: 'நீங்கள் பிரச்சினைகளை எவ்வாறு தீர்க்க விரும்புகிறீர்கள்?',
    options: ['தரவு பகுப்பாய்வு மூலம்', 'மற்றவர்களுடன் விவாதிப்பதன் மூலம்', 'படைப்பாற்றல் அணுகுமுறைகளைப் பயன்படுத்துவதன் மூலம்', 'நிறுவப்பட்ட நடைமுறைகளைப் பின்பற்றுவதன் மூலம்', 'சோதனை மூலம்'],
    category: 'problem_solving',
    language: 'ta'
  },
  {
    id: 'q4',
    question: 'உங்கள் பணியில் உங்களை எது அதிகம் ஊக்குவிக்கிறது?',
    options: ['கண்டுபிடிப்புகள்', 'மற்றவர்களுக்கு உதவுதல்', 'புதியதை உருவாக்குதல்', 'குழுக்களை வழிநடத்துதல்', 'கற்பித்தல் மற்றும் வழிகாட்டுதல்'],
    category: 'motivation',
    language: 'ta'
  },
  {
    id: 'q5',
    question: 'நீங்கள் புதிய விஷயங்களை எவ்வாறு கற்க விரும்புகிறீர்கள்?',
    options: ['கைவேலையாக பயிற்சி மூலம்', 'வாசிப்பு மற்றும் ஆராய்ச்சி மூலம்', 'குழு விவாதங்கள் மூலம்', 'ஆர்ப்பாட்டங்களைப் பார்ப்பதன் மூலம்', 'முயற்சி மற்றும் பிழை மூலம்'],
    category: 'learning_style',
    language: 'ta'
  },
  {
    id: 'q6',
    question: 'நீங்கள் எந்த வகையான தாக்கத்தை ஏற்படுத்த விரும்புகிறீர்கள்?',
    options: ['அறிவியல் முன்னேற்றங்கள்', 'சமூக மாற்றம்', 'பொருளாதார வளர்ச்சி', 'கலாச்சார வளர்ச்சி', 'கல்வி முன்னேற்றம்'],
    category: 'impact_goals',
    language: 'ta'
  },
  {
    id: 'q7',
    question: 'நீங்கள் சவால்களை எவ்வாறு சமாளிக்கிறீர்கள்?',
    options: ['முறையாக பகுப்பாய்வு செய்வதன் மூலம்', 'மற்றவர்களிடமிருந்து உதவி கேட்பதன் மூலம்', 'பல அணுகுமுறைகளை முயற்சிப்பதன் மூலம்', 'நிரூபிக்கப்பட்ட முறைகளைப் பின்பற்றுவதன் மூலம்', 'தவறுகளிலிருந்து கற்றுக்கொள்வதன் மூலம்'],
    category: 'challenge_handling',
    language: 'ta'
  },
  {
    id: 'q8',
    question: 'நீங்கள் எந்த வகையான குழு பாத்திரத்தை விரும்புகிறீர்கள்?',
    options: ['தொழில்நுட்ப நிபுணர்', 'குழு தலைவர்', 'படைப்பாற்றல் பங்களிப்பாளர்', 'ஆதரவு பாத்திரம்', 'சுதந்திர தொழிலாளி'],
    category: 'team_role',
    language: 'ta'
  },
  {
    id: 'q9',
    question: 'உங்களுக்கு வேலை-வாழ்க்கை சமநிலை எவ்வளவு முக்கியமானது?',
    options: ['மிகவும் முக்கியமானது', 'சற்று முக்கியமானது', 'மிகவும் முக்கியமானது அல்ல', 'வேலையைப் பொறுத்து', 'நான் நெகிழ்வான அட்டவணையை விரும்புகிறேன்'],
    category: 'work_life_balance',
    language: 'ta'
  },
  {
    id: 'q10',
    question: 'எந்த வகையான தொழில் வளர்ச்சி உங்களை ஆர்வமாக்குகிறது?',
    options: ['தொழில்நுட்ப நிபுணத்துவம்', 'மேலாண்மை பாத்திரங்கள்', 'தொழில்முனைவோம்', 'ஆராய்ச்சி மற்றும் மேம்பாடு', 'ஆலோசனை'],
    category: 'career_growth',
    language: 'ta'
  }
];

// Marathi Questions
const MARATHI_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'तुम्हाला कोणत्या विषयांचा अभ्यास करायला आवडतो?',
    options: ['विज्ञान आणि गणित', 'भाषा आणि साहित्य', 'सामाजिक विज्ञान', 'कला आणि डिझाइन', 'व्यापार आणि अर्थशास्त्र'],
    category: 'academic_interests',
    language: 'mr'
  },
  {
    id: 'q2',
    question: 'तुम्हाला कोणत्या प्रकारचे कामाचे वातावरण आवडते?',
    options: ['संशोधन प्रयोगशाळा', 'कार्यालय सेटिंग', 'बाहेरील/फील्ड काम', 'क्रिएटिव्ह स्टुडिओ', 'वर्ग/शिक्षण'],
    category: 'work_environment',
    language: 'mr'
  },
  {
    id: 'q3',
    question: 'तुम्ही समस्या कशी सोडवायला आवडता?',
    options: ['डेटा विश्लेषणाद्वारे', 'इतरांशी चर्चा करून', 'क्रिएटिव्ह पद्धती वापरून', 'स्थापित प्रक्रिया पाळून', 'प्रयोगाद्वारे'],
    category: 'problem_solving',
    language: 'mr'
  },
  {
    id: 'q4',
    question: 'तुमच्या कामात तुम्हाला काय सर्वात जास्त प्रेरणा देते?',
    options: ['शोध करणे', 'इतरांना मदत करणे', 'काहीतरी नवीन तयार करणे', 'संघांचे नेतृत्व करणे', 'शिक्षण आणि मार्गदर्शन'],
    category: 'motivation',
    language: 'mr'
  },
  {
    id: 'q5',
    question: 'तुम्ही नवीन गोष्टी कशा शिकायला आवडता?',
    options: ['हाताने सराव करून', 'वाचन आणि संशोधनाद्वारे', 'गट चर्चेद्वारे', 'प्रदर्शन पाहून', 'प्रयत्न आणि चुकांद्वारे'],
    category: 'learning_style',
    language: 'mr'
  },
  {
    id: 'q6',
    question: 'तुम्ही कोणत्या प्रकारचा प्रभाव टाकू इच्छिता?',
    options: ['वैज्ञानिक शोध', 'सामाजिक बदल', 'आर्थिक वाढ', 'सांस्कृतिक समृद्धी', 'शैक्षणिक प्रगती'],
    category: 'impact_goals',
    language: 'mr'
  },
  {
    id: 'q7',
    question: 'तुम्ही आव्हानांचा सामना कसा करता?',
    options: ['पद्धतशीरपणे विश्लेषण करून', 'इतरांकडून मदत मागून', 'अनेक पद्धती वापरून', 'सिद्ध पद्धती पाळून', 'चुकांमधून शिकून'],
    category: 'challenge_handling',
    language: 'mr'
  },
  {
    id: 'q8',
    question: 'तुम्हाला कोणत्या प्रकारची संघ भूमिका आवडते?',
    options: ['तांत्रिक तज्ञ', 'संघ नेता', 'क्रिएटिव्ह योगदानकर्ता', 'सहाय्यक भूमिका', 'स्वतंत्र कामगार'],
    category: 'team_role',
    language: 'mr'
  },
  {
    id: 'q9',
    question: 'तुमच्यासाठी काम-जीवन संतुलन किती महत्वाचे आहे?',
    options: ['खूप महत्वाचे', 'काहीसे महत्वाचे', 'खूप महत्वाचे नाही', 'नोकरीवर अवलंबून', 'मला लवचिक वेळापत्रक आवडते'],
    category: 'work_life_balance',
    language: 'mr'
  },
  {
    id: 'q10',
    question: 'कोणत्या प्रकारची करिअर वाढ तुम्हाला रुचकर वाटते?',
    options: ['तांत्रिक विशेषीकरण', 'व्यवस्थापन भूमिका', 'उद्योजकता', 'संशोधन आणि विकास', 'सल्लागार'],
    category: 'career_growth',
    language: 'mr'
  }
];

// All questions combined
export const ALL_QUESTIONS: QuizQuestion[] = [
  ...ENGLISH_QUESTIONS,
  ...HINDI_QUESTIONS,
  ...BENGALI_QUESTIONS,
  ...TELUGU_QUESTIONS,
  ...TAMIL_QUESTIONS,
  ...MARATHI_QUESTIONS
];

export const getQuestionsByLanguage = (language: SupportedLanguage): QuizQuestion[] => {
  return ALL_QUESTIONS.filter(q => q.language === language);
};

export const getSupportedLanguages = (): SupportedLanguage[] => {
  return Object.keys(LANGUAGE_NAMES) as SupportedLanguage[];
};
