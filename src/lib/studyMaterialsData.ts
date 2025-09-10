// Study Materials and Resources Database
export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'video' | 'course' | 'practice' | 'document';
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  format: 'pdf' | 'video' | 'interactive' | 'text' | 'audio';
  duration?: string;
  rating: number;
  free: boolean;
  url: string;
  provider: string;
  topics: string[];
}

export const STUDY_MATERIALS: Record<string, StudyMaterial[]> = {
  'mathematics': [
    {
      id: 'math_001',
      title: 'Class 12 Mathematics NCERT Solutions',
      description: 'Complete solutions and explanations for NCERT Class 12 Mathematics textbook',
      type: 'document',
      subject: 'Mathematics',
      level: 'intermediate',
      format: 'pdf',
      rating: 4.8,
      free: true,
      url: 'https://ncert.nic.in/textbook/pdf/lemh101.pdf',
      provider: 'NCERT',
      topics: ['Calculus', 'Algebra', 'Geometry', 'Statistics', 'Probability']
    },
    {
      id: 'math_002',
      title: 'Khan Academy Mathematics',
      description: 'Free online mathematics courses from basic to advanced levels',
      type: 'course',
      subject: 'Mathematics',
      level: 'beginner',
      format: 'video',
      duration: '100+ hours',
      rating: 4.7,
      free: true,
      url: 'https://www.khanacademy.org/math',
      provider: 'Khan Academy',
      topics: ['Algebra', 'Calculus', 'Statistics', 'Geometry', 'Trigonometry']
    },
    {
      id: 'math_003',
      title: 'JEE Mathematics Practice Papers',
      description: 'Comprehensive practice questions and mock tests for JEE Mathematics',
      type: 'practice',
      subject: 'Mathematics',
      level: 'advanced',
      format: 'interactive',
      rating: 4.6,
      free: true,
      url: 'https://www.embibe.com/exams/jee-main/',
      provider: 'Embibe',
      topics: ['Coordinate Geometry', 'Calculus', 'Algebra', 'Trigonometry']
    }
  ],
  'physics': [
    {
      id: 'phy_001',
      title: 'NCERT Physics Class 12',
      description: 'Official NCERT textbook for Class 12 Physics with detailed concepts',
      type: 'book',
      subject: 'Physics',
      level: 'intermediate',
      format: 'pdf',
      rating: 4.7,
      free: true,
      url: 'https://ncert.nic.in/textbook/pdf/leph101.pdf',
      provider: 'NCERT',
      topics: ['Electromagnetism', 'Optics', 'Modern Physics', 'Mechanics']
    },
    {
      id: 'phy_002',
      title: 'MIT Physics I: Classical Mechanics',
      description: 'Comprehensive course on classical mechanics from MIT OpenCourseWare',
      type: 'course',
      subject: 'Physics',
      level: 'advanced',
      format: 'video',
      duration: '40 hours',
      rating: 4.9,
      free: true,
      url: 'https://ocw.mit.edu/courses/physics/',
      provider: 'MIT OpenCourseWare',
      topics: ['Kinematics', 'Dynamics', 'Energy', 'Momentum', 'Rotational Motion']
    },
    {
      id: 'phy_003',
      title: 'Physics Wallah - JEE Physics',
      description: 'Complete JEE Physics preparation videos by expert teachers',
      type: 'video',
      subject: 'Physics',
      level: 'advanced',
      format: 'video',
      duration: '200+ hours',
      rating: 4.8,
      free: true,
      url: 'https://www.youtube.com/@PhysicsWallah',
      provider: 'Physics Wallah',
      topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Modern Physics']
    }
  ],
  'chemistry': [
    {
      id: 'chem_001',
      title: 'NCERT Chemistry Class 12',
      description: 'Complete NCERT Chemistry textbook with reactions and mechanisms',
      type: 'book',
      subject: 'Chemistry',
      level: 'intermediate',
      format: 'pdf',
      rating: 4.6,
      free: true,
      url: 'https://ncert.nic.in/textbook/pdf/lech101.pdf',
      provider: 'NCERT',
      topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry']
    },
    {
      id: 'chem_002',
      title: 'Organic Chemistry - Khan Academy',
      description: 'Comprehensive organic chemistry course with practice problems',
      type: 'course',
      subject: 'Chemistry',
      level: 'intermediate',
      format: 'video',
      duration: '60 hours',
      rating: 4.7,
      free: true,
      url: 'https://www.khanacademy.org/science/organic-chemistry',
      provider: 'Khan Academy',
      topics: ['Nomenclature', 'Reactions', 'Mechanisms', 'Stereochemistry']
    }
  ],
  'biology': [
    {
      id: 'bio_001',
      title: 'NCERT Biology Class 12',
      description: 'Complete biology textbook covering all NEET and board exam topics',
      type: 'book',
      subject: 'Biology',
      level: 'intermediate',
      format: 'pdf',
      rating: 4.8,
      free: true,
      url: 'https://ncert.nic.in/textbook/pdf/lebh101.pdf',
      provider: 'NCERT',
      topics: ['Genetics', 'Evolution', 'Ecology', 'Human Physiology', 'Plant Biology']
    },
    {
      id: 'bio_002',
      title: 'Crash Course Biology',
      description: 'Engaging video series covering all major biology topics',
      type: 'video',
      subject: 'Biology',
      level: 'beginner',
      format: 'video',
      duration: '20 hours',
      rating: 4.6,
      free: true,
      url: 'https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF',
      provider: 'Crash Course',
      topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Anatomy']
    }
  ],
  'computer_science': [
    {
      id: 'cs_001',
      title: 'CS50: Introduction to Computer Science',
      description: 'Harvard\'s introduction to computer science and programming',
      type: 'course',
      subject: 'Computer Science',
      level: 'beginner',
      format: 'video',
      duration: '100 hours',
      rating: 4.9,
      free: true,
      url: 'https://cs50.harvard.edu/x/',
      provider: 'Harvard University',
      topics: ['Programming', 'Algorithms', 'Data Structures', 'Web Development']
    },
    {
      id: 'cs_002',
      title: 'Python for Everybody',
      description: 'Complete Python programming course for beginners',
      type: 'course',
      subject: 'Computer Science',
      level: 'beginner',
      format: 'video',
      duration: '50 hours',
      rating: 4.8,
      free: true,
      url: 'https://www.py4e.com/',
      provider: 'University of Michigan',
      topics: ['Python Basics', 'Data Structures', 'Web Scraping', 'Databases']
    },
    {
      id: 'cs_003',
      title: 'GeeksforGeeks DSA Course',
      description: 'Comprehensive Data Structures and Algorithms preparation',
      type: 'course',
      subject: 'Computer Science',
      level: 'intermediate',
      format: 'interactive',
      duration: '80 hours',
      rating: 4.7,
      free: true,
      url: 'https://www.geeksforgeeks.org/data-structures/',
      provider: 'GeeksforGeeks',
      topics: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Algorithms']
    }
  ],
  'english': [
    {
      id: 'eng_001',
      title: 'NCERT English Flamingo Class 12',
      description: 'Complete English literature textbook with prose and poetry',
      type: 'book',
      subject: 'English',
      level: 'intermediate',
      format: 'pdf',
      rating: 4.5,
      free: true,
      url: 'https://ncert.nic.in/textbook/pdf/keel101.pdf',
      provider: 'NCERT',
      topics: ['Literature', 'Grammar', 'Writing Skills', 'Comprehension']
    },
    {
      id: 'eng_002',
      title: 'Coursera Writing Skills',
      description: 'Improve your writing and communication skills',
      type: 'course',
      subject: 'English',
      level: 'intermediate',
      format: 'video',
      duration: '30 hours',
      rating: 4.6,
      free: false,
      url: 'https://www.coursera.org/learn/writing-skills',
      provider: 'Coursera',
      topics: ['Academic Writing', 'Grammar', 'Essay Writing', 'Communication']
    }
  ],
  'social_science': [
    {
      id: 'ss_001',
      title: 'NCERT History Class 12',
      description: 'Indian history from ancient to modern times',
      type: 'book',
      subject: 'History',
      level: 'intermediate',
      format: 'pdf',
      rating: 4.4,
      free: true,
      url: 'https://ncert.nic.in/textbook/pdf/lehs101.pdf',
      provider: 'NCERT',
      topics: ['Ancient History', 'Medieval History', 'Modern History', 'World History']
    },
    {
      id: 'ss_002',
      title: 'Political Science NCERT',
      description: 'Understanding political concepts and Indian polity',
      type: 'book',
      subject: 'Political Science',
      level: 'intermediate',
      format: 'pdf',
      rating: 4.5,
      free: true,
      url: 'https://ncert.nic.in/textbook/pdf/leps101.pdf',
      provider: 'NCERT',
      topics: ['Constitution', 'Political Theory', 'Indian Government', 'International Relations']
    }
  ]
};

export const SKILL_DEVELOPMENT_RESOURCES: StudyMaterial[] = [
  {
    id: 'skill_001',
    title: 'Digital Marketing Course',
    description: 'Learn digital marketing fundamentals and advanced strategies',
    type: 'course',
    subject: 'Digital Marketing',
    level: 'beginner',
    format: 'video',
    duration: '40 hours',
    rating: 4.7,
    free: true,
    url: 'https://learndigital.withgoogle.com/digitalgarage',
    provider: 'Google Digital Garage',
    topics: ['SEO', 'Social Media Marketing', 'Content Marketing', 'Analytics']
  },
  {
    id: 'skill_002',
    title: 'Excel Skills for Business',
    description: 'Master Excel for data analysis and business applications',
    type: 'course',
    subject: 'Excel',
    level: 'intermediate',
    format: 'video',
    duration: '25 hours',
    rating: 4.8,
    free: false,
    url: 'https://www.coursera.org/specializations/excel',
    provider: 'Coursera',
    topics: ['Formulas', 'Data Analysis', 'Charts', 'Pivot Tables']
  },
  {
    id: 'skill_003',
    title: 'Public Speaking Course',
    description: 'Develop confidence and skills in public speaking and presentations',
    type: 'course',
    subject: 'Communication',
    level: 'beginner',
    format: 'video',
    duration: '15 hours',
    rating: 4.6,
    free: true,
    url: 'https://www.toastmasters.org/',
    provider: 'Toastmasters International',
    topics: ['Presentation Skills', 'Confidence Building', 'Voice Modulation', 'Body Language']
  }
];

// Function to get study materials based on career recommendations
export function getStudyMaterialsForCareer(careerTitle: string): StudyMaterial[] {
  const materials: StudyMaterial[] = [];
  
  // Map careers to relevant subjects
  const careerSubjectMap: Record<string, string[]> = {
    'Software Engineer': ['computer_science', 'mathematics'],
    'Data Scientist': ['mathematics', 'computer_science', 'physics'],
    'Doctor': ['biology', 'chemistry', 'physics'],
    'Research Scientist': ['physics', 'chemistry', 'biology', 'mathematics'],
    'Business Analyst': ['mathematics', 'english', 'computer_science'],
    'Marketing Manager': ['english', 'social_science'],
    'Graphic Designer': ['computer_science'],
    'Teacher': ['english', 'social_science'],
    'Engineer': ['mathematics', 'physics', 'chemistry'],
    'Nurse': ['biology', 'chemistry']
  };
  
  // Get relevant subjects for the career
  const subjects = careerSubjectMap[careerTitle] || ['computer_science', 'english'];
  
  // Collect materials from relevant subjects
  subjects.forEach(subject => {
    if (STUDY_MATERIALS[subject]) {
      materials.push(...STUDY_MATERIALS[subject].slice(0, 2)); // Get top 2 materials per subject
    }
  });
  
  // Add skill development resources
  materials.push(...SKILL_DEVELOPMENT_RESOURCES.slice(0, 2));
  
  return materials;
}

// Function to get materials by subject
export function getStudyMaterialsBySubject(subject: string): StudyMaterial[] {
  return STUDY_MATERIALS[subject.toLowerCase()] || [];
}

// Function to get free study materials only
export function getFreeStudyMaterials(): StudyMaterial[] {
  const allMaterials: StudyMaterial[] = [];
  
  Object.values(STUDY_MATERIALS).forEach(materials => {
    allMaterials.push(...materials.filter(material => material.free));
  });
  
  allMaterials.push(...SKILL_DEVELOPMENT_RESOURCES.filter(material => material.free));
  
  return allMaterials.sort((a, b) => b.rating - a.rating);
}

// Function to search study materials
export function searchStudyMaterials(query: string): StudyMaterial[] {
  const allMaterials: StudyMaterial[] = [];
  
  Object.values(STUDY_MATERIALS).forEach(materials => {
    allMaterials.push(...materials);
  });
  
  allMaterials.push(...SKILL_DEVELOPMENT_RESOURCES);
  
  const searchTerm = query.toLowerCase();
  
  return allMaterials.filter(material => 
    material.title.toLowerCase().includes(searchTerm) ||
    material.description.toLowerCase().includes(searchTerm) ||
    material.subject.toLowerCase().includes(searchTerm) ||
    material.topics.some(topic => topic.toLowerCase().includes(searchTerm))
  );
}