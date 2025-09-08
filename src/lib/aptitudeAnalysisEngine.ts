import { AptitudeQuestion, StreamRecommendation } from './aptitudeQuizData';
import { STREAM_ANALYSIS } from './aptitudeQuizData';

interface QuizResponse {
  questionId: string;
  answer: string;
  category: string;
  weight: number;
}

interface AptitudeAnalysis {
  stream_recommendations: StreamRecommendation[];
  personality_traits: string[];
  learning_style: string;
  career_aptitude: string[];
  detailed_analysis: string;
  subject_recommendations: string[];
}

// Enhanced Analysis Engine for Comprehensive Assessment
export function analyzeAptitudeQuiz(responses: QuizResponse[]): AptitudeAnalysis {
  const scores = {
    Science: 0,
    Arts: 0,
    Commerce: 0,
    Vocational: 0
  };

  const personalityTraits: string[] = [];
  const careerAptitude: string[] = [];
  const subjectRecommendations: string[] = [];

  // Analyze each response
  responses.forEach(response => {
    const weight = response.weight;
    
    // Map answers to stream preferences
    const answerMapping = getAnswerMapping(response.questionId, response.answer);
    
    // Add weighted scores
    Object.keys(answerMapping).forEach(stream => {
      scores[stream as keyof typeof scores] += answerMapping[stream] * weight;
    });

    // Extract personality traits
    if (response.category === 'personality') {
      const traits = extractPersonalityTraits(response.answer);
      personalityTraits.push(...traits);
    }

    // Extract career aptitudes
    if (response.category === 'career_preference') {
      const aptitudes = extractCareerAptitudes(response.answer);
      careerAptitude.push(...aptitudes);
    }

    // Extract subject recommendations
    if (response.category === 'academic_interest') {
      const subjects = extractSubjectRecommendations(response.answer);
      subjectRecommendations.push(...subjects);
    }
  });

  // Calculate total possible score for normalization
  const totalWeight = responses.reduce((sum, r) => sum + r.weight, 0);
  const maxPossibleScore = totalWeight * 3; // Assuming max score per question is 3

  // Generate stream recommendations
  const streamRecommendations: StreamRecommendation[] = Object.entries(scores)
    .map(([stream, score]) => {
      const percentage = Math.round((score / maxPossibleScore) * 100);
      return {
        stream: stream as 'Arts' | 'Science' | 'Commerce' | 'Vocational',
        match_percentage: Math.min(percentage, 100),
        reasoning: generateReasoning(stream as keyof typeof STREAM_ANALYSIS, score, responses),
        subjects: STREAM_ANALYSIS[stream as keyof typeof STREAM_ANALYSIS].subjects,
        career_paths: STREAM_ANALYSIS[stream as keyof typeof STREAM_ANALYSIS].career_paths,
        government_exams: STREAM_ANALYSIS[stream as keyof typeof STREAM_ANALYSIS].government_exams,
        private_jobs: STREAM_ANALYSIS[stream as keyof typeof STREAM_ANALYSIS].private_jobs,
        higher_education: STREAM_ANALYSIS[stream as keyof typeof STREAM_ANALYSIS].higher_education
      };
    })
    .sort((a, b) => b.match_percentage - a.match_percentage);

  // Determine learning style
  const learningStyle = determineLearningStyle(responses);

  // Generate detailed analysis
  const detailedAnalysis = generateDetailedAnalysis(streamRecommendations, personalityTraits, careerAptitude);

  return {
    stream_recommendations: streamRecommendations,
    personality_traits: [...new Set(personalityTraits)],
    learning_style: learningStyle,
    career_aptitude: [...new Set(careerAptitude)],
    detailed_analysis: detailedAnalysis,
    subject_recommendations: [...new Set(subjectRecommendations)]
  };
}

// Helper function to map answers to stream preferences
function getAnswerMapping(questionId: string, answer: string): Record<string, number> {
  const mappings: Record<string, Record<string, Record<string, number>>> = {
    'academic_1': {
      'Mathematics and Physics': { Science: 3, Commerce: 1, Arts: 0, Vocational: 0 },
      'Literature and Languages': { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 },
      'History and Social Studies': { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 },
      'Biology and Chemistry': { Science: 3, Arts: 0, Commerce: 0, Vocational: 1 },
      'Economics and Business Studies': { Commerce: 3, Arts: 1, Science: 0, Vocational: 0 },
      'Computer Science and Technology': { Science: 2, Commerce: 1, Arts: 0, Vocational: 2 }
    },
    'academic_2': {
      'Mathematical equations and formulas': { Science: 3, Commerce: 2, Arts: 0, Vocational: 0 },
      'Creative writing and storytelling': { Arts: 3, Science: 0, Commerce: 0, Vocational: 0 },
      'Social issues and human behavior': { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 },
      'Scientific experiments and research': { Science: 3, Arts: 0, Commerce: 0, Vocational: 1 },
      'Business strategies and planning': { Commerce: 3, Arts: 1, Science: 0, Vocational: 0 },
      'Technical problems and coding': { Science: 2, Commerce: 1, Arts: 0, Vocational: 2 }
    },
    'personality_1': {
      'Independently with clear instructions': { Science: 2, Arts: 1, Commerce: 2, Vocational: 2 },
      'In creative teams with freedom': { Arts: 3, Science: 1, Commerce: 1, Vocational: 1 },
      'Helping others and community service': { Arts: 2, Science: 1, Commerce: 1, Vocational: 2 },
      'In research labs with detailed analysis': { Science: 3, Arts: 0, Commerce: 0, Vocational: 1 },
      'Leading teams and making decisions': { Commerce: 3, Arts: 1, Science: 1, Vocational: 1 },
      'With technology and innovation': { Science: 2, Commerce: 1, Arts: 0, Vocational: 2 }
    },
    'personality_2': {
      'Solving complex problems': { Science: 3, Arts: 0, Commerce: 1, Vocational: 1 },
      'Expressing creativity and ideas': { Arts: 3, Science: 0, Commerce: 0, Vocational: 1 },
      'Making a positive social impact': { Arts: 2, Science: 1, Commerce: 1, Vocational: 2 },
      'Discovering new knowledge': { Science: 3, Arts: 1, Commerce: 0, Vocational: 0 },
      'Achieving financial success': { Commerce: 3, Arts: 0, Science: 1, Vocational: 1 },
      'Building innovative solutions': { Science: 2, Commerce: 1, Arts: 1, Vocational: 2 }
    },
    'aptitude_1': {
      'Logical reasoning and calculations': { Science: 3, Commerce: 2, Arts: 0, Vocational: 1 },
      'Artistic expression and design': { Arts: 3, Science: 0, Commerce: 0, Vocational: 1 },
      'Communication and public speaking': { Arts: 2, Science: 0, Commerce: 2, Vocational: 1 },
      'Scientific observation and analysis': { Science: 3, Arts: 0, Commerce: 0, Vocational: 1 },
      'Strategic thinking and planning': { Commerce: 3, Arts: 1, Science: 1, Vocational: 1 },
      'Technical problem-solving': { Science: 2, Commerce: 1, Arts: 0, Vocational: 2 }
    },
    'aptitude_2': {
      'Structured classrooms with clear rules': { Science: 2, Arts: 0, Commerce: 2, Vocational: 2 },
      'Creative spaces with artistic freedom': { Arts: 3, Science: 0, Commerce: 0, Vocational: 1 },
      'Interactive discussions and debates': { Arts: 2, Science: 1, Commerce: 2, Vocational: 1 },
      'Laboratories with hands-on experiments': { Science: 3, Arts: 0, Commerce: 0, Vocational: 2 },
      'Business simulations and case studies': { Commerce: 3, Arts: 1, Science: 0, Vocational: 1 },
      'Technology labs with modern equipment': { Science: 2, Commerce: 1, Arts: 0, Vocational: 2 }
    },
    'learning_1': {
      'Through step-by-step instructions': { Science: 2, Arts: 0, Commerce: 2, Vocational: 2 },
      'Through creative projects and art': { Arts: 3, Science: 0, Commerce: 0, Vocational: 1 },
      'Through group discussions and debates': { Arts: 2, Science: 1, Commerce: 2, Vocational: 1 },
      'Through experiments and observations': { Science: 3, Arts: 0, Commerce: 0, Vocational: 2 },
      'Through real-world applications': { Commerce: 2, Arts: 1, Science: 1, Vocational: 2 },
      'Through technology and simulations': { Science: 2, Commerce: 1, Arts: 0, Vocational: 2 }
    },
    'career_1': {
      'Research institutions and laboratories': { Science: 3, Arts: 0, Commerce: 0, Vocational: 1 },
      'Creative studios and media companies': { Arts: 3, Science: 0, Commerce: 0, Vocational: 1 },
      'Educational institutions and NGOs': { Arts: 2, Science: 1, Commerce: 1, Vocational: 1 },
      'Hospitals and healthcare facilities': { Science: 3, Arts: 0, Commerce: 0, Vocational: 1 },
      'Corporate offices and business centers': { Commerce: 3, Arts: 0, Science: 1, Vocational: 0 },
      'Tech companies and startups': { Science: 2, Commerce: 1, Arts: 0, Vocational: 2 }
    },
    'career_2': {
      'Scientific breakthroughs and discoveries': { Science: 3, Arts: 0, Commerce: 0, Vocational: 0 },
      'Cultural and artistic contributions': { Arts: 3, Science: 0, Commerce: 0, Vocational: 0 },
      'Social change and community development': { Arts: 2, Science: 1, Commerce: 1, Vocational: 2 },
      'Healthcare and medical advancements': { Science: 3, Arts: 0, Commerce: 0, Vocational: 1 },
      'Economic growth and business success': { Commerce: 3, Arts: 0, Science: 1, Vocational: 1 },
      'Technological innovation and digital transformation': { Science: 2, Commerce: 1, Arts: 0, Vocational: 2 }
    }
  };

  return mappings[questionId]?.[answer] || { Science: 0, Arts: 0, Commerce: 0, Vocational: 0 };
}

// Extract personality traits from responses
function extractPersonalityTraits(answer: string): string[] {
  const traitMapping: Record<string, string[]> = {
    'Independently with clear instructions': ['Independent', 'Structured', 'Methodical'],
    'In creative teams with freedom': ['Creative', 'Collaborative', 'Flexible'],
    'Helping others and community service': ['Empathetic', 'Service-oriented', 'Social'],
    'In research labs with detailed analysis': ['Analytical', 'Detail-oriented', 'Curious'],
    'Leading teams and making decisions': ['Leadership', 'Decisive', 'Confident'],
    'With technology and innovation': ['Innovative', 'Tech-savvy', 'Forward-thinking']
  };

  return traitMapping[answer] || [];
}

// Extract career aptitudes from responses
function extractCareerAptitudes(answer: string): string[] {
  const aptitudeMapping: Record<string, string[]> = {
    'Solving complex problems': ['Problem-solving', 'Analytical thinking', 'Logical reasoning'],
    'Expressing creativity and ideas': ['Creative thinking', 'Artistic expression', 'Innovation'],
    'Making a positive social impact': ['Social awareness', 'Community service', 'Empathy'],
    'Discovering new knowledge': ['Research orientation', 'Intellectual curiosity', 'Learning agility'],
    'Achieving financial success': ['Business acumen', 'Financial planning', 'Goal-oriented'],
    'Building innovative solutions': ['Innovation', 'Technical skills', 'Entrepreneurship']
  };

  return aptitudeMapping[answer] || [];
}

// Extract subject recommendations from responses
function extractSubjectRecommendations(answer: string): string[] {
  const subjectMapping: Record<string, string[]> = {
    'Mathematics and Physics': ['Mathematics', 'Physics', 'Statistics'],
    'Literature and Languages': ['English', 'Hindi', 'Literature', 'Languages'],
    'History and Social Studies': ['History', 'Political Science', 'Sociology', 'Geography'],
    'Biology and Chemistry': ['Biology', 'Chemistry', 'Environmental Science'],
    'Economics and Business Studies': ['Economics', 'Business Studies', 'Accountancy'],
    'Computer Science and Technology': ['Computer Science', 'Information Technology', 'Programming']
  };

  return subjectMapping[answer] || [];
}

// Determine learning style based on responses
function determineLearningStyle(responses: QuizResponse[]): string {
  const learningResponses = responses.filter(r => r.category === 'learning_style');
  
  if (learningResponses.length === 0) return 'Mixed Learning Style';

  const learningStyles = learningResponses.map(r => {
    const styleMapping: Record<string, string> = {
      'Through step-by-step instructions': 'Sequential Learning',
      'Through creative projects and art': 'Visual and Creative Learning',
      'Through group discussions and debates': 'Collaborative Learning',
      'Through experiments and observations': 'Hands-on Learning',
      'Through real-world applications': 'Practical Learning',
      'Through technology and simulations': 'Digital Learning'
    };
    return styleMapping[r.answer] || 'Mixed Learning';
  });

  // Return the most common learning style
  const counts = learningStyles.reduce((acc, style) => {
    acc[style] = (acc[style] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Mixed Learning Style';
}

// Generate reasoning for stream recommendations
function generateReasoning(stream: keyof typeof STREAM_ANALYSIS, score: number, responses: QuizResponse[]): string {
  const reasons: Record<string, string[]> = {
    Science: [
      'Strong analytical and problem-solving abilities',
      'Interest in scientific research and experimentation',
      'Preference for structured learning environments',
      'Aptitude for mathematical and logical reasoning'
    ],
    Arts: [
      'Creative and artistic expression',
      'Strong communication and interpersonal skills',
      'Interest in social issues and human behavior',
      'Preference for flexible and creative environments'
    ],
    Commerce: [
      'Business acumen and strategic thinking',
      'Interest in financial and economic concepts',
      'Leadership and decision-making abilities',
      'Goal-oriented and success-driven mindset'
    ],
    Vocational: [
      'Practical and hands-on learning preference',
      'Interest in technical and skill-based work',
      'Preference for immediate application of knowledge',
      'Strong work ethic and practical problem-solving'
    ]
  };

  const relevantReasons = reasons[stream] || [];
  return relevantReasons[Math.floor(Math.random() * relevantReasons.length)] || 'Based on your responses and interests.';
}

// Generate detailed analysis
function generateDetailedAnalysis(
  streamRecommendations: StreamRecommendation[],
  personalityTraits: string[],
  careerAptitude: string[]
): string {
  const topStream = streamRecommendations[0];
  const secondStream = streamRecommendations[1];

  return `Based on your comprehensive assessment, you show strong alignment with ${topStream.stream} stream (${topStream.match_percentage}% match). Your personality traits of ${personalityTraits.slice(0, 3).join(', ')} and career aptitudes in ${careerAptitude.slice(0, 3).join(', ')} make you well-suited for this field. 

${secondStream.match_percentage > 60 ? `You also show significant interest in ${secondStream.stream} (${secondStream.match_percentage}% match), suggesting you could explore interdisciplinary approaches or career paths that combine both streams.` : ''}

Your learning style and preferences indicate you would thrive in environments that match your natural inclinations and provide opportunities for growth in your areas of strength.`;
}
