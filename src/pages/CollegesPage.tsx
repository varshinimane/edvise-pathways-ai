import { useState } from 'react';
import CollegeMap from '@/components/CollegeMap';

interface College {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  rating?: number;
  programs?: string[];
  phone?: string;
  email?: string;
  website?: string;
}

const CollegesPage = () => {
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Find Colleges Near You
          </h1>
          <p className="text-muted-foreground">
            Explore colleges and universities with our interactive map
          </p>
        </div>
        
        <CollegeMap 
          selectedCollege={selectedCollege}
          onCollegeSelect={setSelectedCollege}
        />
      </div>
    </div>
  );
};

export default CollegesPage;