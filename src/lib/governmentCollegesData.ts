// Government Colleges Database for Indian Education System
export interface GovernmentCollege {
  id: string;
  name: string;
  type: 'Central University' | 'State University' | 'IIT' | 'NIT' | 'IIM' | 'AIIMS' | 'Government College' | 'Polytechnic';
  location: {
    city: string;
    state: string;
    district: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address: string;
  };
  courses: CollegeCourse[];
  facilities: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  established: number;
  accreditation: string[];
  ranking?: {
    nirf?: number;
    state?: number;
  };
  admission: {
    entrance_exams: string[];
    cut_off_percentages: Record<string, number>;
    application_process: string;
    important_dates: {
      application_start: string;
      application_end: string;
      exam_date?: string;
      result_date?: string;
      counseling_start?: string;
    };
  };
  fees: {
    annual_tuition: number;
    hostel_fees?: number;
    other_fees: number;
    total_annual: number;
  };
  medium_of_instruction: string[];
  student_strength: number;
  faculty_strength: number;
  placement_stats?: {
    average_package: number;
    highest_package: number;
    placement_percentage: number;
    top_recruiters: string[];
  };
}

export interface CollegeCourse {
  id: string;
  name: string;
  stream: 'Science' | 'Commerce' | 'Arts' | 'Engineering' | 'Medical' | 'Management' | 'Vocational';
  level: 'Diploma' | 'UG' | 'PG' | 'PhD';
  duration: string;
  seats: number;
  eligibility: string[];
  subjects: string[];
  fees: {
    annual: number;
    total: number;
  };
  entrance_exam?: string;
  cut_off_percentage?: number;
}

// Sample Government Colleges Data
export const GOVERNMENT_COLLEGES: GovernmentCollege[] = [
  {
    id: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    type: 'IIT',
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      district: 'South Delhi',
      coordinates: {
        latitude: 28.5454,
        longitude: 77.1920
      },
      address: 'Hauz Khas, New Delhi, Delhi 110016'
    },
    courses: [
      {
        id: 'btech-cse',
        name: 'B.Tech Computer Science and Engineering',
        stream: 'Engineering',
        level: 'UG',
        duration: '4 years',
        seats: 120,
        eligibility: ['12th with PCM', 'JEE Advanced', 'Minimum 75% aggregate'],
        subjects: ['Programming', 'Data Structures', 'Algorithms', 'Computer Networks'],
        fees: {
          annual: 250000,
          total: 1000000
        },
        entrance_exam: 'JEE Advanced',
        cut_off_percentage: 95
      },
      {
        id: 'btech-mech',
        name: 'B.Tech Mechanical Engineering',
        stream: 'Engineering',
        level: 'UG',
        duration: '4 years',
        seats: 100,
        eligibility: ['12th with PCM', 'JEE Advanced', 'Minimum 75% aggregate'],
        subjects: ['Thermodynamics', 'Machine Design', 'Manufacturing', 'CAD/CAM'],
        fees: {
          annual: 250000,
          total: 1000000
        },
        entrance_exam: 'JEE Advanced',
        cut_off_percentage: 92
      }
    ],
    facilities: [
      'Hostel Accommodation',
      'Library with 2M+ books',
      'Computer Labs',
      'Research Labs',
      'Sports Complex',
      'Medical Center',
      'Cafeteria',
      'WiFi Campus',
      'Transportation',
      'Banking Services'
    ],
    contact: {
      phone: '+91-11-2659-7135',
      email: 'info@iitd.ac.in',
      website: 'https://www.iitd.ac.in'
    },
    established: 1961,
    accreditation: ['NAAC A++', 'NBA', 'ABET'],
    ranking: {
      nirf: 2,
      state: 1
    },
    admission: {
      entrance_exams: ['JEE Advanced'],
      cut_off_percentiles: {
        'General': 95,
        'OBC': 90,
        'SC': 85,
        'ST': 80
      },
      application_process: 'Online through JEE Advanced portal',
      important_dates: {
        application_start: 'April 1, 2024',
        application_end: 'April 30, 2024',
        exam_date: 'June 2, 2024',
        result_date: 'June 15, 2024',
        counseling_start: 'June 20, 2024'
      }
    },
    fees: {
      annual_tuition: 250000,
      hostel_fees: 50000,
      other_fees: 25000,
      total_annual: 325000
    },
    medium_of_instruction: ['English', 'Hindi'],
    student_strength: 8000,
    faculty_strength: 500,
    placement_stats: {
      average_package: 1500000,
      highest_package: 5000000,
      placement_percentage: 95,
      top_recruiters: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Goldman Sachs']
    }
  },
  {
    id: 'du-delhi',
    name: 'University of Delhi',
    type: 'Central University',
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      district: 'North Delhi',
      coordinates: {
        latitude: 28.6892,
        longitude: 77.2105
      },
      address: 'Benito Juarez Marg, South Campus, New Delhi, Delhi 110021'
    },
    courses: [
      {
        id: 'bsc-physics',
        name: 'B.Sc (Hons) Physics',
        stream: 'Science',
        level: 'UG',
        duration: '3 years',
        seats: 60,
        eligibility: ['12th with PCM', 'DUET', 'Minimum 60% aggregate'],
        subjects: ['Classical Mechanics', 'Quantum Mechanics', 'Electromagnetism', 'Thermodynamics'],
        fees: {
          annual: 15000,
          total: 45000
        },
        entrance_exam: 'DUET',
        cut_off_percentage: 88
      },
      {
        id: 'bcom-hons',
        name: 'B.Com (Hons)',
        stream: 'Commerce',
        level: 'UG',
        duration: '3 years',
        seats: 80,
        eligibility: ['12th Commerce', 'DUET', 'Minimum 55% aggregate'],
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'],
        fees: {
          annual: 12000,
          total: 36000
        },
        entrance_exam: 'DUET',
        cut_off_percentage: 85
      },
      {
        id: 'ba-english',
        name: 'B.A (Hons) English',
        stream: 'Arts',
        level: 'UG',
        duration: '3 years',
        seats: 50,
        eligibility: ['12th any stream', 'DUET', 'Minimum 50% aggregate'],
        subjects: ['English Literature', 'Linguistics', 'Creative Writing', 'Critical Theory'],
        fees: {
          annual: 10000,
          total: 30000
        },
        entrance_exam: 'DUET',
        cut_off_percentage: 82
      }
    ],
    facilities: [
      'Central Library',
      'Computer Centers',
      'Laboratories',
      'Hostel (Limited)',
      'Sports Facilities',
      'Medical Center',
      'Cafeteria',
      'WiFi Campus',
      'Transportation',
      'Banking Services'
    ],
    contact: {
      phone: '+91-11-2766-7777',
      email: 'info@du.ac.in',
      website: 'https://www.du.ac.in'
    },
    established: 1922,
    accreditation: ['NAAC A++', 'UGC'],
    ranking: {
      nirf: 12,
      state: 2
    },
    admission: {
      entrance_exams: ['DUET'],
      cut_off_percentiles: {
        'General': 88,
        'OBC': 83,
        'SC': 78,
        'ST': 73
      },
      application_process: 'Online through DU admission portal',
      important_dates: {
        application_start: 'May 1, 2024',
        application_end: 'May 31, 2024',
        exam_date: 'June 15, 2024',
        result_date: 'June 30, 2024',
        counseling_start: 'July 5, 2024'
      }
    },
    fees: {
      annual_tuition: 15000,
      hostel_fees: 30000,
      other_fees: 5000,
      total_annual: 50000
    },
    medium_of_instruction: ['English', 'Hindi'],
    student_strength: 50000,
    faculty_strength: 2000,
    placement_stats: {
      average_package: 600000,
      highest_package: 2000000,
      placement_percentage: 80,
      top_recruiters: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Accenture']
    }
  },
  {
    id: 'nit-karnataka',
    name: 'National Institute of Technology Karnataka',
    type: 'NIT',
    location: {
      city: 'Surathkal',
      state: 'Karnataka',
      district: 'Dakshina Kannada',
      coordinates: {
        latitude: 13.0067,
        longitude: 74.7936
      },
      address: 'NH 66, Srinivasnagar, Surathkal, Karnataka 575025'
    },
    courses: [
      {
        id: 'btech-cse-nit',
        name: 'B.Tech Computer Science and Engineering',
        stream: 'Engineering',
        level: 'UG',
        duration: '4 years',
        seats: 90,
        eligibility: ['12th with PCM', 'JEE Main', 'Minimum 75% aggregate'],
        subjects: ['Programming', 'Data Structures', 'Algorithms', 'Database Systems'],
        fees: {
          annual: 150000,
          total: 600000
        },
        entrance_exam: 'JEE Main',
        cut_off_percentage: 90
      }
    ],
    facilities: [
      'Hostel Accommodation',
      'Central Library',
      'Computer Labs',
      'Research Labs',
      'Sports Complex',
      'Medical Center',
      'Cafeteria',
      'WiFi Campus',
      'Transportation',
      'Banking Services'
    ],
    contact: {
      phone: '+91-824-247-4000',
      email: 'info@nitk.ac.in',
      website: 'https://www.nitk.ac.in'
    },
    established: 1960,
    accreditation: ['NAAC A', 'NBA'],
    ranking: {
      nirf: 15,
      state: 3
    },
    admission: {
      entrance_exams: ['JEE Main'],
      cut_off_percentiles: {
        'General': 90,
        'OBC': 85,
        'SC': 80,
        'ST': 75
      },
      application_process: 'Online through JoSAA portal',
      important_dates: {
        application_start: 'March 1, 2024',
        application_end: 'March 31, 2024',
        exam_date: 'April 15, 2024',
        result_date: 'May 1, 2024',
        counseling_start: 'May 10, 2024'
      }
    },
    fees: {
      annual_tuition: 150000,
      hostel_fees: 40000,
      other_fees: 15000,
      total_annual: 205000
    },
    medium_of_instruction: ['English'],
    student_strength: 6000,
    faculty_strength: 300,
    placement_stats: {
      average_package: 1200000,
      highest_package: 4000000,
      placement_percentage: 90,
      top_recruiters: ['Microsoft', 'Amazon', 'Google', 'Intel', 'Oracle']
    }
  }
];

// Helper functions
export function getCollegesByState(state: string): GovernmentCollege[] {
  return GOVERNMENT_COLLEGES.filter(college => 
    college.location.state.toLowerCase() === state.toLowerCase()
  );
}

export function getCollegesByCity(city: string): GovernmentCollege[] {
  return GOVERNMENT_COLLEGES.filter(college => 
    college.location.city.toLowerCase() === city.toLowerCase()
  );
}

export function getCollegesByType(type: string): GovernmentCollege[] {
  return GOVERNMENT_COLLEGES.filter(college => 
    college.type.toLowerCase() === type.toLowerCase()
  );
}

export function getCollegesByStream(stream: string): GovernmentCollege[] {
  return GOVERNMENT_COLLEGES.filter(college => 
    college.courses.some(course => 
      course.stream.toLowerCase() === stream.toLowerCase()
    )
  );
}

export function getCollegesNearby(latitude: number, longitude: number, radiusKm: number = 50): GovernmentCollege[] {
  return GOVERNMENT_COLLEGES.filter(college => {
    const distance = calculateDistance(
      latitude, longitude,
      college.location.coordinates.latitude,
      college.location.coordinates.longitude
    );
    return distance <= radiusKm;
  });
}

export function searchColleges(query: string): GovernmentCollege[] {
  const searchTerm = query.toLowerCase();
  return GOVERNMENT_COLLEGES.filter(college => 
    college.name.toLowerCase().includes(searchTerm) ||
    college.location.city.toLowerCase().includes(searchTerm) ||
    college.location.state.toLowerCase().includes(searchTerm) ||
    college.courses.some(course => 
      course.name.toLowerCase().includes(searchTerm)
    )
  );
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Get all unique states
export function getAllStates(): string[] {
  const states = GOVERNMENT_COLLEGES.map(college => college.location.state);
  return [...new Set(states)].sort();
}

// Get all unique cities
export function getAllCities(): string[] {
  const cities = GOVERNMENT_COLLEGES.map(college => college.location.city);
  return [...new Set(cities)].sort();
}

// Get all unique college types
export function getAllCollegeTypes(): string[] {
  const types = GOVERNMENT_COLLEGES.map(college => college.type);
  return [...new Set(types)].sort();
}
