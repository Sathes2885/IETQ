import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Award, 
  Download,
  Share2,
  Calendar,
  GraduationCap,
  Trophy
} from 'lucide-react';

export default function StudentCertificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Placeholder data - would be replaced with API call
  const certificates = [
    {
      id: 1,
      title: 'Mathematics Excellence',
      type: 'course',
      category: 'Mathematics',
      issueDate: new Date('2025-04-15'),
      description: 'Awarded for successfully completing the Advanced Mathematics course with distinction.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635372722656-389f87a941db?q=80&w=1160&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Science Olympiad Winner',
      type: 'competition',
      category: 'Science',
      issueDate: new Date('2025-03-22'),
      description: 'Awarded for achieving first place in the Regional Science Olympiad.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1160&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Creative Writing Master',
      type: 'course',
      category: 'English',
      issueDate: new Date('2025-02-10'),
      description: 'Awarded for excellence in creative writing and storytelling techniques.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1160&auto=format&fit=crop',
    },
    {
      id: 4,
      title: 'History Quiz Champion',
      type: 'quiz',
      category: 'History',
      issueDate: new Date('2025-01-30'),
      description: 'Awarded for achieving 100% score in the History Knowledge Challenge.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1160&auto=format&fit=crop',
    },
    {
      id: 5,
      title: 'Programming Excellence',
      type: 'course',
      category: 'Computer',
      issueDate: new Date('2024-12-20'),
      description: 'Awarded for successfully completing the Introduction to Programming course.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1160&auto=format&fit=crop',
    }
  ];

  // Filter and sort certificates
  const filteredCertificates = certificates.filter(certificate => {
    // Search filter
    const matchesSearch = certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          certificate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          certificate.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || certificate.type === typeFilter;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    // Sort logic
    if (sortBy === 'alpha') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'recent') {
      return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    } else {
      return 0;
    }
  });

  // Helper function to get icon based on certificate type
  const getCertificateIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <GraduationCap className="h-6 w-6 text-blue-500" />;
      case 'competition':
        return <Trophy className="h-6 w-6 text-purple-500" />;
      case 'quiz':
        return <Award className="h-6 w-6 text-amber-500" />;
      default:
        return <Award className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight mb-1">My Certificates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and download your earned certificates and achievements
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search certificates..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="course">Course Certificates</SelectItem>
              <SelectItem value="competition">Competition Awards</SelectItem>
              <SelectItem value="quiz">Quiz Achievements</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map(certificate => (
            <div key={certificate.id} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-40 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                {certificate.thumbnailUrl ? (
                  <img 
                    src={certificate.thumbnailUrl} 
                    alt={certificate.title} 
                    className="w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-gray-900/40 via-gray-900/20 to-transparent">
                  <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md mb-2">
                    {getCertificateIcon(certificate.type)}
                  </div>
                  <h3 className="text-lg font-bold text-center text-white shadow-text">{certificate.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Issued on {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(certificate.issueDate)}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {certificate.description}
                </p>
                <div className="flex justify-between gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button size="sm" className="flex-1 gap-1">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">No certificates found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              {searchTerm || typeFilter !== 'all' 
                ? "Try adjusting your filters to find what you're looking for."
                : "You haven't earned any certificates yet. Complete courses, quizzes, or competitions to earn certificates."}
            </p>
            {searchTerm || typeFilter !== 'all' ? (
              <Button onClick={() => { setSearchTerm(''); setTypeFilter('all'); }}>
                Reset Filters
              </Button>
            ) : (
              <Button>Explore Courses</Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}