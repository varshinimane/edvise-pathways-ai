// src/lib/offlineStorage.ts - IndexedDB wrapper for offline data
interface CollegeData {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  college_type: string;
  ranking?: number;
  courses_offered: string[];
  facilities: string[];
  fees_range?: string;
  is_government: boolean;
  last_updated: string;
}

interface ScholarshipData {
  id: string;
  name: string;
  description: string;
  provider: string;
  amount?: number;
  eligibility_criteria: string[];
  category: string;
  education_level: string;
  income_limit?: number;
  application_deadline?: string;
  application_url?: string;
  is_active: boolean;
  last_updated: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: string;
  language: 'en' | 'hi';
}

interface OfflineRecommendation {
  id: string;
  career_title: string;
  description: string;
  required_education: string[];
  skills: string[];
  salary_range: string;
  growth_prospects: string;
  keywords: string[];
}

class OfflineStorage {
  private dbName = 'EdViseOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('colleges')) {
          const collegeStore = db.createObjectStore('colleges', { keyPath: 'id' });
          collegeStore.createIndex('state', 'state', { unique: false });
          collegeStore.createIndex('college_type', 'college_type', { unique: false });
          collegeStore.createIndex('is_government', 'is_government', { unique: false });
        }

        if (!db.objectStoreNames.contains('scholarships')) {
          const scholarshipStore = db.createObjectStore('scholarships', { keyPath: 'id' });
          scholarshipStore.createIndex('category', 'category', { unique: false });
          scholarshipStore.createIndex('education_level', 'education_level', { unique: false });
          scholarshipStore.createIndex('is_active', 'is_active', { unique: false });
        }

        if (!db.objectStoreNames.contains('quiz_questions')) {
          const quizStore = db.createObjectStore('quiz_questions', { keyPath: 'id' });
          quizStore.createIndex('category', 'category', { unique: false });
          quizStore.createIndex('language', 'language', { unique: false });
        }

        if (!db.objectStoreNames.contains('offline_recommendations')) {
          const recStore = db.createObjectStore('offline_recommendations', { keyPath: 'id' });
          recStore.createIndex('keywords', 'keywords', { unique: false, multiEntry: true });
        }

        if (!db.objectStoreNames.contains('user_data')) {
          db.createObjectStore('user_data', { keyPath: 'key' });
        }
      };
    });
  }

  // College data methods
  async saveColleges(colleges: CollegeData[]): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['colleges'], 'readwrite');
    const store = transaction.objectStore('colleges');
    
    for (const college of colleges) {
      await store.put(college);
    }
  }

  async getColleges(filters?: { state?: string; college_type?: string; is_government?: boolean }): Promise<CollegeData[]> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['colleges'], 'readonly');
    const store = transaction.objectStore('colleges');
    
    if (filters) {
      let index = store.index('state');
      if (filters.college_type) index = store.index('college_type');
      if (filters.is_government) index = store.index('is_government');
      
      return new Promise((resolve, reject) => {
        const request = index.getAll();
        request.onsuccess = () => {
          let results = request.result;
          if (filters.state) results = results.filter(c => c.state === filters.state);
          if (filters.college_type) results = results.filter(c => c.college_type === filters.college_type);
          if (filters.is_government !== undefined) results = results.filter(c => c.is_government === filters.is_government);
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      });
    }
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Scholarship data methods
  async saveScholarships(scholarships: ScholarshipData[]): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['scholarships'], 'readwrite');
    const store = transaction.objectStore('scholarships');
    
    for (const scholarship of scholarships) {
      await store.put(scholarship);
    }
  }

  async getScholarships(filters?: { category?: string; education_level?: string; is_active?: boolean }): Promise<ScholarshipData[]> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['scholarships'], 'readonly');
    const store = transaction.objectStore('scholarships');
    
    if (filters) {
      let index = store.index('category');
      if (filters.education_level) index = store.index('education_level');
      if (filters.is_active !== undefined) index = store.index('is_active');
      
      return new Promise((resolve, reject) => {
        const request = index.getAll();
        request.onsuccess = () => {
          let results = request.result;
          if (filters.category) results = results.filter(s => s.category === filters.category);
          if (filters.education_level) results = results.filter(s => s.education_level === filters.education_level);
          if (filters.is_active !== undefined) results = results.filter(s => s.is_active === filters.is_active);
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      });
    }
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Quiz questions methods
  async saveQuizQuestions(questions: QuizQuestion[]): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['quiz_questions'], 'readwrite');
    const store = transaction.objectStore('quiz_questions');
    
    for (const question of questions) {
      await store.put(question);
    }
  }

  async getQuizQuestions(language: 'en' | 'hi' = 'en'): Promise<QuizQuestion[]> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['quiz_questions'], 'readonly');
    const store = transaction.objectStore('quiz_questions');
    const index = store.index('language');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(language);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Offline recommendations methods
  async saveOfflineRecommendations(recommendations: OfflineRecommendation[]): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['offline_recommendations'], 'readwrite');
    const store = transaction.objectStore('offline_recommendations');
    
    for (const rec of recommendations) {
      await store.put(rec);
    }
  }

  async getOfflineRecommendations(keywords: string[]): Promise<OfflineRecommendation[]> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['offline_recommendations'], 'readonly');
    const store = transaction.objectStore('offline_recommendations');
    const index = store.index('keywords');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        const allRecs = request.result;
        // Filter recommendations based on keyword matches
        const matches = allRecs.filter(rec => 
          keywords.some(keyword => 
            rec.keywords.some(recKeyword => 
              recKeyword.toLowerCase().includes(keyword.toLowerCase())
            )
          )
        );
        resolve(matches);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // User data methods
  async saveUserData(key: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['user_data'], 'readwrite');
    const store = transaction.objectStore('user_data');
    await store.put({ key, data, timestamp: Date.now() });
  }

  async getUserData(key: string): Promise<any> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['user_data'], 'readonly');
    const store = transaction.objectStore('user_data');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }

  // Check if data is stale and needs refresh
  async isDataStale(storeName: string, maxAge: number = 24 * 60 * 60 * 1000): Promise<boolean> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        if (request.result.length === 0) {
          resolve(true); // No data, consider stale
          return;
        }
        
        const latest = Math.max(...request.result.map(item => 
          new Date(item.last_updated || 0).getTime()
        ));
        const now = Date.now();
        resolve(now - latest > maxAge);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
export type { CollegeData, ScholarshipData, QuizQuestion, OfflineRecommendation };
