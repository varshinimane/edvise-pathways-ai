import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalUsers: number;
  students: number;
  admins: number;
  totalColleges: number;
  activeScholarships: number;
  totalQuizzes: number;
  totalRecommendations: number;
  recentSignups: number;
  quizCompletionRate: number;
  popularCareers: Array<{
    career: string;
    count: number;
  }>;
  userEngagement: Array<{
    date: string;
    activeUsers: number;
    quizCompletions: number;
  }>;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all analytics data in parallel
      const [
        profilesResult,
        collegesResult,
        scholarshipsResult,
        quizResultsResult,
        recommendationsResult
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('colleges').select('*'),
        supabase.from('scholarships').select('*'),
        supabase.from('quiz_responses').select('*'),
        supabase.from('recommendations').select('career_recommendations')
      ]);

      const profiles = profilesResult.data || [];
      const colleges = collegesResult.data || [];
      const scholarships = scholarshipsResult.data || [];
      const quizResponses = quizResultsResult.data || [];
      const recommendations = recommendationsResult.data || [];

      // Calculate user stats
      const students = profiles.filter(p => p.role === 'student').length;
      const admins = profiles.filter(p => p.role === 'admin').length;
      const totalUsers = profiles.length;

      // Calculate recent signups (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentSignups = profiles.filter(p => 
        new Date(p.created_at) > sevenDaysAgo
      ).length;

      // Calculate quiz completion rate
      const quizCompletionRate = totalUsers > 0 
        ? Math.round((quizResponses.length / totalUsers) * 100)
        : 0;

      // Extract popular careers from recommendations
      const careerCounts: { [key: string]: number } = {};
      recommendations.forEach(rec => {
        if (rec.career_recommendations && Array.isArray(rec.career_recommendations)) {
          rec.career_recommendations.forEach((career: any) => {
            if (career.title) {
              careerCounts[career.title] = (careerCounts[career.title] || 0) + 1;
            }
          });
        }
      });

      const popularCareers = Object.entries(careerCounts)
        .map(([career, count]) => ({ career, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Generate user engagement data (last 7 days)
      const userEngagement = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Count active users (simplified - users who completed quizzes on this day)
        const activeUsers = quizResponses.filter(qr => 
          qr.completed_at?.startsWith(dateStr)
        ).length;

        // Count quiz completions on this day
        const quizCompletions = quizResponses.filter(qr => 
          qr.completed_at?.startsWith(dateStr)
        ).length;

        userEngagement.push({
          date: dateStr,
          activeUsers,
          quizCompletions
        });
      }

      const analyticsData: AnalyticsData = {
        totalUsers,
        students,
        admins,
        totalColleges: colleges.length,
        activeScholarships: scholarships.filter(s => s.is_active).length,
        totalQuizzes: quizResponses.length,
        totalRecommendations: recommendations.length,
        recentSignups,
        quizCompletionRate,
        popularCareers,
        userEngagement
      };

      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscriptions for analytics updates
    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchAnalytics()
      )
      .subscribe();

    const quizSubscription = supabase
      .channel('quiz-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quiz_responses' },
        () => fetchAnalytics()
      )
      .subscribe();

    const recommendationsSubscription = supabase
      .channel('recommendations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recommendations' },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => {
      profilesSubscription.unsubscribe();
      quizSubscription.unsubscribe();
      recommendationsSubscription.unsubscribe();
    };
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
