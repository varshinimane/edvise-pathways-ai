import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Users, 
  Database, 
  Upload, 
  TrendingUp,
  School,
  Award,
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [colleges, setColleges] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [userStats, setUserStats] = useState({ total: 0, students: 0, admins: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [showAddScholarship, setShowAddScholarship] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // New college form
  const [newCollege, setNewCollege] = useState({
    name: '',
    location: '',
    state: '',
    city: '',
    college_type: '',
    ranking: '',
    fees_range: '',
    courses_offered: [],
    facilities: []
  });

  // New scholarship form
  const [newScholarship, setNewScholarship] = useState({
    name: '',
    description: '',
    provider: '',
    amount: '',
    eligibility_criteria: [],
    category: '',
    education_level: '',
    income_limit: '',
    application_deadline: '',
    application_url: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load colleges
      const { data: collegesData } = await supabase
        .from('colleges')
        .select('*')
        .order('name');
      
      // Load scholarships
      const { data: scholarshipsData } = await supabase
        .from('scholarships')
        .select('*')
        .order('name');

      // Load user stats (simplified - you might want to add more detailed analytics)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('role');

      setColleges(collegesData || []);
      setScholarships(scholarshipsData || []);
      
      const stats = {
        total: profilesData?.length || 0,
        students: profilesData?.filter(p => p.role === 'student').length || 0,
        admins: profilesData?.filter(p => p.role === 'admin').length || 0
      };
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('colleges')
        .insert([{
          ...newCollege,
          ranking: newCollege.ranking ? parseInt(newCollege.ranking) : null,
          courses_offered: newCollege.courses_offered.filter(c => c.trim()),
          facilities: newCollege.facilities.filter(f => f.trim())
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "College added successfully"
      });

      setNewCollege({
        name: '',
        location: '',
        state: '',
        city: '',
        college_type: '',
        ranking: '',
        fees_range: '',
        courses_offered: [],
        facilities: []
      });
      setShowAddCollege(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error adding college:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add college"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('scholarships')
        .insert([{
          ...newScholarship,
          amount: newScholarship.amount ? parseFloat(newScholarship.amount) : null,
          income_limit: newScholarship.income_limit ? parseFloat(newScholarship.income_limit) : null,
          application_deadline: newScholarship.application_deadline || null,
          eligibility_criteria: newScholarship.eligibility_criteria.filter(c => c.trim())
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scholarship added successfully"
      });

      setNewScholarship({
        name: '',
        description: '',
        provider: '',
        amount: '',
        eligibility_criteria: [],
        category: '',
        education_level: '',
        income_limit: '',
        application_deadline: '',
        application_url: ''
      });
      setShowAddScholarship(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error adding scholarship:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add scholarship"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage EdVise platform data and users</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <School className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{colleges.length}</p>
                <p className="text-sm text-muted-foreground">Colleges</p>
              </div>
            </div>
          </Card>

          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/30 rounded-lg">
                <Award className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scholarships.length}</p>
                <p className="text-sm text-muted-foreground">Scholarships</p>
              </div>
            </div>
          </Card>

          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.students}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="colleges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colleges">Colleges Management</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Colleges Tab */}
          <TabsContent value="colleges">
            <Card className="card-gradient border-border">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground">College Database</h3>
                  <Button
                    onClick={() => setShowAddCollege(true)}
                    variant="accent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add College
                  </Button>
                </div>

                {showAddCollege && (
                  <div className="mb-6 p-4 bg-secondary/20 rounded-lg border border-border/50">
                    <h4 className="text-md font-medium text-foreground mb-4">Add New College</h4>
                    <form onSubmit={handleAddCollege} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>College Name *</Label>
                        <Input
                          value={newCollege.name}
                          onChange={(e) => setNewCollege({...newCollege, name: e.target.value})}
                          required
                          placeholder="e.g., IIT Delhi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State *</Label>
                        <Input
                          value={newCollege.state}
                          onChange={(e) => setNewCollege({...newCollege, state: e.target.value})}
                          required
                          placeholder="e.g., Delhi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input
                          value={newCollege.city}
                          onChange={(e) => setNewCollege({...newCollege, city: e.target.value})}
                          required
                          placeholder="e.g., New Delhi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Input
                          value={newCollege.college_type}
                          onChange={(e) => setNewCollege({...newCollege, college_type: e.target.value})}
                          placeholder="e.g., Engineering, Medical"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>NIRF Ranking</Label>
                        <Input
                          type="number"
                          value={newCollege.ranking}
                          onChange={(e) => setNewCollege({...newCollege, ranking: e.target.value})}
                          placeholder="e.g., 1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fees Range</Label>
                        <Input
                          value={newCollege.fees_range}
                          onChange={(e) => setNewCollege({...newCollege, fees_range: e.target.value})}
                          placeholder="e.g., ₹2-5 Lakhs/year"
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-3">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? 'Adding...' : 'Add College'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddCollege(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {colleges.slice(0, 10).map((college: any) => (
                    <div key={college.id} className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground">{college.name}</h4>
                          <p className="text-sm text-muted-foreground">{college.city}, {college.state}</p>
                          {college.ranking && <Badge variant="secondary">Rank #{college.ranking}</Badge>}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships">
            <Card className="card-gradient border-border">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Scholarship Database</h3>
                  <Button
                    onClick={() => setShowAddScholarship(true)}
                    variant="accent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Scholarship
                  </Button>
                </div>

                {showAddScholarship && (
                  <div className="mb-6 p-4 bg-secondary/20 rounded-lg border border-border/50">
                    <h4 className="text-md font-medium text-foreground mb-4">Add New Scholarship</h4>
                    <form onSubmit={handleAddScholarship} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Scholarship Name *</Label>
                        <Input
                          value={newScholarship.name}
                          onChange={(e) => setNewScholarship({...newScholarship, name: e.target.value})}
                          required
                          placeholder="e.g., National Merit Scholarship"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Provider *</Label>
                        <Input
                          value={newScholarship.provider}
                          onChange={(e) => setNewScholarship({...newScholarship, provider: e.target.value})}
                          required
                          placeholder="e.g., Government of India"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount (₹)</Label>
                        <Input
                          type="number"
                          value={newScholarship.amount}
                          onChange={(e) => setNewScholarship({...newScholarship, amount: e.target.value})}
                          placeholder="e.g., 50000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                          value={newScholarship.category}
                          onChange={(e) => setNewScholarship({...newScholarship, category: e.target.value})}
                          placeholder="e.g., Merit-based, Need-based"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Education Level</Label>
                        <Input
                          value={newScholarship.education_level}
                          onChange={(e) => setNewScholarship({...newScholarship, education_level: e.target.value})}
                          placeholder="e.g., Undergraduate, Graduate"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Application Deadline</Label>
                        <Input
                          type="date"
                          value={newScholarship.application_deadline}
                          onChange={(e) => setNewScholarship({...newScholarship, application_deadline: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newScholarship.description}
                          onChange={(e) => setNewScholarship({...newScholarship, description: e.target.value})}
                          placeholder="Describe the scholarship..."
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-3">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? 'Adding...' : 'Add Scholarship'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddScholarship(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {scholarships.slice(0, 10).map((scholarship: any) => (
                    <div key={scholarship.id} className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground">{scholarship.name}</h4>
                          <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                          <div className="flex space-x-2 mt-2">
                            {scholarship.amount && (
                              <Badge variant="secondary">₹{scholarship.amount.toLocaleString()}</Badge>
                            )}
                            {scholarship.category && (
                              <Badge variant="outline">{scholarship.category}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Platform Analytics</h3>
                
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Detailed analytics coming soon. This will include user engagement, quiz completion rates, and popular career paths.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">User Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Students</span>
                        <span className="text-sm font-medium">{userStats.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Admins</span>
                        <span className="text-sm font-medium">{userStats.admins}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Content Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Colleges</span>
                        <span className="text-sm font-medium">{colleges.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Active Scholarships</span>
                        <span className="text-sm font-medium">{scholarships.filter((s: any) => s.is_active).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;