import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  DollarSign,
  Users,
  BookOpen,
  MapPin
} from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  category: string;
  description: string;
  applicants: number;
  website: string;
}

const scholarships: Scholarship[] = [
  {
    id: '1',
    title: 'National Merit Scholarship',
    provider: 'Government of India',
    amount: '₹50,000/year',
    deadline: '2024-03-15',
    eligibility: ['12th Pass', 'Merit Based', 'All Categories'],
    category: 'Merit',
    description: 'Scholarship for meritorious students pursuing higher education in recognized institutions.',
    applicants: 15420,
    website: 'https://scholarships.gov.in'
  },
  {
    id: '2',
    title: 'SC/ST Engineering Scholarship',
    provider: 'Ministry of Social Justice',
    amount: '₹75,000/year',
    deadline: '2024-04-20',
    eligibility: ['Engineering Students', 'SC/ST Category', 'Family Income < ₹8 LPA'],
    category: 'Engineering',
    description: 'Financial assistance for SC/ST students pursuing engineering courses in premier institutions.',
    applicants: 8750,
    website: 'https://scholarships.gov.in'
  },
  {
    id: '3',
    title: 'Girls Education Scholarship',
    provider: 'Women & Child Development',
    amount: '₹30,000/year',
    deadline: '2024-05-10',
    eligibility: ['Female Students', '12th Pass', 'Family Income < ₹6 LPA'],
    category: 'Women',
    description: 'Encouraging higher education among girls from economically weaker sections.',
    applicants: 22100,
    website: 'https://scholarships.gov.in'
  },
  {
    id: '4',
    title: 'Research Fellowship Program',
    provider: 'CSIR India',
    amount: '₹31,000/month',
    deadline: '2024-06-05',
    eligibility: ['PhD Students', 'NET Qualified', 'Research Field'],
    category: 'Research',
    description: 'Fellowship for students pursuing research in science and technology.',
    applicants: 5240,
    website: 'https://csirhrdg.res.in'
  },
  {
    id: '5',
    title: 'Minority Community Scholarship',
    provider: 'Ministry of Minority Affairs',
    amount: '₹40,000/year',
    deadline: '2024-03-30',
    eligibility: ['Minority Community', 'Merit Based', 'Family Income < ₹8 LPA'],
    category: 'Minority',
    description: 'Educational assistance for students from minority communities.',
    applicants: 12800,
    website: 'https://scholarships.gov.in'
  }
];

const Scholarships = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Merit', 'Engineering', 'Women', 'Research', 'Minority'];

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scholarship.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    return date.toLocaleDateString();
  };

  const getUrgencyColor = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-destructive';
    if (diffDays <= 7) return 'text-orange-500';
    if (diffDays <= 30) return 'text-yellow-500';
    return 'text-accent';
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Scholarships & Financial Aid
          </h1>
          <p className="text-muted-foreground">
            Discover government scholarships and financial assistance programs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="card-gradient border-border p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistics */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
  <Card className="card-gradient border-border p-4">
    <div className="flex items-center space-x-3">
      <Award className="h-6 w-6 text-primary" />
      <div>
        <p className="text-lg font-bold">{filteredScholarships.length}</p>
        <p className="text-sm text-muted-foreground">Available Scholarships</p>
      </div>
    </div>
  </Card>
  
  <Card className="card-gradient border-border p-4">
    <div className="flex items-center space-x-3">
      <DollarSign className="h-6 w-6 text-accent" />
      <div>
        <p className="text-lg font-bold">₹2.5Cr+</p>
        <p className="text-sm text-muted-foreground">Total Fund Pool</p>
      </div>
    </div>
  </Card>
</div>

          
          
        {/* Scholarships List */}
        <div className="space-y-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="card-gradient border-border overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {scholarship.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">{scholarship.provider}</p>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {scholarship.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-card-foreground leading-relaxed">
                      {scholarship.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {scholarship.eligibility.map((criteria, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {criteria}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-accent" />
                        <span className="font-medium">{scholarship.amount}</span>
                      </div>
                      
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:ml-6">
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <Card className="card-gradient border-border">
            <div className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No scholarships found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse different categories.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Scholarships;