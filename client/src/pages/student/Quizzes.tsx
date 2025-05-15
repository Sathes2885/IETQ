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
  Sparkles, 
  Filter,
  Clock,
  CheckCircle,
  History
} from 'lucide-react';
import { UpcomingItem, UpcomingItemSkeleton } from '@/components/dashboard/UpcomingItem';

export default function StudentQuizzes({ user }: { user: any }) {
  // Log user data to verify
  console.log("QuizzesPage received user:", user);
  
  // Format user data to match DashboardLayout props interface
  const dashboardUser = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'teacher' | 'student',
    grade: user.grade === null ? undefined : user.grade
  } : undefined;
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Placeholder for quizzes data - will be replaced with API call
  const quizzes = [
    {
      id: 1,
      title: 'Weekly Science Quiz',
      type: 'quiz',
      subject: 'Science',
      scheduledStartTime: new Date('2025-05-08T14:00:00'),
      duration: 30,
      isImportant: true,
      isLive: false,
      minutesUntilStart: 120,
      questions: 20,
      maxScore: 100
    },
    {
      id: 2,
      title: 'Mathematics Challenge',
      type: 'quiz',
      subject: 'Mathematics',
      scheduledStartTime: new Date('2025-05-12T10:00:00'),
      duration: 45,
      isImportant: true,
      isLive: false,
      minutesUntilStart: 5760,
      questions: 25,
      maxScore: 100
    },
    {
      id: 3,
      title: 'English Grammar Test',
      type: 'quiz',
      subject: 'English',
      scheduledStartTime: new Date('2025-05-07T09:30:00'),
      duration: 20,
      isImportant: false,
      isLive: true,
      minutesUntilStart: 0,
      questions: 15,
      maxScore: 75
    }
  ];

  // Filter quizzes based on search and filters
  const filteredQuizzes = quizzes.filter(quiz => {
    // Search filter
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subject filter
    const matchesSubject = subjectFilter === 'all' || quiz.subject.toLowerCase() === subjectFilter.toLowerCase();
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'live') {
      matchesStatus = quiz.isLive;
    } else if (statusFilter === 'upcoming') {
      matchesStatus = !quiz.isLive && quiz.minutesUntilStart > 0;
    }
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Mock data for completed quizzes
  const completedQuizzes = [
    {
      id: 101,
      title: 'Biology Mid-Term Quiz',
      subject: 'Science',
      completedDate: new Date('2025-04-25T11:20:00'),
      score: 85,
      totalScore: 100,
      duration: 30,
      questions: 20,
      correctAnswers: 17
    },
    {
      id: 102,
      title: 'Algebra Proficiency Test',
      subject: 'Mathematics',
      completedDate: new Date('2025-04-18T14:45:00'),
      score: 72,
      totalScore: 100,
      duration: 45,
      questions: 25,
      correctAnswers: 18
    },
    {
      id: 103,
      title: 'Literary Devices Quiz',
      subject: 'English',
      completedDate: new Date('2025-04-10T09:30:00'),
      score: 68,
      totalScore: 75,
      duration: 20,
      questions: 15,
      correctAnswers: 13
    }
  ];
  
  return (
    <DashboardLayout user={dashboardUser}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight mb-1">Quizzes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge with interactive quizzes
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search quizzes..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="computer">Computer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs for Upcoming and Completed Quizzes */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming" className="gap-1">
            <Clock className="h-4 w-4" /> Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            <CheckCircle className="h-4 w-4" /> Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          <div className="mb-4 flex justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm">Status:</span>
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'live' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('live')}
                  className="gap-1"
                >
                  <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span> Live
                </Button>
                <Button 
                  variant={statusFilter === 'upcoming' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('upcoming')}
                >
                  Upcoming
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} found
            </div>
          </div>

          <DashboardCard contentClassName="p-4 space-y-3">
            {filteredQuizzes.length > 0 ? (
              <div className="space-y-3">
                {filteredQuizzes.map((quiz) => (
                  <UpcomingItem
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    type="quiz"
                    subject={quiz.subject}
                    date={quiz.scheduledStartTime}
                    duration={`${quiz.duration} minutes`}
                    isImportant={quiz.isImportant}
                    isLive={quiz.isLive}
                    minutesRemaining={quiz.minutesUntilStart}
                    extraInfo={`${quiz.questions} questions | ${quiz.maxScore} points`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No quizzes match your search criteria</p>
                <Button onClick={() => { setSearchTerm(''); setSubjectFilter('all'); setStatusFilter('all'); }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </DashboardCard>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <DashboardCard contentClassName="p-4">
            {completedQuizzes.length > 0 ? (
              <div className="space-y-4">
                {completedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <History className="h-4 w-4" />
                          <span>
                            {new Intl.DateTimeFormat('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }).format(quiz.completedDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          <span>{quiz.subject}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center min-w-[120px] p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="text-2xl font-bold">
                        {quiz.score}/{quiz.totalScore}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round((quiz.score / quiz.totalScore) * 100)}% Score
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {quiz.correctAnswers}/{quiz.questions} correct
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't completed any quizzes yet</p>
                <Button asChild>
                  <a href="#upcoming">Browse Upcoming Quizzes</a>
                </Button>
              </div>
            )}
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}