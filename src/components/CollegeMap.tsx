import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { MapPin, ExternalLink, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// Fix default Leaflet markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface CollegeMapProps {
  selectedCollege?: College | null;
  onCollegeSelect?: (college: College) => void;
}

const CollegeMap = ({ selectedCollege, onCollegeSelect }: CollegeMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch colleges from Supabase
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data, error } = await supabase.from('colleges').select('*');
        if (error) throw error;
        if (!data) return setColleges([]);

        const formattedData = data.map((c) => {
          const lat =
            'lat' in c
              ? Number(c.lat)
              : 'latitude' in c
              ? Number(c.latitude)
              : NaN;
          const lng =
            'lng' in c
              ? Number(c.lng)
              : 'longitude' in c
              ? Number(c.longitude)
              : NaN;

          const programs = Array.isArray(c.programs)
            ? c.programs
            : typeof c.programs === 'string'
            ? c.programs.split(',')
            : [];

          return {
            ...c,
            lat,
            lng,
            programs,
          };
        });

        console.log(
          'Fetched colleges:',
          formattedData.length,
          formattedData.filter((c) => isNaN(c.lat) || isNaN(c.lng))
        );

        setColleges(formattedData);
      } catch (err) {
        console.error('Error fetching colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Initialize map and markers
  useEffect(() => {
    if (!mapRef.current || mapInstance.current || colleges.length === 0) return;

    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const markers: L.Marker[] = [];

    colleges.forEach((college) => {
      if (isNaN(college.lat) || isNaN(college.lng)) {
        console.warn('Skipping college with invalid coordinates:', college);
        return;
      }

      const marker = L.marker([college.lat, college.lng])
        .addTo(map)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-sm mb-1">${college.name}</h3>
            <p class="text-xs text-gray-600 mb-2">${college.address || ''}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${college.type}</span>
              <span class="text-xs font-medium">★ ${college.rating ?? '-'}</span>
            </div>
          </div>
        `);

      marker.on('click', () => onCollegeSelect?.(college));
      markers.push(marker);
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [colleges, onCollegeSelect]);

  if (loading) return <p>Loading colleges...</p>;

  return (
    <div className="space-y-6">
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

      {selectedCollege && (
        <Card className="card-gradient border-border">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{selectedCollege.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{selectedCollege.address || 'No address'}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCollege.type}
                  </span>
                  <span className="text-accent font-medium">★ {selectedCollege.rating ?? '-'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Popular Programs</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedCollege.programs || []).map((program, index) => (
                    <span key={index} className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full text-xs">
                      {program}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {selectedCollege.phone && (
                  <a href={`tel:${selectedCollege.phone}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </a>
                )}
                {selectedCollege.email && (
                  <a href={`mailto:${selectedCollege.email}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </a>
                )}
                {selectedCollege.website && (
                  <a href={selectedCollege.website} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </a>
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
