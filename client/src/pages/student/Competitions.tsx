import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { CompetitionCard, CompetitionCardSkeleton } from '@/components/dashboard/CompetitionCard';
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
  Trophy, 
  Filter,
  Clock,
  Medal,
  BarChart
} from 'lucide-react';

export default function StudentCompetitions({ user }: { user: any }) {
  // Log user data to verify
  console.log("CompetitionsPage received user:", user);
  
  // Format user data to match DashboardLayout props interface
  const dashboardUser = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'teacher' | 'student',
    grade: user.grade === null ? undefined : user.grade
  } : undefined;
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Placeholder for competitions data - will be replaced with API call
  const competitions = [
    {
      id: 1,
      title: 'National Science Competition',
      description: 'Showcase your scientific knowledge and creativity in this national-level competition.',
      category: 'Science',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NpZW5jZXxlbnwwfHwwfHx8MA%3D%3D',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-15'),
      participantCount: 1245,
      status: 'upcoming',
      isRegistered: false,
      hasSubmitted: false,
      isWinner: false
    },
    {
      id: 2,
      title: 'Mathematics Olympiad',
      description: 'Test your mathematical skills in this challenging olympiad designed for grades 6-10.',
      category: 'Mathematics',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWF0aHxlbnwwfHwwfHx8MA%3D%3D',
      startDate: new Date('2025-05-20'),
      endDate: new Date('2025-05-30'),
      participantCount: 879,
      status: 'upcoming',
      isRegistered: true,
      hasSubmitted: false,
      isWinner: false
    },
    {
      id: 3,
      title: 'Creative Writing Challenge',
      description: 'Express your creativity through stories, poems, or essays in this writing competition.',
      category: 'English',
      thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d3JpdGluZ3xlbnwwfHwwfHx8MA%3D%3D',
      startDate: new Date('2025-05-05'),
      endDate: new Date('2025-05-15'),
      participantCount: 643,
      status: 'ongoing',
      isRegistered: true,
      hasSubmitted: false,
      isWinner: false
    },
    {
      id: 4,
      title: 'Environmental Project Showcase',
      description: 'Present your innovative solutions to environmental challenges through practical projects.',
      category: 'Science',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVudmlyb25tZW50fGVufDB8fDB8fHww',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-30'),
      participantCount: 528,
      status: 'ended',
      isRegistered: true,
      hasSubmitted: true,
      isWinner: true
    },
    {
      id: 5,
      title: 'Digital Art Exhibition',
      description: 'Showcase your digital design and artistic talents in this creative competition.',
      category: 'Art',
      thumbnailUrl: 'https://images.unsplash.com/photo-1547333101-6bb18e609b2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDA%3D',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-04-15'),
      participantCount: 762,
      status: 'ended',
      isRegistered: true,
      hasSubmitted: true,
      isWinner: false
    }
  ];

  // Filter competitions based on search, category, and status
  const filteredCompetitions = competitions.filter(competition => {
    // Search filter
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          competition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          competition.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || competition.category.toLowerCase() === categoryFilter.toLowerCase();
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || competition.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    // Sort logic
    if (sortBy === 'alpha') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'recent') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (sortBy === 'participants') {
      return b.participantCount - a.participantCount;
    } else {
      return 0;
    }
  });

  // Filter active and past competitions
  const activeCompetitions = filteredCompetitions.filter(c => c.status === 'upcoming' || c.status === 'ongoing');
  const pastCompetitions = filteredCompetitions.filter(c => c.status === 'ended');
  const yourCompetitions = filteredCompetitions.filter(c => c.isRegistered);
  
  // Animation redundancy guard
  const [animationsPlayed, setAnimationsPlayed] = useState(false);
  
  // Animation effect with performance optimization
  useEffect(() => {
    if (animationsPlayed) return; // Skip if already animated
    
    // Use a lightweight animation for the competition categories
    const categories = document.querySelectorAll('.competition-category');
    if (categories.length) {
      // Using a timeline for better control
      const timeline = gsap.timeline({
        onComplete: () => setAnimationsPlayed(true) // Mark as played
      });
      
      // Animate with a staggered effect but shorter duration for performance
      timeline.fromTo(
        categories, 
        { y: 15, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, // Shorter duration
          stagger: 0.1,  // Small stagger time
          ease: "power2.out",
          clearProps: "transform" // Better performance by clearing transforms after animation
        }
      );
    }
    
    // Cleanup
    return () => {
      gsap.killTweensOf(".competition-category");
    };
  }, [animationsPlayed]);
  
  return (
    <DashboardLayout user={dashboardUser}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight mb-1">Competitions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Showcase your skills and compete with students across the country
          </p>
        </div>
      </div>

      {/* Featured Competition */}
      <div className="relative mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-20 p-6 md:p-8 flex flex-col md:flex-row items-center">
          <div className="flex-1 mb-4 md:mb-0 md:mr-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                Featured Competition
              </span>
              <span className="animate-pulse rounded-full bg-green-500 px-3 py-1 text-xs font-medium">
                Registration Open
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">All India Talent Search 2025</h2>
            <p className="mb-4 max-w-2xl text-white/90">
              Participate in India's largest talent search competition for students. Showcase your skills in multiple subjects and win exciting prizes including scholarships worth up to ₹50,000.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-indigo-700 hover:bg-white/90 hover:text-indigo-800">
                Register Now
              </Button>
              <Button variant="outline" className="text-white border-white/50 hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <div className="mb-3">
              <div className="text-white font-semibold mb-1">Complete all three stages to unlock exclusive certificates!</div>
              <div className="text-sm text-white/80 mt-3">Registration closes in: 30 days</div>
            </div>
            <div className="text-sm text-white/80">3,245 students already registered</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search competitions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="art">Art & Design</SelectItem>
              <SelectItem value="computer">Computer Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
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
              <SelectItem value="participants">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Competition Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Competition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quizz Whizz */}
          <div className="competition-category bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div 
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 text-lg font-bold"
                    aria-hidden="true">
                    QW
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Quizz Whizz</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Knowledge-based assessment across multiple subjects</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2" 
                aria-label="Start your Quizz Whizz journey">
                Start your journey here
              </Button>
            </div>
          </div>
          
          {/* Think Tank Challenge */}
          <div className="competition-category bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div 
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 text-lg font-bold"
                    aria-hidden="true">
                    TT
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Think Tank Challenge</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Problem-solving and creative thinking challenges</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                aria-label="Develop your critical skills with Think Tank Challenge">
                Develop your critical skills
              </Button>
            </div>
          </div>
          
          {/* Mindbloom */}
          <div className="competition-category bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div 
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500 text-lg font-bold"
                    aria-hidden="true">
                    MB
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Mindbloom</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Explore creativity and innovation through projects</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                aria-label="Unleash your creativity with Mindbloom">
                Unleash your creativity
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Competition Listings */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="gap-1">
            <Trophy className="h-4 w-4" aria-hidden="true" /> All Competitions
          </TabsTrigger>
          <TabsTrigger value="your" className="gap-1">
            <Medal className="h-4 w-4" aria-hidden="true" /> Your Competitions
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" /> Past Competitions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCompetitions.length > 0 ? (
              activeCompetitions.map(competition => (
                <CompetitionCard
                  key={competition.id}
                  id={competition.id}
                  title={competition.title}
                  description={competition.description}
                  category={competition.category}
                  thumbnailUrl={competition.thumbnailUrl}
                  startDate={competition.startDate}
                  endDate={competition.endDate}
                  participants={competition.participantCount}
                  status={competition.status as 'upcoming' | 'ongoing' | 'ended' | 'open'}
                  hasRegistered={competition.isRegistered}
                  hasSubmitted={competition.hasSubmitted}
                  isWinner={competition.isWinner}
                />
              ))
            ) : (
              <div className="col-span-full text-center bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
                <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">No competitions found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? "Try adjusting your filters to see more competitions."
                    : "Check back soon for new competitions to participate in."}
                </p>
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                  <Button onClick={() => { 
                    setSearchTerm(''); 
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}>
                    Reset Filters
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="your" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yourCompetitions.length > 0 ? (
              yourCompetitions.map(competition => (
                <CompetitionCard
                  key={competition.id}
                  id={competition.id}
                  title={competition.title}
                  description={competition.description}
                  category={competition.category}
                  thumbnailUrl={competition.thumbnailUrl}
                  startDate={competition.startDate}
                  endDate={competition.endDate}
                  participants={competition.participantCount}
                  status={competition.status as 'upcoming' | 'ongoing' | 'ended' | 'open'}
                  hasRegistered={competition.isRegistered}
                  hasSubmitted={competition.hasSubmitted}
                  isWinner={competition.isWinner}
                />
              ))
            ) : (
              <div className="col-span-full text-center bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
                <Medal className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">No registered competitions</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven't registered for any competitions yet.
                </p>
                <Button>Explore Competitions</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastCompetitions.length > 0 ? (
              pastCompetitions.map(competition => (
                <CompetitionCard
                  key={competition.id}
                  id={competition.id}
                  title={competition.title}
                  description={competition.description}
                  category={competition.category}
                  thumbnailUrl={competition.thumbnailUrl}
                  startDate={competition.startDate}
                  endDate={competition.endDate}
                  participants={competition.participantCount}
                  status={competition.status as 'upcoming' | 'ongoing' | 'ended' | 'open'}
                  hasRegistered={competition.isRegistered}
                  hasSubmitted={competition.hasSubmitted}
                  isWinner={competition.isWinner}
                />
              ))
            ) : (
              <div className="col-span-full text-center bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
                <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">No past competitions</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  There are no completed competitions to display.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}