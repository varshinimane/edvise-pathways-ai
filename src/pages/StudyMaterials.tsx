import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Video, 
  Search,
  ExternalLink,
  Filter,
  Star,
  Download,
  Clock,
  GraduationCap,
  FileText,
  PlayCircle,
  Monitor
} from 'lucide-react';
import { 
  STUDY_MATERIALS, 
  SKILL_DEVELOPMENT_RESOURCES, 
  StudyMaterial,
  getFreeStudyMaterials,
  searchStudyMaterials,
  getStudyMaterialsBySubject
} from '@/lib/studyMaterialsData';

const StudyMaterials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const subjects = Object.keys(STUDY_MATERIALS);

  useEffect(() => {
    let materials: StudyMaterial[] = [];

    if (searchQuery) {
      materials = searchStudyMaterials(searchQuery);
    } else if (selectedSubject === 'all') {
      // Get all materials
      Object.values(STUDY_MATERIALS).forEach(subjectMaterials => {
        materials.push(...subjectMaterials);
      });
      materials.push(...SKILL_DEVELOPMENT_RESOURCES);
    } else if (selectedSubject === 'free') {
      materials = getFreeStudyMaterials();
    } else if (selectedSubject === 'skills') {
      materials = SKILL_DEVELOPMENT_RESOURCES;
    } else {
      materials = getStudyMaterialsBySubject(selectedSubject);
    }

    if (showFreeOnly) {
      materials = materials.filter(material => material.free);
    }

    setFilteredMaterials(materials);
  }, [searchQuery, selectedSubject, showFreeOnly]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4" />;
      case 'course': return <Monitor className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'practice': return <GraduationCap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Study Materials & Resources</h1>
          <p className="text-muted-foreground">
            Access free e-books, courses, and study materials tailored to your academic interests
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="card-gradient border-border mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search study materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showFreeOnly ? "accent" : "outline"}
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className="min-w-fit"
              >
                <Filter className="h-4 w-4 mr-2" />
                Free Only
              </Button>
            </div>

            {/* Subject Tabs */}
            <Tabs value={selectedSubject} onValueChange={setSelectedSubject}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="free">Free Resources</TabsTrigger>
                <TabsTrigger value="skills">Skill Development</TabsTrigger>
                <TabsTrigger value="computer_science">Computer Science</TabsTrigger>
                <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {subjects.slice(0, 8).map((subject) => (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? "accent" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject(subject)}
                    className="capitalize"
                  >
                    {subject.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </Tabs>
          </div>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="card-gradient border-border hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(material.type)}
                    <Badge variant="secondary" className="text-xs">
                      {material.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-accent fill-current" />
                    <span className="text-xs text-muted-foreground">{material.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {material.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {material.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getLevelColor(material.level)}>
                    {material.level}
                  </Badge>
                  {material.free && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Free
                    </Badge>
                  )}
                  {material.duration && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{material.duration}</span>
                    </div>
                  )}
                </div>

                {/* Provider */}
                <p className="text-xs text-muted-foreground mb-3">
                  by {material.provider}
                </p>

                {/* Topics */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {material.topics.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {material.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{material.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="accent" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(material.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Access
                  </Button>
                  {material.format === 'pdf' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <Card className="card-gradient border-border">
            <div className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Materials Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse different subjects
              </p>
              <Button variant="accent" onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
                setShowFreeOnly(false);
              }}>
                Browse All Materials
              </Button>
            </div>
          </Card>
        )}

        {/* Stats */}
        <Card className="card-gradient border-border mt-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resource Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Object.values(STUDY_MATERIALS).reduce((acc, materials) => acc + materials.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Study Materials</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {getFreeStudyMaterials().length}
                </div>
                <div className="text-sm text-muted-foreground">Free Resources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {subjects.length}
                </div>
                <div className="text-sm text-muted-foreground">Subjects Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {SKILL_DEVELOPMENT_RESOURCES.length}
                </div>
                <div className="text-sm text-muted-foreground">Skill Courses</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudyMaterials;