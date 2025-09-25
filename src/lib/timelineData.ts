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

// Comprehensive Timeline Events Database for 2025-2026 Academic Year
export const TIMELINE_EVENTS: TimelineEvent[] = [
  // 🧪 DEMO EVENT - Test Notifications Immediately
  {
    id: 'demo-notification-test',
    title: '🧪 DEMO: Notification Test Event',
    description: 'Subscribe to this event to receive immediate demo notifications! Perfect for testing the notification system.',
    type: 'exam',
    category: 'general',
    priority: 'high',
    dates: {
      start: '2025-09-22',
      end: '2025-09-23',
      exam_date: '2025-09-25',
      result_date: '2025-09-26'
    },
    eligibility: ['Anyone can subscribe for testing', 'No requirements'],
    application_process: 'This is a demo event for notification testing',
    fees: {
      application_fee: 0,
      currency: 'INR'
    },
    documents_required: ['No documents required - Demo only'],
    website: '/timeline-tracker',
    contact: {
      phone: 'Demo Event',
      email: 'demo@edvise.com'
    },
    related_exams: [],
    related_colleges: ['Demo College'],
    notification_settings: {
      reminder_days: [0], // Immediate notification
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-09-22T05:51:00Z',
    updated_at: '2025-09-22T05:51:00Z'
  },
  
  // ⚠️ URGENT - Closing Soon (September 2025)
  {
    id: 'iit-jam-2025',
    title: 'IIT JAM 2025 (Closing Soon!)',
    description: 'Joint Admission Test for M.Sc. Programs at IITs - Application deadline approaching',
    type: 'exam',
    category: 'engineering',
    priority: 'high',
    dates: {
      start: '2025-09-03',
      end: '2025-09-26',
      exam_date: '2026-02-02',
      result_date: '2026-03-19'
    },
    eligibility: ['BSc/BTech degree or final year student', 'Subject-specific requirements'],
    application_process: 'Online through IIT JAM portal',
    fees: {
      application_fee: 1950,
      late_fee: 2450,
      currency: 'INR'
    },
    documents_required: ['Degree certificate/Provisional', 'Photograph', 'Signature'],
    website: 'https://jam.iitm.ac.in',
    contact: {
      phone: '044-2257-4801',
      email: 'jam@iitm.ac.in'
    },
    related_exams: [],
    related_colleges: ['IITs', 'IISc', 'NITs'],
    notification_settings: {
      reminder_days: [7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'cat-2025',
    title: 'CAT 2025 (Last Few Days!)',
    description: 'Common Admission Test for IIMs - Registration ending very soon',
    type: 'exam',
    category: 'commerce',
    priority: 'high',
    dates: {
      start: '2025-08-01',
      end: '2025-09-25',
      exam_date: '2025-11-24',
      result_date: '2026-01-05'
    },
    eligibility: ['Bachelor degree (50% for General, 45% for reserved)', 'Final year students eligible'],
    application_process: 'Online through IIM CAT portal',
    fees: {
      application_fee: 2400,
      currency: 'INR'
    },
    documents_required: ['Degree certificate', 'Photograph', 'Signature', 'Category certificate'],
    website: 'https://iimcat.ac.in',
    contact: {
      phone: '1800-572-0001',
      email: 'info@iimcat.ac.in'
    },
    related_exams: ['XAT', 'SNAP', 'NMAT'],
    related_colleges: ['IIMs', 'Top B-Schools'],
    notification_settings: {
      reminder_days: [3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-07-15T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'jee-main-2026-session1',
    title: 'JEE Main 2026 - Session 1',
    description: 'Joint Entrance Examination for admission to NITs, IIITs, and other engineering colleges for 2026 admissions',
    type: 'exam',
    category: 'engineering',
    priority: 'high',
    dates: {
      start: '2025-09-15',
      end: '2025-10-31',
      exam_date: '2026-01-24',
      result_date: '2026-02-12'
    },
    eligibility: ['12th with PCM', 'Minimum 75% aggregate', 'Age limit: 25 years'],
    application_process: 'Online application through NTA website',
    fees: {
      application_fee: 1050,
      late_fee: 2100,
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
    status: 'active',
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'neet-2026',
    title: 'NEET 2026',
    description: 'National Eligibility cum Entrance Test for medical and dental courses for 2026 admissions',
    type: 'exam',
    category: 'medical',
    priority: 'high',
    dates: {
      start: '2025-10-01',
      end: '2025-11-30',
      exam_date: '2026-05-03',
      result_date: '2026-06-14'
    },
    eligibility: ['12th with PCB', 'Minimum 50% aggregate', 'Age limit: 17-25 years'],
    application_process: 'Online application through NTA website',
    fees: {
      application_fee: 1750,
      late_fee: 3500,
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
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'cuet-ug-2026',
    title: 'CUET-UG 2026',
    description: 'Common University Entrance Test for Undergraduate admissions to Central Universities',
    type: 'exam',
    category: 'general',
    priority: 'high',
    dates: {
      start: '2025-09-20',
      end: '2025-10-25',
      exam_date: '2026-04-15',
      result_date: '2026-05-31'
    },
    eligibility: ['12th in any stream', 'Minimum 50% aggregate for general category'],
    application_process: 'Online application through NTA CUET portal',
    fees: {
      application_fee: 800,
      late_fee: 1600,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Photograph', 'Signature', 'Category certificate'],
    website: 'https://cuet.nta.nic.in',
    contact: {
      phone: '0120-6895200',
      email: 'cuet@nta.ac.in'
    },
    related_exams: [],
    related_colleges: ['Delhi University', 'JNU', 'BHU', 'Central Universities'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'gate-2026',
    title: 'GATE 2026',
    description: 'Graduate Aptitude Test in Engineering for M.Tech admissions and PSU recruitment',
    type: 'exam',
    category: 'engineering',
    priority: 'medium',
    dates: {
      start: '2025-08-30',
      end: '2025-10-07',
      exam_date: '2026-02-01',
      result_date: '2026-03-16'
    },
    eligibility: ['BTech/BE degree or final year student'],
    application_process: 'Online application through GATE portal',
    fees: {
      application_fee: 1850,
      late_fee: 2350,
      currency: 'INR'
    },
    documents_required: ['BTech certificate/Provisional', 'Photograph', 'Signature'],
    website: 'https://gate.iitd.ac.in',
    contact: {
      phone: '011-26582090',
      email: 'gate@iitd.ac.in'
    },
    related_exams: [],
    related_colleges: ['IITs', 'IIITs', 'NITs', 'PSUs'],
    notification_settings: {
      reminder_days: [15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'closed',
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-10-08T00:00:00Z'
  },
  {
    id: 'jee-main-2026-session2',
    title: 'JEE Main 2026 - Session 2',
    description: 'Joint Entrance Examination for admission to NITs, IIITs, and other engineering colleges for 2026 admissions',
    type: 'exam',
    category: 'engineering',
    priority: 'high',
    dates: {
      start: '2026-01-15',
      end: '2026-02-28',
      exam_date: '2026-04-10',
      result_date: '2026-04-30'
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
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 'jee-advanced-2025',
    title: 'JEE Advanced 2025',
    description: 'Advanced level examination for admission to IITs',
    type: 'exam',
    category: 'engineering',
    priority: 'high',
    dates: {
      start: '2025-05-01',
      end: '2025-05-15',
      exam_date: '2025-06-01',
      result_date: '2025-06-15'
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
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },

  // Medical Entrance Exams
  {
    id: 'neet-2025',
    title: 'NEET 2025',
    description: 'National Eligibility cum Entrance Test for medical and dental courses',
    type: 'exam',
    category: 'medical',
    priority: 'high',
    dates: {
      start: '2024-12-01',
      end: '2025-01-31',
      exam_date: '2025-05-04',
      result_date: '2025-06-14'
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
    status: 'active',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },

  // University Admissions
  {
    id: 'du-admission-2025',
    title: 'Delhi University Admission 2025',
    description: 'Admission to undergraduate courses at University of Delhi',
    type: 'admission',
    category: 'general',
    priority: 'high',
    dates: {
      start: '2025-05-01',
      end: '2025-05-31',
      exam_date: '2025-06-15',
      result_date: '2025-06-30',
      counseling_start: '2025-07-05',
      counseling_end: '2025-08-15'
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
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },

  // State Entrance Exams - Currently Active
  {
    id: 'mht-cet-2026',
    title: 'MHT CET 2026',
    description: 'Maharashtra Common Entrance Test for Engineering and Pharmacy admissions for 2026',
    type: 'exam',
    category: 'engineering',
    priority: 'high',
    dates: {
      start: '2025-09-01',
      end: '2025-10-15',
      exam_date: '2026-05-10',
      result_date: '2026-06-05',
      counseling_start: '2026-07-01',
      counseling_end: '2026-08-31'
    },
    eligibility: ['12th with PCM', 'Domicile of Maharashtra', 'Age limit: 25 years'],
    application_process: 'Online through DTE Maharashtra website',
    fees: {
      application_fee: 850,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Domicile certificate', 'Photograph'],
    website: 'https://cetcell.mahacet.org',
    contact: {
      phone: '020-25501982',
      email: 'help@mahacet.org'
    },
    related_exams: ['JEE Main'],
    related_colleges: ['Maharashtra Engineering Colleges'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'kcet-2026',
    title: 'KCET 2026',
    description: 'Karnataka Common Entrance Test for Engineering, Medical and Dental admissions',
    type: 'exam',
    category: 'engineering',
    priority: 'medium',
    dates: {
      start: '2025-09-25',
      end: '2025-11-10',
      exam_date: '2026-04-28',
      result_date: '2026-05-25',
      counseling_start: '2026-06-15',
      counseling_end: '2026-08-15'
    },
    eligibility: ['12th with PCM/PCB', 'Domicile of Karnataka', 'Age limit: 25 years'],
    application_process: 'Online through KEA website',
    fees: {
      application_fee: 650,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Domicile certificate', 'Caste certificate'],
    website: 'https://kea.kar.nic.in',
    contact: {
      phone: '080-22440675',
      email: 'info@kea.kar.nic.in'
    },
    related_exams: ['COMEDK'],
    related_colleges: ['Karnataka Engineering Colleges'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'ap-eamcet-2026',
    title: 'AP EAMCET 2026',
    description: 'Maharashtra Common Entrance Test for Engineering and Pharmacy admissions',
    type: 'exam',
    category: 'engineering',
    priority: 'medium',
    dates: {
      start: '2025-01-15',
      end: '2025-03-31',
      exam_date: '2025-05-15',
      result_date: '2025-06-10',
      counseling_start: '2025-07-01',
      counseling_end: '2025-08-31'
    },
    eligibility: ['12th with PCM', 'Domicile of Maharashtra', 'Age limit: 25 years'],
    application_process: 'Online through DTE Maharashtra website',
    fees: {
      application_fee: 800,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Domicile certificate', 'Photograph'],
    website: 'https://cetcell.mahacet.org',
    contact: {
      phone: '020-25501982',
      email: 'help@mahacet.org'
    },
    related_exams: ['JEE Main'],
    related_colleges: ['Maharashtra Engineering Colleges'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 'josaa-counseling-2025',
    title: 'JoSAA Counselling 2025',
    description: 'Joint Seat Allocation Authority counselling for IITs, NITs, IIITs admission',
    type: 'counseling',
    category: 'engineering',
    priority: 'high',
    dates: {
      start: '2025-06-20',
      end: '2025-08-15',
      counseling_start: '2025-06-20',
      counseling_end: '2025-08-15'
    },
    eligibility: ['JEE Main/Advanced qualified', 'Valid rank in respective exams'],
    application_process: 'Online registration through JoSAA portal',
    fees: {
      application_fee: 2000,
      currency: 'INR'
    },
    documents_required: ['JEE scorecard', 'Class 12 certificate', 'Category certificate'],
    website: 'https://josaa.nic.in',
    contact: {
      phone: '011-23581748',
      email: 'helpdesk@josaa.nic.in'
    },
    related_exams: ['JEE Main', 'JEE Advanced'],
    related_colleges: ['IITs', 'NITs', 'IIITs'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },

  // Current Active Scholarships for 2025-2026
  {
    id: 'central-sector-scholarship-2025-26',
    title: 'Central Sector Scholarship 2025-26',
    description: 'Merit-based scholarship for Class 12 toppers pursuing higher education',
    type: 'scholarship',
    category: 'general',
    priority: 'high',
    dates: {
      start: '2025-09-01',
      end: '2025-10-31'
    },
    eligibility: ['Top 20% in Class 12', 'Family income below 8 LPA', 'Admitted to recognized college'],
    application_process: 'Online through National Scholarship Portal',
    fees: {
      application_fee: 0,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Income certificate', 'Admission proof', 'Bank details'],
    website: 'https://scholarships.gov.in',
    contact: {
      phone: '0120-6619540',
      email: 'helpdesk@scholarships.gov.in'
    },
    related_exams: [],
    related_colleges: ['All recognized colleges and universities'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-08-15T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'nsp-fresh-2025-26',
    title: 'NSP Fresh Applications 2025-26',
    description: 'National Scholarship Portal - Fresh applications for various government scholarships',
    type: 'scholarship',
    category: 'general',
    priority: 'high',
    dates: {
      start: '2025-09-10',
      end: '2025-10-25'
    },
    eligibility: ['Students from Class 1 to PhD', 'Income criteria varies by scheme'],
    application_process: 'Online through National Scholarship Portal',
    fees: {
      application_fee: 0,
      currency: 'INR'
    },
    documents_required: ['Student ID', 'Aadhaar card', 'Income certificate', 'Bank details'],
    website: 'https://scholarships.gov.in',
    contact: {
      phone: '0120-6619540',
      email: 'helpdesk@scholarships.gov.in'
    },
    related_exams: [],
    related_colleges: ['All recognized institutions'],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'inspire-scholarship-2025',
    title: 'INSPIRE Scholarship 2025',
    description: 'Department of Science & Technology scholarship for students pursuing science courses',
    type: 'scholarship',
    category: 'general',
    priority: 'high',
    dates: {
      start: '2024-12-15',
      end: '2025-01-31'
    },
    eligibility: ['Top 1% in Class 12 Science', 'Pursuing BSc/BTech/Integrated MSc'],
    application_process: 'Online through INSPIRE portal',
    fees: {
      application_fee: 0,
      currency: 'INR'
    },
    documents_required: ['Class 12 mark sheet', 'Admission letter', 'Bank details', 'Aadhaar'],
    website: 'https://online-inspire.gov.in',
    contact: {
      phone: '011-26590370',
      email: 'inspire@nic.in'
    },
    related_exams: [],
    related_colleges: ['Science colleges'],
    notification_settings: {
      reminder_days: [15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 'pm-scholarship-2025',
    title: 'PM Scholarship for Single Girl Child 2025',
    description: 'Special scholarship for single girl children pursuing higher education',
    type: 'scholarship',
    category: 'general',
    priority: 'medium',
    dates: {
      start: '2025-06-01',
      end: '2025-07-31'
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
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },

  // Current Government Job Exams for 2025-2026
  {
    id: 'ssc-cgl-2025',
    title: 'SSC CGL 2025',
    description: 'Staff Selection Commission Combined Graduate Level Examination - Tier 1',
    type: 'exam',
    category: 'government',
    priority: 'high',
    dates: {
      start: '2025-09-05',
      end: '2025-10-14',
      exam_date: '2025-09-09',
      result_date: '2025-10-05'
    },
    eligibility: ['Bachelor degree from recognized university', 'Age limit: 18-32 years'],
    application_process: 'Online through SSC website',
    fees: {
      application_fee: 100,
      currency: 'INR'
    },
    documents_required: ['Graduation certificate', 'Age proof', 'Caste certificate if applicable'],
    website: 'https://ssc.nic.in',
    contact: {
      phone: '011-24364229',
      email: 'sscnic@nic.in'
    },
    related_exams: ['SSC CHSL', 'SSC MTS'],
    related_colleges: [],
    notification_settings: {
      reminder_days: [15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'active',
    created_at: '2025-08-15T00:00:00Z',
    updated_at: '2025-09-22T00:00:00Z'
  },
  {
    id: 'upsc-cse-2026',
    title: 'UPSC Civil Services Examination 2026',
    description: 'Preliminary examination for Civil Services - 2026 cycle',
    type: 'exam',
    category: 'government',
    priority: 'high',
    dates: {
      start: '2026-02-01',
      end: '2026-03-10',
      exam_date: '2026-05-24',
      result_date: '2026-06-15'
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
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 'ssc-cgl-2025',
    title: 'SSC CGL 2025',
    description: 'Staff Selection Commission Combined Graduate Level Examination',
    type: 'exam',
    category: 'government',
    priority: 'high',
    dates: {
      start: '2025-03-01',
      end: '2025-04-30',
      exam_date: '2025-06-14',
      result_date: '2025-07-31'
    },
    eligibility: ['Bachelor degree from recognized university', 'Age limit: 18-27 years'],
    application_process: 'Online through SSC website',
    fees: {
      application_fee: 100,
      currency: 'INR'
    },
    documents_required: ['Graduation certificate', 'Age proof', 'Caste certificate if applicable'],
    website: 'https://ssc.nic.in',
    contact: {
      phone: '011-24364229',
      email: 'sscnic@nic.in'
    },
    related_exams: ['SSC CHSL', 'SSC MTS'],
    related_colleges: [],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },

  // Banking Exams - 2025
  {
    id: 'ibps-po-2025',
    title: 'IBPS PO 2025',
    description: 'Probationary Officer recruitment in public sector banks',
    type: 'exam',
    category: 'government',
    priority: 'medium',
    dates: {
      start: '2025-08-01',
      end: '2025-08-31',
      exam_date: '2025-10-15',
      result_date: '2025-11-15'
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
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 'sbi-po-2025',
    title: 'SBI PO 2025',
    description: 'State Bank of India Probationary Officer recruitment',
    type: 'exam',
    category: 'government',
    priority: 'high',
    dates: {
      start: '2025-04-01',
      end: '2025-04-30',
      exam_date: '2025-06-21',
      result_date: '2025-07-15'
    },
    eligibility: ['Graduation in any stream', 'Age limit: 21-30 years'],
    application_process: 'Online through SBI website',
    fees: {
      application_fee: 750,
      currency: 'INR'
    },
    documents_required: ['Graduation certificate', 'Photograph', 'Signature', 'Caste certificate'],
    website: 'https://sbi.co.in/careers',
    contact: {
      phone: '1800-11-2211',
      email: 'careers@sbi.co.in'
    },
    related_exams: ['SBI Clerk', 'SBI SO'],
    related_colleges: [],
    notification_settings: {
      reminder_days: [30, 15, 7, 3, 1],
      push_notifications: true,
      email_notifications: true
    },
    status: 'upcoming',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
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


