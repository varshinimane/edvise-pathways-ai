// Offline rule-based recommendation engine
interface QuizResponse {
  questionId: string;
  answer: string;
  category: string;
}

interface CareerRecommendation {
  title: string;
  description: string;
  match_percentage: number;
  reason: string;
  required_education: string[];
  skills: string[];
  salary_range: string;
  growth_prospects: string;
}

interface QuizAnalysis {
  summary: string;
  strengths: string[];
  work_style: string;
  career_recommendations: CareerRecommendation[];
  course_recommendations?: string[];
}

const CAREER_DATABASE = {
  'science_research': [
    {
      title: 'Research Scientist',
      description: 'Conduct research in various scientific fields, analyze data, and contribute to scientific knowledge.',
      required_education: ['B.Sc', 'M.Sc', 'Ph.D', 'Research Programs'],
      skills: ['Analytical Thinking', 'Research Methods', 'Data Analysis', 'Scientific Writing'],
      salary_range: '₹6-15 LPA',
      growth_prospects: 'Excellent opportunities in R&D, academia, and industry research',
      keywords: ['research', 'science', 'analysis', 'experiment', 'discovery']
    },
    {
      title: 'Data Scientist',
      description: 'Analyze complex data to help organizations make informed decisions using statistical methods and machine learning.',
      required_education: ['B.Tech/B.Sc in Statistics/Math', 'M.Sc Data Science', 'Certification Programs'],
      skills: ['Statistics', 'Python/R', 'Machine Learning', 'Data Visualization'],
      salary_range: '₹8-25 LPA',
      growth_prospects: 'High demand across industries, excellent career growth',
      keywords: ['data', 'statistics', 'machine learning', 'analysis', 'algorithms']
    }
  ],
  'engineering_tech': [
    {
      title: 'Software Engineer',
      description: 'Design, develop, and maintain software applications and systems using various programming languages.',
      required_education: ['B.Tech Computer Science', 'B.Sc IT', 'Coding Bootcamps', 'Online Certifications'],
      skills: ['Programming', 'Problem Solving', 'System Design', 'Teamwork'],
      salary_range: '₹4-20 LPA',
      growth_prospects: 'Excellent growth in tech industry with global opportunities',
      keywords: ['programming', 'software', 'coding', 'development', 'technology']
    },
    {
      title: 'Electronics Engineer',
      description: 'Design and develop electronic systems, circuits, and devices for various applications.',
      required_education: ['B.Tech Electronics', 'Diploma in Electronics', 'M.Tech'],
      skills: ['Circuit Design', 'Microcontrollers', 'Signal Processing', 'Testing'],
      salary_range: '₹3-12 LPA',
      growth_prospects: 'Growing demand in consumer electronics and IoT',
      keywords: ['electronics', 'circuits', 'hardware', 'microcontroller', 'embedded']
    }
  ],
  'medical_healthcare': [
    {
      title: 'Doctor (MBBS)',
      description: 'Diagnose and treat patients, provide medical care and health advice to improve patient outcomes.',
      required_education: ['MBBS', 'MD/MS Specialization', 'Medical Licensing'],
      skills: ['Medical Knowledge', 'Empathy', 'Communication', 'Decision Making'],
      salary_range: '₹8-25 LPA',
      growth_prospects: 'Stable career with high social respect and growing healthcare needs',
      keywords: ['medical', 'health', 'patient', 'treatment', 'diagnosis']
    },
    {
      title: 'Nurse',
      description: 'Provide direct patient care, administer medications, and support medical teams in healthcare delivery.',
      required_education: ['B.Sc Nursing', 'Diploma in Nursing', 'Nursing License'],
      skills: ['Patient Care', 'Medical Procedures', 'Communication', 'Compassion'],
      salary_range: '₹3-8 LPA',
      growth_prospects: 'High demand globally with opportunities for specialization',
      keywords: ['nursing', 'patient care', 'medical', 'healthcare', 'hospital']
    }
  ],
  'business_management': [
    {
      title: 'Business Analyst',
      description: 'Analyze business processes, identify improvements, and help organizations optimize their operations.',
      required_education: ['BBA', 'MBA', 'B.Com', 'Business Certification'],
      skills: ['Analytical Thinking', 'Communication', 'Problem Solving', 'Business Acumen'],
      salary_range: '₹5-18 LPA',
      growth_prospects: 'Growing demand across industries with leadership opportunities',
      keywords: ['business', 'analysis', 'management', 'strategy', 'optimization']
    },
    {
      title: 'Marketing Manager',
      description: 'Develop and execute marketing strategies to promote products and services and drive business growth.',
      required_education: ['BBA Marketing', 'MBA', 'Digital Marketing Certification'],
      skills: ['Marketing Strategy', 'Communication', 'Analytics', 'Creativity'],
      salary_range: '₹6-20 LPA',
      growth_prospects: 'Excellent growth with digital marketing expansion',
      keywords: ['marketing', 'promotion', 'brand', 'strategy', 'communication']
    }
  ],
  'arts_creative': [
    {
      title: 'Graphic Designer',
      description: 'Create visual concepts and designs for various media including digital and print platforms.',
      required_education: ['BFA', 'Diploma in Design', 'Portfolio Development'],
      skills: ['Design Software', 'Creativity', 'Visual Communication', 'Attention to Detail'],
      salary_range: '₹3-12 LPA',
      growth_prospects: 'Growing demand in digital media and branding',
      keywords: ['design', 'graphics', 'visual', 'creative', 'art']
    },
    {
      title: 'Content Writer',
      description: 'Create engaging written content for websites, blogs, marketing materials, and various publications.',
      required_education: ['BA English/Journalism', 'Content Writing Certification'],
      skills: ['Writing', 'Research', 'SEO', 'Communication'],
      salary_range: '₹3-10 LPA',
      growth_prospects: 'High demand in digital marketing and content creation',
      keywords: ['writing', 'content', 'communication', 'creativity', 'language']
    }
  ],
  'education_teaching': [
    {
      title: 'School Teacher',
      description: 'Educate and mentor students in various subjects, helping them develop knowledge and life skills.',
      required_education: ['B.Ed', 'Subject-specific degrees', 'Teaching Certification'],
      skills: ['Communication', 'Patience', 'Subject Knowledge', 'Classroom Management'],
      salary_range: '₹3-10 LPA',
      growth_prospects: 'Stable career with good job security and social impact',
      keywords: ['teaching', 'education', 'students', 'learning', 'mentoring']
    },
    {
      title: 'Corporate Trainer',
      description: 'Design and deliver training programs to help employees develop professional skills and knowledge.',
      required_education: ['MBA', 'Training Certification', 'Subject Expertise'],
      skills: ['Training Design', 'Presentation', 'Communication', 'Assessment'],
      salary_range: '₹5-15 LPA',
      growth_prospects: 'Growing demand for corporate learning and development',
      keywords: ['training', 'corporate', 'development', 'skills', 'professional']
    }
  ]
};

export function generateOfflineRecommendations(quizData: QuizResponse[]): QuizAnalysis {
  console.log('Generating offline recommendations for:', quizData.length, 'responses');
  
  // Analyze interests and preferences
  const interestScores: { [key: string]: number } = {};
  const strengthsSet = new Set<string>();
  
  quizData.forEach(response => {
    const answer = response.answer.toLowerCase();
    const category = response.category.toLowerCase();
    
    // Score different career areas based on answers
    Object.keys(CAREER_DATABASE).forEach(area => {
      const careers = CAREER_DATABASE[area as keyof typeof CAREER_DATABASE];
      careers.forEach(career => {
        career.keywords.forEach(keyword => {
          if (answer.includes(keyword) || category.includes(keyword)) {
            interestScores[area] = (interestScores[area] || 0) + 1;
          }
        });
      });
    });
    
    // Extract strengths based on answers
    if (answer.includes('analysis') || answer.includes('data') || answer.includes('research')) {
      strengthsSet.add('Analytical Thinking');
    }
    if (answer.includes('creative') || answer.includes('design') || answer.includes('art')) {
      strengthsSet.add('Creativity');
    }
    if (answer.includes('people') || answer.includes('team') || answer.includes('communication')) {
      strengthsSet.add('Communication');
    }
    if (answer.includes('leadership') || answer.includes('manage') || answer.includes('lead')) {
      strengthsSet.add('Leadership');
    }
    if (answer.includes('technology') || answer.includes('programming') || answer.includes('technical')) {
      strengthsSet.add('Technical Skills');
    }
  });
  
  // Get top 3 career areas
  const sortedAreas = Object.entries(interestScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
  
  // If no clear preferences, provide balanced recommendations
  const topAreas = sortedAreas.length > 0 
    ? sortedAreas.map(([area]) => area)
    : ['engineering_tech', 'business_management', 'science_research'];
  
  // Generate career recommendations
  const recommendations: CareerRecommendation[] = [];
  
  topAreas.forEach((area, index) => {
    const careers = CAREER_DATABASE[area as keyof typeof CAREER_DATABASE];
    if (careers && careers.length > 0) {
      const career = careers[0]; // Take the first career for each area
      const matchPercentage = Math.max(70, 95 - (index * 10)); // Decreasing match percentage
      
      recommendations.push({
        ...career,
        match_percentage: matchPercentage,
        reason: `Your responses indicate strong alignment with ${area.replace('_', ' ')} careers. ${career.description.split('.')[0]}.`
      });
    }
  });
  
  // Add a fourth recommendation from remaining areas if we have less than 3
  if (recommendations.length < 3) {
    const remainingAreas = Object.keys(CAREER_DATABASE).filter(area => !topAreas.includes(area));
    if (remainingAreas.length > 0) {
      const area = remainingAreas[0];
      const careers = CAREER_DATABASE[area as keyof typeof CAREER_DATABASE];
      if (careers && careers.length > 0) {
        recommendations.push({
          ...careers[0],
          match_percentage: 65,
          reason: `Based on your profile, this career could also be a good fit for your skills and interests.`
        });
      }
    }
  }
  
  const strengths = Array.from(strengthsSet);
  if (strengths.length === 0) {
    strengths.push('Problem Solving', 'Communication', 'Adaptability');
  }
  
  // Determine work style based on answers
  const workStyleIndicators = quizData.map(r => r.answer.toLowerCase()).join(' ');
  let workStyle = 'Collaborative and analytical';
  
  if (workStyleIndicators.includes('independent') || workStyleIndicators.includes('alone')) {
    workStyle = 'Independent and self-directed';
  } else if (workStyleIndicators.includes('team') || workStyleIndicators.includes('group')) {
    workStyle = 'Collaborative and team-oriented';  
  } else if (workStyleIndicators.includes('creative') || workStyleIndicators.includes('innovative')) {
    workStyle = 'Creative and innovative';
  }
  
  const summary = `Based on your quiz responses, you show strong potential in ${topAreas[0]?.replace('_', ' ')} with complementary interests in ${topAreas[1]?.replace('_', ' ')}. Your analytical mindset and ${workStyle.toLowerCase()} approach make you well-suited for careers that involve problem-solving and continuous learning.`;
  
  console.log('Generated recommendations:', recommendations.length);
  
  return {
    summary,
    strengths,
    work_style: workStyle,
    career_recommendations: recommendations,
    course_recommendations: recommendations.flatMap(r => r.required_education).slice(0, 5)
  };
}