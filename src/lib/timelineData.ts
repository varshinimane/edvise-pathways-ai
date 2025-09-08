// Timeline Tracker Data for Indian Education System
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  type: 'admission' | 'scholarship' | 'exam' | 'counseling' | 'result' | 'deadline';
  category: 'engineering' | 'medical' | 'commerce' | 'arts' | 'general' | 'government';
  priority: 'high' | 'medium' | 'low';
  dates: {
    start: string;
    end: string;
    exam_date?: string;
    result_date?: string;
    counseling_start?: string;
    counseling_end?: string;
  };
  eligibility: string[];
  application_process: string;
  fees: {
    application_fee: number;
    late_fee?: number;
    currency: string;
  };
  documents_required: string[];
  website: string;
  contact: {
    phone?: string;
    email?: string;
    helpline?: string;
  };
  related_exams?: string[];
  related_colleges?: string[];
  notification_settings: {
    reminder_days: number[];
    push_notifications: boolean;
    email_notifications: boolean;
  };
  status: 'upcoming' | 'active' | 'closed' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface UserTimelineSubscription {
  id: string;
  user_id: string;
  event_id: string;
  subscribed_at: string;
  notification_preferences: {
    push: boolean;
    email: boolean;
    sms: boolean;
    reminder_days: number[];
  };
  status: 'active' | 'paused' | 'cancelled';
}

// Comprehensive Timeline Events Database
export const TIMELINE_EVENTS: TimelineEvent[] = [
  // Engineering Entrance Exams
  {
    id: 'jee-main-2024',
    title: 'JEE Main 2024 - Session 2',
    description: 'Joint Entrance Examination for admission to NITs, IIITs, and other engineering colleges',
    type: 'exam',
    category: 'engineering',
    priority: 'high',
    dates: {
      start: '2024-02-01',
      end: '2024-03-31',
      exam_date: '2024-04-15',
      result_date: '2024-05-01'
    },
    eligibility: ['12th with PCM', 'Minimum 75% aggregate', 'Age limit: 25 years'],
    application_process: 'Online application through NTA website',
    fees: {
      application_fee: 1000,
      late_fee: 2000,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Photograph', 'Signature', 'Category certificate'],
    website: 'https://jeemain.nta.ac.in',
    contact: {
      phone: '0120-6895200',
      email: 'jeemain@nta.ac.in',
      helpline: '1800-11-0034'
    },
    related_exams: ['JEE Advanced'],
    related_colleges: ['NITs', 'IIITs', 'GFTIs'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'jee-advanced-2024',
    title: 'JEE Advanced 2024',
    description: 'Advanced level examination for admission to IITs',
    type: 'exam',
    category: 'engineering',
    priority: 'high',
    dates: {
      start: '2024-05-01',
      end: '2024-05-15',
      exam_date: '2024-06-02',
      result_date: '2024-06-15'
    },
    eligibility: ['JEE Main qualified', 'Top 2.5 lakh rank holders'],
    application_process: 'Online through JEE Advanced portal',
    fees: {
      application_fee: 2800,
      currency: 'INR'
    },
    documents_required: ['JEE Main scorecard', 'Class 12 certificate', 'Photograph'],
    website: 'https://jeeadv.ac.in',
    contact: {
      phone: '011-2659-1755',
      email: 'jeeadv@iitd.ac.in'
    },
    related_exams: ['JEE Main'],
    related_colleges: ['IITs'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Medical Entrance Exams
  {
    id: 'neet-2024',
    title: 'NEET 2024',
    description: 'National Eligibility cum Entrance Test for medical and dental courses',
    type: 'exam',
    category: 'medical',
    priority: 'high',
    dates: {
      start: '2024-03-01',
      end: '2024-04-15',
      exam_date: '2024-05-05',
      result_date: '2024-06-14'
    },
    eligibility: ['12th with PCB', 'Minimum 50% aggregate', 'Age limit: 17-25 years'],
    application_process: 'Online application through NTA website',
    fees: {
      application_fee: 1700,
      late_fee: 3400,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Aadhaar card', 'Photograph', 'Signature'],
    website: 'https://neet.nta.nic.in',
    contact: {
      phone: '0120-6895200',
      email: 'neet@nta.ac.in'
    },
    related_exams: ['AIIMS', 'JIPMER'],
    related_colleges: ['Medical Colleges', 'Dental Colleges'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // University Admissions
  {
    id: 'du-admission-2024',
    title: 'Delhi University Admission 2024',
    description: 'Admission to undergraduate courses at University of Delhi',
    type: 'admission',
    category: 'general',
    priority: 'high',
    dates: {
      start: '2024-05-01',
      end: '2024-05-31',
      exam_date: '2024-06-15',
      result_date: '2024-06-30',
      counseling_start: '2024-07-05',
      counseling_end: '2024-08-15'
    },
    eligibility: ['12th any stream', 'Minimum 50% aggregate'],
    application_process: 'Online through DU admission portal',
    fees: {
      application_fee: 750,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Photograph', 'Signature', 'Category certificate'],
    website: 'https://admission.uod.ac.in',
    contact: {
      phone: '011-2766-7777',
      email: 'admission@du.ac.in'
    },
    related_exams: ['DUET'],
    related_colleges: ['Delhi University Colleges'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Scholarships
  {
    id: 'merit-scholarship-2024',
    title: 'Central Sector Scholarship 2024',
    description: 'Merit-based scholarship for students pursuing higher education',
    type: 'scholarship',
    category: 'general',
    priority: 'medium',
    dates: {
      start: '2024-07-01',
      end: '2024-08-31'
    },
    eligibility: ['12th with 80% marks', 'Family income below 8 LPA', 'Admitted to recognized college'],
    application_process: 'Online through National Scholarship Portal',
    fees: {
      application_fee: 0,
      currency: 'INR'
    },
    documents_required: ['Income certificate', 'Mark sheets', 'Admission proof', 'Bank details'],
    website: 'https://scholarships.gov.in',
    contact: {
      phone: '0120-6619540',
      email: 'helpdesk@scholarships.gov.in'
    },
    related_exams: [],
    related_colleges: ['All recognized colleges'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'pm-scholarship-2024',
    title: 'PM Scholarship for Single Girl Child 2024',
    description: 'Special scholarship for single girl children pursuing higher education',
    type: 'scholarship',
    category: 'general',
    priority: 'medium',
    dates: {
      start: '2024-06-01',
      end: '2024-07-31'
    },
    eligibility: ['Single girl child', '12th with 60% marks', 'Admitted to recognized college'],
    application_process: 'Online through National Scholarship Portal',
    fees: {
      application_fee: 0,
      currency: 'INR'
    },
    documents_required: ['Single girl child certificate', 'Mark sheets', 'Admission proof'],
    website: 'https://scholarships.gov.in',
    contact: {
      phone: '0120-6619540',
      email: 'helpdesk@scholarships.gov.in'
    },
    related_exams: [],
    related_colleges: ['All recognized colleges'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Government Job Exams
  {
    id: 'upsc-cse-2024',
    title: 'UPSC Civil Services Examination 2024',
    description: 'Preliminary examination for Civil Services',
    type: 'exam',
    category: 'government',
    priority: 'high',
    dates: {
      start: '2024-02-14',
      end: '2024-03-05',
      exam_date: '2024-05-26',
      result_date: '2024-06-12'
    },
    eligibility: ['Graduation in any stream', 'Age limit: 21-32 years', 'Indian citizen'],
    application_process: 'Online through UPSC website',
    fees: {
      application_fee: 100,
      currency: 'INR'
    },
    documents_required: ['Graduation certificate', 'Photograph', 'Signature', 'Category certificate'],
    website: 'https://upsc.gov.in',
    contact: {
      phone: '011-23098543',
      email: 'upsc@nic.in'
    },
    related_exams: ['UPSC Mains', 'UPSC Interview'],
    related_colleges: [],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Banking Exams
  {
    id: 'ibps-po-2024',
    title: 'IBPS PO 2024',
    description: 'Probationary Officer recruitment in public sector banks',
    type: 'exam',
    category: 'government',
    priority: 'medium',
    dates: {
      start: '2024-08-01',
      end: '2024-08-31',
      exam_date: '2024-10-15',
      result_date: '2024-11-15'
    },
    eligibility: ['Graduation in any stream', 'Age limit: 20-30 years'],
    application_process: 'Online through IBPS website',
    fees: {
      application_fee: 850,
      currency: 'INR'
    },
    documents_required: ['Graduation certificate', 'Photograph', 'Signature'],
    website: 'https://ibps.in',
    contact: {
      phone: '022-2278-0000',
      email: 'ibps@ibps.in'
    },
    related_exams: ['IBPS Clerk', 'IBPS SO'],
    related_colleges: [],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Helper functions for timeline management
export function getUpcomingEvents(days: number = 30): TimelineEvent[] {
  const today = new Date();
  const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return TIMELINE_EVENTS.filter(event => {
    const eventDate = new Date(event.dates.start);
    return eventDate >= today && eventDate <= futureDate && event.status === 'upcoming';
  }).sort((a, b) => new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime());
}

export function getEventsByType(type: string): TimelineEvent[] {
  return TIMELINE_EVENTS.filter(event => event.type === type);
}

export function getEventsByCategory(category: string): TimelineEvent[] {
  return TIMELINE_EVENTS.filter(event => event.category === category);
}

export function getHighPriorityEvents(): TimelineEvent[] {
  return TIMELINE_EVENTS.filter(event => event.priority === 'high' && event.status === 'upcoming');
}

export function getActiveEvents(): TimelineEvent[] {
  const today = new Date();
  return TIMELINE_EVENTS.filter(event => {
    const startDate = new Date(event.dates.start);
    const endDate = new Date(event.dates.end);
    return startDate <= today && endDate >= today && event.status === 'active';
  });
}

export function searchEvents(query: string): TimelineEvent[] {
  const searchTerm = query.toLowerCase();
  return TIMELINE_EVENTS.filter(event => 
    event.title.toLowerCase().includes(searchTerm) ||
    event.description.toLowerCase().includes(searchTerm) ||
    event.category.toLowerCase().includes(searchTerm) ||
    event.type.toLowerCase().includes(searchTerm)
  );
}

export function getEventsByDateRange(startDate: string, endDate: string): TimelineEvent[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return TIMELINE_EVENTS.filter(event => {
    const eventStart = new Date(event.dates.start);
    const eventEnd = new Date(event.dates.end);
    return (eventStart >= start && eventStart <= end) || 
           (eventEnd >= start && eventEnd <= end) ||
           (eventStart <= start && eventEnd >= end);
  });
}

// Notification helper functions
export function getEventsNeedingReminder(days: number[]): TimelineEvent[] {
  const today = new Date();
  const events: TimelineEvent[] = [];
  
  TIMELINE_EVENTS.forEach(event => {
    const eventDate = new Date(event.dates.start);
    const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days.includes(daysUntilEvent) && event.status === 'upcoming') {
      events.push(event);
    }
  });
  
  return events;
}

export function getEventById(id: string): TimelineEvent | undefined {
  return TIMELINE_EVENTS.find(event => event.id === id);
}

// Get all unique categories
export function getAllCategories(): string[] {
  const categories = TIMELINE_EVENTS.map(event => event.category);
  return [...new Set(categories)].sort();
}

// Get all unique types
export function getAllTypes(): string[] {
  const types = TIMELINE_EVENTS.map(event => event.type);
  return [...new Set(types)].sort();
}


