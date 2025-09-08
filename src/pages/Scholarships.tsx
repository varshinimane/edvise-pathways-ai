import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Award, Search, Filter, DollarSign, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Scholarship {
  id: string;
  title: string;         // mapped from 'name'
  provider: string;
  amount: string;
  deadline?: string;
  eligibility?: string[]; // mapped from eligibility_criteria
  category: string;
  description: string;    // mapped from 'description'
  applicants?: number;
  website?: string;
}

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const { data, error } = await supabase
          .from('scholarships')
          .select('*');

        if (error) throw error;
        if (!data) {
          setScholarships([]);
          setCategories(['All']);
          return;
        }

        const formattedData: Scholarship[] = data.map((s: any) => ({
          id: s.id,
          title: s.name ? String(s.name) : 'No title',                     // safe
          provider: s.provider ? String(s.provider) : 'Unknown',
          amount: s.amount ? String(s.amount) : 'N/A',
          deadline: s.deadline ? String(s.deadline) : '',
          eligibility: Array.isArray(s.eligibility_criteria)
            ? s.eligibility_criteria
            : typeof s.eligibility_criteria === 'string'
            ? s.eligibility_criteria.split(',').map((e: string) => e.trim())
            : [],
          category: s.category ? String(s.category) : 'Other',
          description: s.description ? String(s.description) : 'No description', // safe
          applicants: s.applicants || 0,
          website: s.website ? String(s.website) : '#',
        }));

        setScholarships(formattedData);

        const uniqueCategories = Array.from(
          new Set(formattedData.map((s) => s.category || 'Other'))
        );
        setCategories(['All', ...uniqueCategories]);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setError('Failed to fetch scholarships. Please check your DB.');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <p className="text-center mt-8">Loading scholarships...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

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
                      variant={selectedCategory === category ? 'default' : 'outline'}
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
          {filteredScholarships.length > 0 ? (
            filteredScholarships.map((s) => (
              <Card key={s.id} className="card-gradient border-border overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1">
                            {s.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">{s.provider}</p>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          {s.category || 'Other'}
                        </Badge>
                      </div>

                      <p className="text-sm text-card-foreground leading-relaxed">
                        {s.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {(s.eligibility || []).map((criteria, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {criteria}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-accent" />
                          <span className="font-medium">{s.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="card-gradient border-border">
              <div className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No scholarships found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse different categories.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scholarships;
