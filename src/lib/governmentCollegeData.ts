// src/lib/governmentCollegeData.ts - Preloaded government college dataset
import { offlineStorage, CollegeData } from './offlineStorage';

// Preloaded government college data (sample from UGC/AISHE dataset)
const GOVERNMENT_COLLEGES: CollegeData[] = [
  // IITs
  {
    id: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    college_type: 'Engineering',
    ranking: 2,
    courses_offered: ['B.Tech', 'M.Tech', 'Ph.D', 'MBA'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Research Labs'],
    fees_range: '₹2-3 Lakhs/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai',
    state: 'Maharashtra',
    city: 'Mumbai',
    college_type: 'Engineering',
    ranking: 3,
    courses_offered: ['B.Tech', 'M.Tech', 'Ph.D', 'MBA'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Research Labs'],
    fees_range: '₹2-3 Lakhs/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'iit-madras',
    name: 'Indian Institute of Technology Madras',
    location: 'Chennai',
    state: 'Tamil Nadu',
    city: 'Chennai',
    college_type: 'Engineering',
    ranking: 1,
    courses_offered: ['B.Tech', 'M.Tech', 'Ph.D', 'MBA'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Research Labs'],
    fees_range: '₹2-3 Lakhs/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'iit-kanpur',
    name: 'Indian Institute of Technology Kanpur',
    location: 'Kanpur',
    state: 'Uttar Pradesh',
    city: 'Kanpur',
    college_type: 'Engineering',
    ranking: 4,
    courses_offered: ['B.Tech', 'M.Tech', 'Ph.D', 'MBA'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Research Labs'],
    fees_range: '₹2-3 Lakhs/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'iit-kharagpur',
    name: 'Indian Institute of Technology Kharagpur',
    location: 'Kharagpur',
    state: 'West Bengal',
    city: 'Kharagpur',
    college_type: 'Engineering',
    ranking: 5,
    courses_offered: ['B.Tech', 'M.Tech', 'Ph.D', 'MBA'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Research Labs'],
    fees_range: '₹2-3 Lakhs/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },

  // NITs
  {
    id: 'nit-trichy',
    name: 'National Institute of Technology Tiruchirappalli',
    location: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    city: 'Tiruchirappalli',
    college_type: 'Engineering',
    ranking: 10,
    courses_offered: ['B.Tech', 'M.Tech', 'Ph.D', 'MBA'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Research Labs'],
    fees_range: '₹1.5-2.5 Lakhs/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'nit-surathkal',
    name: 'National Institute of Technology Karnataka',
    location: 'Surathkal',
    state: 'Karnataka',
    city: 'Surathkal',
    college_type: 'Engineering',
    ranking: 12,
    courses_offered: ['B.Tech', 'M.Tech', 'Ph.D', 'MBA'],
    facilities: ['Hostel', 'Library', 'Sports Complex', 'Research Labs'],
    fees_range: '₹1.5-2.5 Lakhs/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },

  // Central Universities
  {
    id: 'du-delhi',
    name: 'University of Delhi',
    location: 'New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    college_type: 'General',
    ranking: 15,
    courses_offered: ['B.A', 'B.Sc', 'B.Com', 'M.A', 'M.Sc', 'M.Com', 'Ph.D'],
    facilities: ['Library', 'Sports Complex', 'Hostel', 'Research Centers'],
    fees_range: '₹10,000-50,000/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'jnu-delhi',
    name: 'Jawaharlal Nehru University',
    location: 'New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    college_type: 'General',
    ranking: 8,
    courses_offered: ['B.A', 'M.A', 'M.Phil', 'Ph.D', 'M.Tech'],
    facilities: ['Library', 'Hostel', 'Research Centers', 'Sports Complex'],
    fees_range: '₹5,000-30,000/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },

  // Medical Colleges
  {
    id: 'aiims-delhi',
    name: 'All India Institute of Medical Sciences Delhi',
    location: 'New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    college_type: 'Medical',
    ranking: 1,
    courses_offered: ['MBBS', 'MD', 'MS', 'M.Ch', 'Ph.D'],
    facilities: ['Hospital', 'Library', 'Hostel', 'Research Labs'],
    fees_range: '₹1,000-5,000/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'pgimer-chandigarh',
    name: 'Post Graduate Institute of Medical Education and Research',
    location: 'Chandigarh',
    state: 'Punjab',
    city: 'Chandigarh',
    college_type: 'Medical',
    ranking: 3,
    courses_offered: ['MBBS', 'MD', 'MS', 'M.Ch', 'Ph.D'],
    facilities: ['Hospital', 'Library', 'Hostel', 'Research Labs'],
    fees_range: '₹1,000-5,000/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },

  // State Universities
  {
    id: 'calcutta-university',
    name: 'University of Calcutta',
    location: 'Kolkata',
    state: 'West Bengal',
    city: 'Kolkata',
    college_type: 'General',
    ranking: 25,
    courses_offered: ['B.A', 'B.Sc', 'B.Com', 'M.A', 'M.Sc', 'M.Com', 'Ph.D'],
    facilities: ['Library', 'Hostel', 'Research Centers', 'Sports Complex'],
    fees_range: '₹5,000-25,000/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'mumbai-university',
    name: 'University of Mumbai',
    location: 'Mumbai',
    state: 'Maharashtra',
    city: 'Mumbai',
    college_type: 'General',
    ranking: 30,
    courses_offered: ['B.A', 'B.Sc', 'B.Com', 'M.A', 'M.Sc', 'M.Com', 'Ph.D'],
    facilities: ['Library', 'Hostel', 'Research Centers', 'Sports Complex'],
    fees_range: '₹5,000-25,000/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },

  // Agricultural Universities
  {
    id: 'iari-delhi',
    name: 'Indian Agricultural Research Institute',
    location: 'New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    college_type: 'Agriculture',
    ranking: 20,
    courses_offered: ['B.Sc Agriculture', 'M.Sc Agriculture', 'Ph.D', 'Diploma'],
    facilities: ['Research Farms', 'Library', 'Hostel', 'Laboratories'],
    fees_range: '₹10,000-30,000/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },

  // Law Universities
  {
    id: 'nls-bangalore',
    name: 'National Law School of India University',
    location: 'Bangalore',
    state: 'Karnataka',
    city: 'Bangalore',
    college_type: 'Law',
    ranking: 1,
    courses_offered: ['B.A LL.B', 'LL.M', 'Ph.D', 'Diploma'],
    facilities: ['Library', 'Moot Court', 'Hostel', 'Research Centers'],
    fees_range: '₹1-2 Lakhs/year',
    is_government: true,
    last_updated: new Date().toISOString()
  },

  // Management Institutes
  {
    id: 'iim-ahmedabad',
    name: 'Indian Institute of Management Ahmedabad',
    location: 'Ahmedabad',
    state: 'Gujarat',
    city: 'Ahmedabad',
    college_type: 'Management',
    ranking: 1,
    courses_offered: ['MBA', 'PGP', 'Ph.D', 'Executive MBA'],
    facilities: ['Library', 'Hostel', 'Research Centers', 'Sports Complex'],
    fees_range: '₹20-25 Lakhs/total',
    is_government: true,
    last_updated: new Date().toISOString()
  },
  {
    id: 'iim-bangalore',
    name: 'Indian Institute of Management Bangalore',
    location: 'Bangalore',
    state: 'Karnataka',
    city: 'Bangalore',
    college_type: 'Management',
    ranking: 2,
    courses_offered: ['MBA', 'PGP', 'Ph.D', 'Executive MBA'],
    facilities: ['Library', 'Hostel', 'Research Centers', 'Sports Complex'],
    fees_range: '₹20-25 Lakhs/total',
    is_government: true,
    last_updated: new Date().toISOString()
  }
];

export class GovernmentCollegeDataLoader {
  async loadCollegesToOfflineStorage(): Promise<void> {
    try {
      await offlineStorage.init();
      await offlineStorage.saveColleges(GOVERNMENT_COLLEGES);
      console.log('Government college data loaded to offline storage');
    } catch (error) {
      console.error('Error loading government college data:', error);
    }
  }

  async getCollegesByState(state: string): Promise<CollegeData[]> {
    return await offlineStorage.getColleges({ state, is_government: true });
  }

  async getCollegesByType(collegeType: string): Promise<CollegeData[]> {
    return await offlineStorage.getColleges({ college_type: collegeType, is_government: true });
  }

  async getAllGovernmentColleges(): Promise<CollegeData[]> {
    return await offlineStorage.getColleges({ is_government: true });
  }

  async searchColleges(query: string): Promise<CollegeData[]> {
    const allColleges = await this.getAllGovernmentColleges();
    const searchTerm = query.toLowerCase();
    
    return allColleges.filter(college => 
      college.name.toLowerCase().includes(searchTerm) ||
      college.location.toLowerCase().includes(searchTerm) ||
      college.courses_offered.some(course => 
        course.toLowerCase().includes(searchTerm)
      )
    );
  }

  async getCollegesByRankingRange(minRank: number, maxRank: number): Promise<CollegeData[]> {
    const allColleges = await this.getAllGovernmentColleges();
    return allColleges.filter(college => 
      college.ranking && college.ranking >= minRank && college.ranking <= maxRank
    );
  }
}

export const governmentCollegeLoader = new GovernmentCollegeDataLoader();
