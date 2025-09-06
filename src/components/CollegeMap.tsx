import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { MapPin, ExternalLink, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface College {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  rating: number;
  programs: string[];
  phone?: string;
  email?: string;
  website?: string;
}

const sampleColleges: College[] = [
  {
    id: '1',
    name: 'Indian Institute of Technology Delhi',
    address: 'Hauz Khas, New Delhi, Delhi 110016',
    lat: 28.5449,
    lng: 77.1928,
    type: 'Engineering',
    rating: 4.8,
    programs: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering'],
    phone: '+91-11-2659-1333',
    website: 'https://www.iitd.ac.in'
  },
  {
    id: '2',
    name: 'University of Delhi',
    address: 'Delhi University, Delhi 110007',
    lat: 28.6869,
    lng: 77.2090,
    type: 'University',
    rating: 4.5,
    programs: ['Arts', 'Science', 'Commerce', 'Law'],
    phone: '+91-11-2766-7853',
    website: 'https://www.du.ac.in'
  },
  {
    id: '3',
    name: 'Jamia Millia Islamia',
    address: 'Jamia Nagar, Okhla, New Delhi, Delhi 110025',
    lat: 28.5613,
    lng: 77.2804,
    type: 'Central University',
    rating: 4.3,
    programs: ['Engineering', 'Architecture', 'Management', 'Mass Communication'],
    phone: '+91-11-2698-1717',
    website: 'https://www.jmi.ac.in'
  }
];

interface CollegeMapProps {
  selectedCollege?: College | null;
  onCollegeSelect?: (college: College) => void;
}

const CollegeMap = ({ selectedCollege, onCollegeSelect }: CollegeMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map centered on Delhi
    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 11);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add college markers
    sampleColleges.forEach((college) => {
      const marker = L.marker([college.lat, college.lng])
        .addTo(map)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-sm mb-1">${college.name}</h3>
            <p class="text-xs text-gray-600 mb-2">${college.address}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${college.type}</span>
              <span class="text-xs font-medium">★ ${college.rating}</span>
            </div>
          </div>
        `);

      marker.on('click', () => {
        onCollegeSelect?.(college);
      });
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onCollegeSelect]);

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card className="card-gradient border-border overflow-hidden">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Nearby Colleges</h2>
          </div>
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border border-border/50"
          />
        </div>
      </Card>

      {/* Selected College Details */}
      {selectedCollege && (
        <Card className="card-gradient border-border">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{selectedCollege.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{selectedCollege.address}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCollege.type}
                  </span>
                  <span className="text-accent font-medium">★ {selectedCollege.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Popular Programs</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCollege.programs.map((program, index) => (
                    <span 
                      key={index}
                      className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full text-xs"
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {selectedCollege.phone && (
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
                {selectedCollege.email && (
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                )}
                {selectedCollege.website && (
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CollegeMap;