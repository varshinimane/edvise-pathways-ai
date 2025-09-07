// src/hooks/useOfflineData.ts - Hook to initialize offline data
import { useEffect, useState } from 'react';
import { offlineStorage } from '@/lib/offlineStorage';
import { governmentCollegeLoader } from '@/lib/governmentCollegeData';
import { multilingualQuizLoader } from '@/lib/multilingualQuizData';

export const useOfflineData = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeOfflineData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize IndexedDB
        await offlineStorage.init();

        // Check if data is already cached and not stale
        const isCollegesStale = await offlineStorage.isDataStale('colleges', 7 * 24 * 60 * 60 * 1000); // 7 days
        const isQuizStale = await offlineStorage.isDataStale('quiz_questions', 30 * 24 * 60 * 60 * 1000); // 30 days

        // Load government college data if stale or missing
        if (isCollegesStale) {
          console.log('Loading government college data...');
          await governmentCollegeLoader.loadCollegesToOfflineStorage();
        }

        // Load quiz questions if stale or missing
        if (isQuizStale) {
          console.log('Loading multilingual quiz questions...');
          await multilingualQuizLoader.loadQuizQuestionsToOfflineStorage();
        }

        // Load offline recommendations
        const offlineRecommendations = [
          {
            id: 'rec1',
            career_title: 'Software Engineer',
            description: 'Design, develop, and maintain software applications and systems.',
            required_education: ['B.Tech Computer Science', 'M.Tech', 'Diploma in Programming'],
            skills: ['Programming', 'Problem Solving', 'Teamwork', 'Communication'],
            salary_range: '₹4-20 LPA',
            growth_prospects: 'Excellent growth in tech industry',
            keywords: ['technology', 'programming', 'software', 'computer', 'coding']
          },
          {
            id: 'rec2',
            career_title: 'Data Scientist',
            description: 'Analyze complex data to help organizations make informed decisions.',
            required_education: ['B.Tech', 'M.Sc Statistics', 'Ph.D', 'Data Science Certification'],
            skills: ['Statistics', 'Machine Learning', 'Python', 'Analytical Thinking'],
            salary_range: '₹6-25 LPA',
            growth_prospects: 'High demand in AI and analytics',
            keywords: ['data', 'analysis', 'statistics', 'machine learning', 'research']
          },
          {
            id: 'rec3',
            career_title: 'Doctor',
            description: 'Diagnose and treat patients, provide medical care and health advice.',
            required_education: ['MBBS', 'MD', 'Specialization'],
            skills: ['Medical Knowledge', 'Empathy', 'Communication', 'Problem Solving'],
            salary_range: '₹8-25 LPA',
            growth_prospects: 'Stable and growing healthcare sector',
            keywords: ['medical', 'health', 'patient', 'treatment', 'healthcare']
          },
          {
            id: 'rec4',
            career_title: 'Teacher',
            description: 'Educate and mentor students in various subjects and life skills.',
            required_education: ['B.Ed', 'Subject-specific degrees', 'M.Ed'],
            skills: ['Communication', 'Patience', 'Subject Knowledge', 'Mentoring'],
            salary_range: '₹3-10 LPA',
            growth_prospects: 'Stable career with good job security',
            keywords: ['teaching', 'education', 'students', 'learning', 'mentoring']
          },
          {
            id: 'rec5',
            career_title: 'Business Analyst',
            description: 'Analyze business processes and recommend improvements for efficiency.',
            required_education: ['BBA', 'MBA', 'Commerce', 'Economics'],
            skills: ['Analytical Thinking', 'Communication', 'Problem Solving', 'Business Acumen'],
            salary_range: '₹5-18 LPA',
            growth_prospects: 'Growing demand in corporate sector',
            keywords: ['business', 'analysis', 'management', 'strategy', 'corporate']
          }
        ];

        await offlineStorage.saveOfflineRecommendations(offlineRecommendations);

        setIsInitialized(true);
        console.log('Offline data initialization complete');

      } catch (error) {
        console.error('Error initializing offline data:', error);
        setError('Failed to initialize offline data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeOfflineData();
  }, []);

  return {
    isInitialized,
    isLoading,
    error
  };
};
