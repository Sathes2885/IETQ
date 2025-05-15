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
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Filter,
  Clock,
  GraduationCap,
  Trophy,
  FileQuestion
} from 'lucide-react';
import { UpcomingItem, UpcomingItemSkeleton } from '@/components/dashboard/UpcomingItem';

export default function StudentSchedule({ user }: { user: any }) {
  // Log user data to verify
  console.log("SchedulePage received user:", user);
  
  // Format user data to match DashboardLayout props interface
  const dashboardUser = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'teacher' | 'student',
    grade: user.grade === null ? undefined : user.grade
  } : undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('list');

  // Placeholder for events data - will be replaced with API call
  const events = [
    {
      id: 1,
      title: 'Science Class',
      type: 'class',
      subject: 'Science',
      scheduledStartTime: new Date('2025-05-10T10:00:00'),
      duration: 60,
      isImportant: false,
      isLive: false,
      minutesUntilStart: 60
    },
    {
      id: 2,
      title: 'Weekly Science Quiz',
      type: 'quiz',
      subject: 'Science',
      scheduledStartTime: new Date('2025-05-10T14:00:00'),
      duration: 30,
      isImportant: true,
      isLive: false,
      minutesUntilStart: 120
    },
    {
      id: 3,
      title: 'Mathematics Olympiad Meeting',
      type: 'event',
      subject: 'Mathematics',
      scheduledStartTime: new Date('2025-05-10T15:30:00'),
      duration: 45,
      isImportant: true,
      isLive: false,
      minutesUntilStart: 210
    },
    {
      id: 4,
      title: 'English Literature Discussion',
      type: 'class',
      subject: 'English',
      scheduledStartTime: new Date('2025-05-11T09:30:00'),
      duration: 60,
      isImportant: false,
      isLive: false,
      minutesUntilStart: 1440
    },
    {
      id: 5,
      title: 'National Science Competition Entry',
      type: 'competition',
      subject: 'Science',
      scheduledStartTime: new Date('2025-05-12T13:00:00'),
      duration: 120,
      isImportant: true,
      isLive: false,
      minutesUntilStart: 2880
    }
  ];

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    // Search filter
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    // Date filter - only show events for the selected date (comparing year, month, and day only)
    const eventDate = new Date(event.scheduledStartTime);
    const matchesDate = date ? 
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
      : true;
    
    return matchesSearch && matchesType && matchesDate;
  });

  // Group events by date for the calendar view
  const eventsByDate = events.reduce((acc, event) => {
    const dateStr = event.scheduledStartTime.toISOString().split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  // The UpcomingItem component already handles icons based on event type

  return (
    <DashboardLayout user={dashboardUser}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight mb-1">Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your classes, quizzes, and events
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={view === 'list' ? "default" : "outline"} 
            size="sm"
            onClick={() => setView('list')}
            className="gap-1"
          >
            <Filter className="h-4 w-4" /> List View
          </Button>
          <Button 
            variant={view === 'calendar' ? "default" : "outline"} 
            size="sm"
            onClick={() => setView('calendar')}
            className="gap-1"
          >
            <CalendarIcon className="h-4 w-4" /> Calendar View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search schedule..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="class">Classes</SelectItem>
              <SelectItem value="quiz">Quizzes</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="competition">Competitions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {view === 'list' ? (
        <DashboardCard contentClassName="p-4 space-y-3">
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-3"
            />
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <UpcomingItem
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  type={event.type as "quiz" | "event" | "class" | "competition"}
                  subject={event.subject}
                  date={event.scheduledStartTime}
                  duration={`${event.duration} minutes`}
                  isImportant={event.isImportant}
                  isLive={event.isLive}
                  minutesRemaining={event.minutesUntilStart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No events scheduled for this date</p>
              <Button onClick={() => { setDate(new Date()); setSearchTerm(''); setTypeFilter('all'); }}>
                Reset Filters
              </Button>
            </div>
          )}
        </DashboardCard>
      ) : (
        <DashboardCard contentClassName="p-4">
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-3 mx-auto"
              modifiers={{
                hasEvents: (date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  return !!eventsByDate[dateStr];
                },
              }}
              modifiersStyles={{
                hasEvents: { 
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '50%'
                }
              }}
            />
          </div>

          {filteredEvents.length > 0 ? (
            <div className="space-y-4 mt-6">
              <h3 className="font-medium text-lg">
                Events for {date?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <UpcomingItem
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    type={event.type as "quiz" | "event" | "class" | "competition"}
                    subject={event.subject}
                    date={event.scheduledStartTime}
                    duration={`${event.duration} minutes`}
                    isImportant={event.isImportant}
                    isLive={event.isLive}
                    minutesRemaining={event.minutesUntilStart}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No events scheduled for this date</p>
              <Button onClick={() => { setDate(new Date()); setSearchTerm(''); setTypeFilter('all'); }}>
                Reset Filters
              </Button>
            </div>
          )}
        </DashboardCard>
      )}
    </DashboardLayout>
  );
}