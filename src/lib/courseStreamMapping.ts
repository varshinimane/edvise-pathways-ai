// Course and Stream Mapping for Indian Education System
export interface Stream {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  career_paths: string[];
  personality_traits: string[];
  skills_required: string[];
  icon: string;
  color: string;
}

export interface Course {
  id: string;
  name: string;
  stream_id: string;
  duration: string;
  eligibility: string[];
  subjects: string[];
  career_opportunities: CareerOpportunity[];
  higher_education_options: string[];
  government_exams: string[];
  private_job_sectors: string[];
  entrepreneurial_options: string[];
  average_salary_range: string;
  growth_prospects: string;
}

export interface CareerOpportunity {
  title: string;
  sector: string;
  description: string;
  salary_range: string;
  growth_prospects: string;
  required_skills: string[];
  government_exams?: string[];
}

// Streams in Indian Education System
export const STREAMS: Stream[] = [
  {
    id: 'science',
    name: 'Science',
    description: 'Focus on scientific inquiry, mathematics, and analytical thinking',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
    career_paths: ['Engineering', 'Medicine', 'Research', 'Technology', 'Data Science'],
    personality_traits: ['Analytical', 'Curious', 'Problem-solving', 'Logical', 'Detail-oriented'],
    skills_required: ['Mathematical reasoning', 'Scientific method', 'Critical thinking', 'Research skills'],
    icon: '🔬',
    color: '#3B82F6'
  },
  {
    id: 'commerce',
    name: 'Commerce',
    description: 'Business, economics, and financial management focus',
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Computer Science'],
    career_paths: ['Business', 'Finance', 'Accounting', 'Banking', 'Entrepreneurship'],
    personality_traits: ['Business-minded', 'Numerical', 'Strategic', 'Leadership', 'Risk-taking'],
    skills_required: ['Financial literacy', 'Business acumen', 'Communication', 'Leadership'],
    icon: '💼',
    color: '#10B981'
  },
  {
    id: 'arts',
    name: 'Arts/Humanities',
    description: 'Humanities, social sciences, and creative expression',
    subjects: ['History', 'Political Science', 'Geography', 'Psychology', 'Literature', 'Philosophy'],
    career_paths: ['Education', 'Journalism', 'Public Service', 'Social Work', 'Creative Arts'],
    personality_traits: ['Creative', 'Empathetic', 'Communication', 'Cultural awareness', 'Critical thinking'],
    skills_required: ['Writing', 'Research', 'Communication', 'Cultural understanding'],
    icon: '🎨',
    color: '#F59E0B'
  },
  {
    id: 'vocational',
    name: 'Vocational',
    description: 'Skill-based training for specific trades and professions',
    subjects: ['Technical Skills', 'Trade-specific subjects', 'Practical training', 'Industry knowledge'],
    career_paths: ['Skilled Trades', 'Technical Services', 'Manufacturing', 'Service Industry'],
    personality_traits: ['Practical', 'Hands-on', 'Technical', 'Problem-solving', 'Adaptable'],
    skills_required: ['Technical skills', 'Practical application', 'Problem-solving', 'Adaptability'],
    icon: '🔧',
    color: '#EF4444'
  }
];

// Detailed Course Mapping
export const COURSES: Course[] = [
  // Science Stream Courses
  {
    id: 'btech',
    name: 'B.Tech (Bachelor of Technology)',
    stream_id: 'science',
    duration: '4 years',
    eligibility: ['12th with PCM', 'JEE Main/Advanced', 'State Engineering Exams'],
    subjects: ['Engineering Mathematics', 'Core Engineering Subjects', 'Programming', 'Project Work'],
    career_opportunities: [
      {
        title: 'Software Engineer',
        sector: 'Technology',
        description: 'Develop software applications and systems',
        salary_range: '₹4-15 LPA',
        growth_prospects: 'High',
        required_skills: ['Programming', 'Problem-solving', 'System design'],
        government_exams: ['GATE', 'UPSC Engineering Services']
      },
      {
        title: 'Data Scientist',
        sector: 'Technology/Analytics',
        description: 'Analyze data to drive business decisions',
        salary_range: '₹6-20 LPA',
        growth_prospects: 'Very High',
        required_skills: ['Statistics', 'Machine Learning', 'Programming']
      }
    ],
    higher_education_options: ['M.Tech', 'MBA', 'MS', 'PhD'],
    government_exams: ['GATE', 'UPSC Engineering Services', 'ISRO', 'DRDO'],
    private_job_sectors: ['IT', 'Manufacturing', 'Automotive', 'Aerospace', 'Telecommunications'],
    entrepreneurial_options: ['Tech Startups', 'Product Development', 'Consulting'],
    average_salary_range: '₹4-15 LPA',
    growth_prospects: 'High'
  },
  {
    id: 'mbbs',
    name: 'MBBS (Bachelor of Medicine and Bachelor of Surgery)',
    stream_id: 'science',
    duration: '5.5 years',
    eligibility: ['12th with PCB', 'NEET', 'Minimum 50% aggregate'],
    subjects: ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Medicine', 'Surgery'],
    career_opportunities: [
      {
        title: 'Doctor',
        sector: 'Healthcare',
        description: 'Diagnose and treat patients',
        salary_range: '₹8-25 LPA',
        growth_prospects: 'High',
        required_skills: ['Medical knowledge', 'Patient care', 'Diagnostic skills'],
        government_exams: ['NEET PG', 'UPSC Medical Services']
      }
    ],
    higher_education_options: ['MD', 'MS', 'DM', 'MCh'],
    government_exams: ['NEET PG', 'UPSC Medical Services', 'AIIMS', 'PGIMER'],
    private_job_sectors: ['Hospitals', 'Clinics', 'Pharmaceuticals', 'Medical Research'],
    entrepreneurial_options: ['Private Practice', 'Medical Tourism', 'Telemedicine'],
    average_salary_range: '₹8-25 LPA',
    growth_prospects: 'High'
  },
  {
    id: 'bsc',
    name: 'B.Sc (Bachelor of Science)',
    stream_id: 'science',
    duration: '3 years',
    eligibility: ['12th with Science', 'Merit-based admission'],
    subjects: ['Core Science Subjects', 'Mathematics', 'Laboratory Work', 'Research Methods'],
    career_opportunities: [
      {
        title: 'Research Scientist',
        sector: 'Research & Development',
        description: 'Conduct scientific research',
        salary_range: '₹3-12 LPA',
        growth_prospects: 'Moderate',
        required_skills: ['Research methodology', 'Analytical thinking', 'Laboratory skills'],
        government_exams: ['CSIR NET', 'GATE', 'DRDO']
      }
    ],
    higher_education_options: ['M.Sc', 'M.Tech', 'MBA', 'PhD'],
    government_exams: ['CSIR NET', 'GATE', 'DRDO', 'ISRO', 'BARC'],
    private_job_sectors: ['Research Labs', 'Pharmaceuticals', 'Agriculture', 'Environmental'],
    entrepreneurial_options: ['Scientific Consulting', 'Laboratory Services', 'Research Startups'],
    average_salary_range: '₹3-12 LPA',
    growth_prospects: 'Moderate'
  },

  // Commerce Stream Courses
  {
    id: 'bcom',
    name: 'B.Com (Bachelor of Commerce)',
    stream_id: 'commerce',
    duration: '3 years',
    eligibility: ['12th Commerce', 'Merit-based admission'],
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Computer Applications'],
    career_opportunities: [
      {
        title: 'Chartered Accountant',
        sector: 'Finance & Accounting',
        description: 'Financial auditing and consulting',
        salary_range: '₹6-20 LPA',
        growth_prospects: 'High',
        required_skills: ['Accounting', 'Taxation', 'Auditing', 'Financial analysis'],
        government_exams: ['CA Foundation', 'CA Intermediate', 'CA Final']
      },
      {
        title: 'Financial Analyst',
        sector: 'Banking & Finance',
        description: 'Analyze financial data and market trends',
        salary_range: '₹4-15 LPA',
        growth_prospects: 'High',
        required_skills: ['Financial modeling', 'Excel', 'Market analysis']
      }
    ],
    higher_education_options: ['M.Com', 'MBA', 'CA', 'CS', 'CMA'],
    government_exams: ['CA', 'CS', 'CMA', 'Banking Exams', 'UPSC Commerce'],
    private_job_sectors: ['Banking', 'Insurance', 'Consulting', 'Corporate Finance'],
    entrepreneurial_options: ['Accounting Firm', 'Financial Consulting', 'E-commerce'],
    average_salary_range: '₹3-15 LPA',
    growth_prospects: 'High'
  },
  {
    id: 'bba',
    name: 'BBA (Bachelor of Business Administration)',
    stream_id: 'commerce',
    duration: '3 years',
    eligibility: ['12th any stream', 'Entrance exams (DU JAT, IPU CET)'],
    subjects: ['Management', 'Marketing', 'Finance', 'Human Resources', 'Operations'],
    career_opportunities: [
      {
        title: 'Business Analyst',
        sector: 'Consulting',
        description: 'Analyze business processes and recommend improvements',
        salary_range: '₹4-12 LPA',
        growth_prospects: 'High',
        required_skills: ['Business analysis', 'Communication', 'Problem-solving']
      },
      {
        title: 'Marketing Manager',
        sector: 'Marketing & Sales',
        description: 'Develop and execute marketing strategies',
        salary_range: '₹5-18 LPA',
        growth_prospects: 'High',
        required_skills: ['Marketing strategy', 'Digital marketing', 'Communication']
      }
    ],
    higher_education_options: ['MBA', 'PGDM', 'MS', 'PhD'],
    government_exams: ['CAT', 'XAT', 'SNAP', 'NMAT'],
    private_job_sectors: ['Consulting', 'FMCG', 'IT', 'Banking', 'E-commerce'],
    entrepreneurial_options: ['Startups', 'Consulting', 'Franchise Business'],
    average_salary_range: '₹4-12 LPA',
    growth_prospects: 'High'
  },

  // Arts Stream Courses
  {
    id: 'ba',
    name: 'B.A (Bachelor of Arts)',
    stream_id: 'arts',
    duration: '3 years',
    eligibility: ['12th any stream', 'Merit-based admission'],
    subjects: ['Literature', 'History', 'Political Science', 'Psychology', 'Sociology'],
    career_opportunities: [
      {
        title: 'Teacher/Professor',
        sector: 'Education',
        description: 'Educate students in various subjects',
        salary_range: '₹3-10 LPA',
        growth_prospects: 'Stable',
        required_skills: ['Teaching', 'Communication', 'Subject knowledge'],
        government_exams: ['CTET', 'UGC NET', 'State TET']
      },
      {
        title: 'Content Writer',
        sector: 'Media & Communication',
        description: 'Create written content for various platforms',
        salary_range: '₹2-8 LPA',
        growth_prospects: 'High',
        required_skills: ['Writing', 'Research', 'SEO', 'Creativity']
      }
    ],
    higher_education_options: ['M.A', 'M.Ed', 'MBA', 'PhD'],
    government_exams: ['UPSC Civil Services', 'State PSC', 'UGC NET', 'CTET'],
    private_job_sectors: ['Education', 'Media', 'Publishing', 'NGOs', 'Corporate Communications'],
    entrepreneurial_options: ['Content Creation', 'Educational Services', 'Publishing'],
    average_salary_range: '₹2-8 LPA',
    growth_prospects: 'Moderate'
  },
  {
    id: 'bsw',
    name: 'B.S.W (Bachelor of Social Work)',
    stream_id: 'arts',
    duration: '3 years',
    eligibility: ['12th any stream', 'Merit-based admission'],
    subjects: ['Social Work Theory', 'Community Development', 'Psychology', 'Sociology', 'Field Work'],
    career_opportunities: [
      {
        title: 'Social Worker',
        sector: 'Social Services',
        description: 'Help individuals and communities overcome challenges',
        salary_range: '₹2-6 LPA',
        growth_prospects: 'Stable',
        required_skills: ['Empathy', 'Communication', 'Problem-solving', 'Community engagement'],
        government_exams: ['UPSC Social Work', 'State PSC', 'NGO Recruitment']
      }
    ],
    higher_education_options: ['M.S.W', 'M.A', 'PhD'],
    government_exams: ['UPSC Social Work', 'State PSC', 'NGO Exams'],
    private_job_sectors: ['NGOs', 'Government Agencies', 'Healthcare', 'Education'],
    entrepreneurial_options: ['NGO', 'Community Development', 'Social Enterprise'],
    average_salary_range: '₹2-6 LPA',
    growth_prospects: 'Stable'
  },

  // Vocational Stream Courses
  {
    id: 'diploma',
    name: 'Diploma in Engineering',
    stream_id: 'vocational',
    duration: '3 years',
    eligibility: ['10th standard', 'Polytechnic entrance exams'],
    subjects: ['Engineering Fundamentals', 'Technical Skills', 'Practical Training', 'Industry Exposure'],
    career_opportunities: [
      {
        title: 'Technician',
        sector: 'Manufacturing/Service',
        description: 'Operate and maintain technical equipment',
        salary_range: '₹2-8 LPA',
        growth_prospects: 'Moderate',
        required_skills: ['Technical skills', 'Problem-solving', 'Equipment operation'],
        government_exams: ['Railway Technician', 'PSU Technician', 'Defense Services']
      }
    ],
    higher_education_options: ['B.Tech (Lateral Entry)', 'Advanced Diploma'],
    government_exams: ['Railway Technician', 'PSU Technician', 'Defense Services'],
    private_job_sectors: ['Manufacturing', 'Automotive', 'Telecommunications', 'Power'],
    entrepreneurial_options: ['Technical Services', 'Equipment Maintenance', 'Small Manufacturing'],
    average_salary_range: '₹2-8 LPA',
    growth_prospects: 'Moderate'
  }
];

// Interest-based stream recommendation function
export function getStreamRecommendations(interests: string[], personalityTraits: string[]): Stream[] {
  const scoredStreams = STREAMS.map(stream => {
    let score = 0;
    
    // Score based on interests
    interests.forEach(interest => {
      if (stream.career_paths.some(path => path.toLowerCase().includes(interest.toLowerCase()))) {
        score += 2;
      }
      if (stream.subjects.some(subject => subject.toLowerCase().includes(interest.toLowerCase()))) {
        score += 1;
      }
    });
    
    // Score based on personality traits
    personalityTraits.forEach(trait => {
      if (stream.personality_traits.some(pt => pt.toLowerCase().includes(trait.toLowerCase()))) {
        score += 1;
      }
    });
    
    return { ...stream, score };
  });
  
  return scoredStreams
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// Get courses for a specific stream
export function getCoursesForStream(streamId: string): Course[] {
  return COURSES.filter(course => course.stream_id === streamId);
}

// Get detailed career path for a course
export function getCareerPathForCourse(courseId: string): Course | undefined {
  return COURSES.find(course => course.id === courseId);
}
