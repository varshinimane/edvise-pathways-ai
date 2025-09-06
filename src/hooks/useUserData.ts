import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserStats {
  profileComplete: number;
  matchesFound: number;
  collegesViewed: number;
  applications: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  time: string;
  type: 'quiz' | 'college' | 'scholarship' | 'profile';
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  location: string | null;
  phone: string | null;
  role: 'student' | 'admin';
  created_at: string;
  updated_at: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    profileComplete: 0,
    matchesFound: 0,
    collegesViewed: 0,
    applications: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset all state when user changes
    setStats({
      profileComplete: 0,
      matchesFound: 0,
      collegesViewed: 0,
      applications: 0
    });
    setRecentActivity([]);
    setProfile(null);
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          setProfile(profileData);
        }

        // Calculate profile completion
        const profileComplete = calculateProfileCompletion(profileData);

        // Fetch quiz responses count
        const { data: quizData } = await supabase
          .from('quiz_responses')
          .select('id')
          .eq('user_id', user.id);

        // Fetch recommendations count
        const { data: recommendationsData } = await supabase
          .from('recommendations')
          .select('id')
          .eq('user_id', user.id);

        // Mock data for colleges viewed and applications
        // In a real app, you'd have tables for these
        const collegesViewed = Math.floor(Math.random() * 50) + 10;
        const applications = Math.floor(Math.random() * 10) + 1;

        setStats({
          profileComplete,
          matchesFound: recommendationsData?.length || 0,
          collegesViewed,
          applications
        });

        // Generate recent activity
        const activity = generateRecentActivity(quizData?.length || 0, recommendationsData?.length || 0);
        setRecentActivity(activity);

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Set up real-time subscriptions
    const profileSubscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('Profile change received:', payload);
          fetchUserData(); // Refetch data when profile changes
        }
      )
      .subscribe();

    const quizSubscription = supabase
      .channel('quiz-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quiz_responses', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('Quiz change received:', payload);
          fetchUserData(); // Refetch data when quiz responses change
        }
      )
      .subscribe();

    const recommendationsSubscription = supabase
      .channel('recommendations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recommendations', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('Recommendations change received:', payload);
          fetchUserData(); // Refetch data when recommendations change
        }
      )
      .subscribe();

    return () => {
      profileSubscription.unsubscribe();
      quizSubscription.unsubscribe();
      recommendationsSubscription.unsubscribe();
    };
  }, [user]);

  const calculateProfileCompletion = (profile: UserProfile | null): number => {
    if (!profile) return 0;
    
    let completion = 0;
    const fields = [
      profile.full_name,
      profile.location,
      profile.phone
    ];
    
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    completion = Math.round((completedFields / fields.length) * 100);
    
    return completion;
  };

  const generateRecentActivity = (quizCount: number, recommendationCount: number): RecentActivity[] => {
    const activities: RecentActivity[] = [];
    
    if (quizCount > 0) {
      activities.push({
        id: 'quiz-1',
        action: 'Completed Career Interest Quiz',
        time: '2 hours ago',
        type: 'quiz'
      });
    }
    
    if (recommendationCount > 0) {
      activities.push({
        id: 'college-1',
        action: 'Viewed IIT Delhi profile',
        time: '1 day ago',
        type: 'college'
      });
      
      activities.push({
        id: 'scholarship-1',
        action: 'Applied to Merit Scholarship',
        time: '3 days ago',
        type: 'scholarship'
      });
    }
    
    return activities.slice(0, 3); // Return max 3 activities
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user found') };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      }

      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  return {
    stats,
    recentActivity,
    profile,
    loading,
    updateProfile
  };
};
