import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';
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
    phone: ''
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
            phone: profileData.phone || ''
          });
        } else {
          // Initialize with user metadata if no profile exists
          setFormData({
            full_name: user.user_metadata?.full_name || '',
            location: '',
            phone: ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to user metadata
        setFormData({
          full_name: user.user_metadata?.full_name || '',
          location: '',
          phone: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    const fields = [formData.full_name, formData.location, formData.phone];
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
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
                      Full Name
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.location ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={formData.location ? 'text-foreground' : 'text-muted-foreground'}>
                      Location
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.phone ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={formData.phone ? 'text-foreground' : 'text-muted-foreground'}>
                      Phone Number
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
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

              <div className="space-y-6">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
