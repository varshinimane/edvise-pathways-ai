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
    },
    {
      title: 'Environmental Scientist',
      description: 'Study environmental problems and develop solutions to protect the environment and human health.',
      required_education: ['B.Sc Environmental Science', 'M.Sc', 'Environmental Certifications'],
      skills: ['Environmental Analysis', 'Field Research', 'Data Collection', 'Report Writing'],
      salary_range: '₹4-12 LPA',
      growth_prospects: 'Growing field with increasing environmental awareness',
      keywords: ['environment', 'ecology', 'conservation', 'sustainability', 'nature']
    },
    {
      title: 'Biotechnology Researcher',
      description: 'Apply biological systems to develop products and technologies for healthcare, agriculture, and industry.',
      required_education: ['B.Tech Biotech', 'M.Sc Biotechnology', 'Research Experience'],
      skills: ['Laboratory Techniques', 'Molecular Biology', 'Research Methods', 'Data Analysis'],
      salary_range: '₹5-18 LPA',
      growth_prospects: 'Excellent opportunities in pharmaceuticals and biotech companies',
      keywords: ['biology', 'genetics', 'laboratory', 'molecular', 'biotechnology']
    },
    {
      title: 'Physics Researcher',
      description: 'Conduct theoretical and experimental research in physics to understand natural phenomena.',
      required_education: ['B.Sc Physics', 'M.Sc Physics', 'Ph.D Physics'],
      skills: ['Mathematical Modeling', 'Experimental Design', 'Data Analysis', 'Scientific Writing'],
      salary_range: '₹6-20 LPA',
      growth_prospects: 'Opportunities in academia, research institutions, and industry',
      keywords: ['physics', 'quantum', 'theoretical', 'experimental', 'mathematics']
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
    },
    {
      title: 'Civil Engineer',
      description: 'Design, build, and maintain infrastructure projects like roads, bridges, and buildings.',
      required_education: ['B.Tech Civil', 'Diploma Civil', 'M.Tech Structural'],
      skills: ['Structural Design', 'Project Management', 'CAD Software', 'Site Supervision'],
      salary_range: '₹3-15 LPA',
      growth_prospects: 'Stable demand in construction and infrastructure development',
      keywords: ['construction', 'building', 'infrastructure', 'design', 'structural']
    },
    {
      title: 'Mechanical Engineer',
      description: 'Design, develop, and test mechanical systems, engines, and manufacturing equipment.',
      required_education: ['B.Tech Mechanical', 'Diploma Mechanical', 'M.Tech'],
      skills: ['CAD Design', 'Manufacturing', 'Thermodynamics', 'Material Science'],
      salary_range: '₹3-18 LPA',
      growth_prospects: 'Wide opportunities in automotive, aerospace, and manufacturing',
      keywords: ['mechanical', 'machines', 'automotive', 'manufacturing', 'design']
    },
    {
      title: 'Cybersecurity Specialist',
      description: 'Protect organizations from cyber threats by implementing security measures and monitoring systems.',
      required_education: ['B.Tech CS/IT', 'Cybersecurity Certifications', 'Ethical Hacking'],
      skills: ['Network Security', 'Penetration Testing', 'Risk Assessment', 'Incident Response'],
      salary_range: '₹6-25 LPA',
      growth_prospects: 'Extremely high demand with excellent career prospects',
      keywords: ['security', 'hacking', 'network', 'protection', 'cyber']
    },
    {
      title: 'AI/ML Engineer',
      description: 'Develop artificial intelligence and machine learning solutions for complex problems.',
      required_education: ['B.Tech CS/AI', 'M.Tech AI', 'ML Specialization'],
      skills: ['Machine Learning', 'Deep Learning', 'Python', 'Neural Networks'],
      salary_range: '₹8-30 LPA',
      growth_prospects: 'Revolutionary field with exceptional growth potential',
      keywords: ['artificial intelligence', 'machine learning', 'neural networks', 'algorithms']
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
    },
    {
      title: 'Physiotherapist',
      description: 'Help patients recover from injuries and improve mobility through therapeutic exercises and treatments.',
      required_education: ['BPT', 'MPT Specialization', 'License'],
      skills: ['Anatomy Knowledge', 'Manual Therapy', 'Exercise Prescription', 'Patient Assessment'],
      salary_range: '₹3-12 LPA',
      growth_prospects: 'Growing field with sports medicine and elderly care expansion',
      keywords: ['therapy', 'rehabilitation', 'mobility', 'exercise', 'recovery']
    },
    {
      title: 'Medical Laboratory Technologist',
      description: 'Conduct laboratory tests to help diagnose diseases and monitor patient health conditions.',
      required_education: ['B.Sc MLT', 'Diploma MLT', 'Certification'],
      skills: ['Laboratory Techniques', 'Equipment Operation', 'Quality Control', 'Data Analysis'],
      salary_range: '₹2.5-8 LPA',
      growth_prospects: 'Steady demand in hospitals and diagnostic centers',
      keywords: ['laboratory', 'testing', 'diagnosis', 'samples', 'analysis']
    },
    {
      title: 'Pharmacist',
      description: 'Dispense medications, counsel patients on drug therapy, and ensure safe medication use.',
      required_education: ['B.Pharm', 'D.Pharm', 'Pharmacy License'],
      skills: ['Drug Knowledge', 'Patient Counseling', 'Inventory Management', 'Safety Protocols'],
      salary_range: '₹3-10 LPA',
      growth_prospects: 'Stable career with opportunities in retail and clinical pharmacy',
      keywords: ['pharmacy', 'medication', 'drugs', 'counseling', 'dispensing']
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
    },
    {
      title: 'Human Resources Manager',
      description: 'Manage employee relations, recruitment, training, and organizational development initiatives.',
      required_education: ['BBA HR', 'MBA HR', 'HR Certification'],
      skills: ['People Management', 'Communication', 'Conflict Resolution', 'Policy Development'],
      salary_range: '₹4-18 LPA',
      growth_prospects: 'Essential role with growth in organizational psychology',
      keywords: ['human resources', 'people', 'recruitment', 'training', 'employee']
    },
    {
      title: 'Financial Analyst',
      description: 'Analyze financial data, create reports, and provide investment recommendations for businesses.',
      required_education: ['B.Com', 'BBA Finance', 'MBA Finance', 'CFA'],
      skills: ['Financial Modeling', 'Data Analysis', 'Excel', 'Investment Analysis'],
      salary_range: '₹4-16 LPA',
      growth_prospects: 'Strong demand in banking, investment, and corporate sectors',
      keywords: ['finance', 'investment', 'analysis', 'money', 'accounting']
    },
    {
      title: 'Project Manager',
      description: 'Lead project teams, manage timelines and budgets, and ensure successful project delivery.',
      required_education: ['Any Degree', 'PMP Certification', 'MBA'],
      skills: ['Leadership', 'Planning', 'Communication', 'Risk Management'],
      salary_range: '₹6-22 LPA',
      growth_prospects: 'High demand across all industries with leadership growth',
      keywords: ['project', 'management', 'leadership', 'planning', 'coordination']
    },
    {
      title: 'Operations Manager',
      description: 'Oversee daily business operations, optimize processes, and improve organizational efficiency.',
      required_education: ['BBA', 'MBA Operations', 'Industrial Engineering'],
      skills: ['Process Optimization', 'Team Management', 'Quality Control', 'Strategic Planning'],
      salary_range: '₹5-20 LPA',
      growth_prospects: 'Essential role with growth opportunities in all sectors',
      keywords: ['operations', 'processes', 'efficiency', 'management', 'optimization']
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
    },
    {
      title: 'UI/UX Designer',
      description: 'Design user interfaces and experiences for websites, mobile apps, and digital products.',
      required_education: ['Design Degree', 'UX Certification', 'Portfolio'],
      skills: ['User Research', 'Prototyping', 'Design Tools', 'Psychology'],
      salary_range: '₹4-18 LPA',
      growth_prospects: 'Extremely high demand in tech and digital industries',
      keywords: ['user interface', 'user experience', 'design', 'digital', 'usability']
    },
    {
      title: 'Video Editor',
      description: 'Edit and produce video content for entertainment, marketing, and educational purposes.',
      required_education: ['Media Production', 'Film Making', 'Certification Courses'],
      skills: ['Video Editing Software', 'Storytelling', 'Color Correction', 'Audio Editing'],
      salary_range: '₹3-15 LPA',
      growth_prospects: 'Growing rapidly with social media and streaming platforms',
      keywords: ['video', 'editing', 'production', 'multimedia', 'storytelling']
    },
    {
      title: 'Animator',
      description: 'Create animations for films, games, advertisements, and digital media using various techniques.',
      required_education: ['Animation Degree', 'Portfolio', 'Software Certification'],
      skills: ['Animation Software', 'Drawing', 'Storytelling', 'Time Management'],
      salary_range: '₹3-16 LPA',
      growth_prospects: 'Excellent opportunities in gaming and entertainment industry',
      keywords: ['animation', 'drawing', 'storytelling', 'multimedia', 'creative']
    },
    {
      title: 'Fashion Designer',
      description: 'Design clothing, accessories, and footwear for various markets and fashion segments.',
      required_education: ['Fashion Design Degree', 'Portfolio', 'Industry Experience'],
      skills: ['Design Skills', 'Trend Analysis', 'Pattern Making', 'Marketing'],
      salary_range: '₹2.5-20 LPA',
      growth_prospects: 'Growing industry with opportunities for entrepreneurship',
      keywords: ['fashion', 'clothing', 'design', 'style', 'trends']
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
    },
    {
      title: 'Educational Consultant',
      description: 'Advise students and institutions on educational planning, career guidance, and academic strategies.',
      required_education: ['M.Ed', 'Counseling Certification', 'Educational Experience'],
      skills: ['Counseling', 'Educational Planning', 'Communication', 'Research'],
      salary_range: '₹4-12 LPA',
      growth_prospects: 'Growing field with increased focus on personalized education',
      keywords: ['counseling', 'guidance', 'education', 'planning', 'advice']
    },
    {
      title: 'Online Course Creator',
      description: 'Develop and market online educational content and courses for various learning platforms.',
      required_education: ['Subject Expertise', 'Content Creation Skills', 'Marketing Knowledge'],
      skills: ['Content Development', 'Video Production', 'Marketing', 'Technology'],
      salary_range: '₹3-25 LPA',
      growth_prospects: 'Rapidly growing field with entrepreneurial opportunities',
      keywords: ['online', 'courses', 'content', 'digital', 'teaching']
    }
  ],
  'agriculture_environment': [
    {
      title: 'Agricultural Scientist',
      description: 'Research and develop improved farming techniques, crop varieties, and sustainable agriculture practices.',
      required_education: ['B.Sc Agriculture', 'M.Sc', 'Ph.D Agriculture'],
      skills: ['Research Methods', 'Crop Science', 'Data Analysis', 'Field Work'],
      salary_range: '₹4-15 LPA',
      growth_prospects: 'Growing importance with sustainable farming focus',
      keywords: ['agriculture', 'farming', 'crops', 'research', 'sustainability']
    },
    {
      title: 'Environmental Consultant',
      description: 'Assess environmental impact of projects and recommend solutions for environmental compliance.',
      required_education: ['Environmental Science', 'Environmental Law', 'Certification'],
      skills: ['Environmental Assessment', 'Regulatory Knowledge', 'Report Writing', 'Field Surveys'],
      salary_range: '₹4-16 LPA',
      growth_prospects: 'High demand with increasing environmental regulations',
      keywords: ['environment', 'consulting', 'compliance', 'assessment', 'sustainability']
    }
  ],
  'social_services': [
    {
      title: 'Social Worker',
      description: 'Help individuals, families, and communities overcome challenges and improve their well-being.',
      required_education: ['BSW', 'MSW', 'Social Work License'],
      skills: ['Empathy', 'Communication', 'Case Management', 'Crisis Intervention'],
      salary_range: '₹2.5-8 LPA',
      growth_prospects: 'Stable demand with growing focus on mental health and social issues',
      keywords: ['social', 'help', 'community', 'welfare', 'counseling']
    },
    {
      title: 'NGO Program Manager',
      description: 'Manage social programs, coordinate with stakeholders, and ensure effective program implementation.',
      required_education: ['Any Degree', 'Development Studies', 'Project Management'],
      skills: ['Program Management', 'Fundraising', 'Communication', 'Leadership'],
      salary_range: '₹3-12 LPA',
      growth_prospects: 'Growing sector with increased focus on social development',
      keywords: ['ngo', 'social', 'programs', 'development', 'management']
    }
  ],
  'government_public': [
    {
      title: 'Civil Services Officer (IAS/IPS)',
      description: 'Serve in administrative and policy roles in government, implementing public policies and governance.',
      required_education: ['Any Graduate Degree', 'UPSC Preparation'],
      skills: ['Leadership', 'Policy Analysis', 'Public Administration', 'Communication'],
      salary_range: '₹8-25 LPA',
      growth_prospects: 'Prestigious career with significant social impact and job security',
      keywords: ['government', 'administration', 'policy', 'public service', 'leadership']
    },
    {
      title: 'Public Policy Analyst',
      description: 'Research and analyze public policies, evaluate their effectiveness, and recommend improvements.',
      required_education: ['Political Science', 'Public Policy', 'Economics'],
      skills: ['Policy Analysis', 'Research', 'Data Analysis', 'Writing'],
      salary_range: '₹5-18 LPA',
      growth_prospects: 'Growing field with increasing focus on evidence-based policy making',
      keywords: ['policy', 'government', 'analysis', 'research', 'public']
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
      // Select different careers from each area to provide variety
      const careerIndex = index < careers.length ? index : 0;
      const career = careers[careerIndex];
      const matchPercentage = Math.max(70, 95 - (index * 8)); // Decreasing match percentage
      
      recommendations.push({
        ...career,
        match_percentage: matchPercentage,
        reason: `Your responses indicate strong alignment with ${area.replace('_', ' ')} careers. ${career.description.split('.')[0]}.`
      });
    }
  });
  
  // Add more recommendations from other careers in top areas for variety
  if (recommendations.length < 4) {
    topAreas.forEach((area, areaIndex) => {
      const careers = CAREER_DATABASE[area as keyof typeof CAREER_DATABASE];
      if (careers && careers.length > 1) {
        // Add a second career from each top area
        const secondCareerIndex = areaIndex + 1 < careers.length ? areaIndex + 1 : 1;
        if (secondCareerIndex < careers.length && recommendations.length < 4) {
          const career = careers[secondCareerIndex];
          const matchPercentage = Math.max(60, 80 - (recommendations.length * 5));
          
          recommendations.push({
            ...career,
            match_percentage: matchPercentage,
            reason: `Alternative career path in ${area.replace('_', ' ')} that matches your interests and skills well.`
          });
        }
      }
    });
  }
  
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