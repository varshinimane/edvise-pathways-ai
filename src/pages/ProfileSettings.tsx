import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, MapPin, Phone, CheckCircle, AlertCircle, GraduationCap, Heart, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    phone: '',
    age: '',
    gender: '',
    class_level: '',
    academic_interests: [] as string[],
    preferred_subjects: [] as string[],
    career_goals: [] as string[],
    learning_style: '',
    stream: ''
  });

  // Fetch profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Try to fetch existing profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        if (profileData) {
          setFormData({
            full_name: profileData.full_name || '',
            location: profileData.location || '',
            phone: profileData.phone || '',
            age: profileData.age?.toString() || '',
            gender: profileData.gender || '',
            class_level: profileData.class_level || '',
            academic_interests: profileData.academic_interests || [],
            preferred_subjects: profileData.preferred_subjects || [],
            career_goals: profileData.career_goals || [],
            learning_style: profileData.learning_style || '',
            stream: profileData.stream || ''
          });
        } else {
          // Initialize with user metadata if no profile exists
          setFormData({
            full_name: user.user_metadata?.full_name || '',
            location: '',
            phone: '',
            age: '',
            gender: '',
            class_level: '',
            academic_interests: [],
            preferred_subjects: [],
            career_goals: [],
            learning_style: '',
            stream: ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to user metadata
        setFormData({
          full_name: user.user_metadata?.full_name || '',
          location: '',
          phone: '',
          age: '',
          gender: '',
          class_level: '',
          academic_interests: [],
          preferred_subjects: [],
          career_goals: [],
          learning_style: '',
          stream: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    setMessage(null);

    try {
      // Upsert profile data to Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: formData.full_name,
          location: formData.location,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || null,
          class_level: formData.class_level || null,
          academic_interests: formData.academic_interests,
          preferred_subjects: formData.preferred_subjects,
          career_goals: formData.career_goals,
          learning_style: formData.learning_style || null,
          stream: formData.stream || null,
          role: 'student', // Default role
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving profile:', error);
        setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      formData.full_name, 
      formData.location, 
      formData.phone,
      formData.age,
      formData.gender,
      formData.class_level,
      formData.learning_style,
      formData.stream
    ];
    const arrayFields = [
      formData.academic_interests.length > 0,
      formData.preferred_subjects.length > 0,
      formData.career_goals.length > 0
    ];
    
    const completedFields = fields.filter(field => field && field.toString().trim() !== '').length;
    const completedArrayFields = arrayFields.filter(Boolean).length;
    
    return Math.round(((completedFields + completedArrayFields) / (fields.length + arrayFields.length)) * 100);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Complete your profile to get better recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Completion Card */}
          <div className="lg:col-span-1">
            <Card className="card-gradient border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Completion</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {calculateProfileCompletion()}%
                  </div>
                  <Progress value={calculateProfileCompletion()} className="h-2" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    {formData.full_name ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={formData.full_name ? 'text-foreground' : 'text-muted-foreground'}>
                      Personal Info
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.academic_interests.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={formData.academic_interests.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                      Academic Interests
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.career_goals.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={formData.career_goals.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                      Career Goals
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="card-gradient border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>
              
              {message && (
                <Alert className={`mb-6 ${message.type === 'error' ? 'border-destructive/50 text-destructive' : 'border-accent/50 text-accent'}`}>
                  {message.type === 'error' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    min="13"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class_level">Class/Level</Label>
                  <Select value={formData.class_level} onValueChange={(value) => handleInputChange('class_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class_9">Class 9</SelectItem>
                      <SelectItem value="class_10">Class 10</SelectItem>
                      <SelectItem value="class_11">Class 11</SelectItem>
                      <SelectItem value="class_12">Class 12</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="post_graduate">Post Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter your city, state"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Academic Information */}
            <Card className="card-gradient border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Academic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stream">Stream</Label>
                  <Select value={formData.stream} onValueChange={(value) => handleInputChange('stream', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="arts">Arts/Humanities</SelectItem>
                      <SelectItem value="vocational">Vocational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning_style">Learning Style</Label>
                  <Select value={formData.learning_style} onValueChange={(value) => handleInputChange('learning_style', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select learning style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual Learner</SelectItem>
                      <SelectItem value="auditory">Auditory Learner</SelectItem>
                      <SelectItem value="kinesthetic">Kinesthetic Learner</SelectItem>
                      <SelectItem value="reading_writing">Reading/Writing Learner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Academic Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History', 'Geography', 'Economics', 'Business Studies', 'Arts', 'Psychology'].map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={`academic_${interest}`}
                          checked={formData.academic_interests.includes(interest)}
                          onCheckedChange={(checked) => handleMultiSelectChange('academic_interests', interest, checked as boolean)}
                        />
                        <Label htmlFor={`academic_${interest}`} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Subjects</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Science', 'Mathematics', 'Languages', 'Social Studies', 'Arts', 'Technology', 'Sports', 'Music', 'Literature'].map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subject_${subject}`}
                          checked={formData.preferred_subjects.includes(subject)}
                          onCheckedChange={(checked) => handleMultiSelectChange('preferred_subjects', subject, checked as boolean)}
                        />
                        <Label htmlFor={`subject_${subject}`} className="text-sm">{subject}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Career Goals</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Doctor', 'Engineer', 'Teacher', 'Scientist', 'Artist', 'Business', 'Government Service', 'Research', 'Technology', 'Healthcare', 'Education', 'Entertainment'].map((career) => (
                      <div key={career} className="flex items-center space-x-2">
                        <Checkbox
                          id={`career_${career}`}
                          checked={formData.career_goals.includes(career)}
                          onCheckedChange={(checked) => handleMultiSelectChange('career_goals', career, checked as boolean)}
                        />
                        <Label htmlFor={`career_${career}`} className="text-sm">{career}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-accent hover:bg-accent/90 text-white"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
