import { ReactNode } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  CalendarClock, 
  Timer, 
  AlertCircle, 
  Clock,
  Calendar,
  BookOpen
} from 'lucide-react';

export interface UpcomingItemProps {
  id: number;
  title: string;
  type: 'quiz' | 'competition' | 'class' | 'event';
  subject?: string;
  date: Date;
  duration?: string;
  isImportant?: boolean;
  isLive?: boolean;
  isPastDue?: boolean;
  minutesRemaining?: number;
  extraInfo?: string;
  className?: string;
}

export function UpcomingItem({
  id,
  title,
  type,
  subject,
  date,
  duration,
  isImportant = false,
  isLive = false,
  isPastDue = false,
  minutesRemaining,
  extraInfo,
  className,
}: UpcomingItemProps) {
  // Format date - both date part and time part
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
  
  // Get icon based on type
  const getItemIcon = (type: string): ReactNode => {
    switch (type) {
      case 'quiz':
        return <span className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
          <Timer className="h-4 w-4" />
        </span>;
      case 'competition':
        return <span className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
          <BookOpen className="h-4 w-4" />
        </span>;
      case 'class':
        return <span className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/50 dark:text-green-400">
          <Calendar className="h-4 w-4" />
        </span>;
      case 'event':
        return <span className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
          <CalendarClock className="h-4 w-4" />
        </span>;
      default:
        return <span className="rounded-full bg-gray-100 p-2 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
        </span>;
    }
  };
  
  // Get color based on status
  const getStatusColor = () => {
    if (isLive) return "text-green-600 dark:text-green-400";
    if (isPastDue) return "text-red-600 dark:text-red-400";
    if (isImportant) return "text-amber-600 dark:text-amber-400";
    return "text-gray-600 dark:text-gray-400";
  };
  
  // Get status message
  const getStatusMessage = () => {
    if (isLive) return "LIVE NOW";
    if (isPastDue) return "PAST DUE";
    if (minutesRemaining && minutesRemaining < 60) return `Starting in ${minutesRemaining} min`;
    return null;
  };
  
  // Get path based on type
  const getPath = () => {
    switch (type) {
      case 'quiz':
        return `/student/quizzes/${id}`;
      case 'competition':
        return `/student/competitions/${id}`;
      case 'class':
        return `/student/schedule/${id}`;
      case 'event':
        return `/student/schedule/${id}`;
      default:
        return '/student';
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg border border-gray-200 p-3 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900 transition-colors",
      isPastDue && "opacity-75",
      className
    )}>
      {getItemIcon(type)}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">{title}</h4>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs">
          {subject && (
            <span className="text-gray-600 dark:text-gray-400 font-medium">{subject}</span>
          )}
          
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{formattedTime}</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          
          {duration && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Timer className="h-3 w-3" />
              <span>{duration}</span>
            </div>
          )}
          
          {extraInfo && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1 w-full">
              <span>{extraInfo}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        {getStatusMessage() && (
          <span className={cn(
            "flex items-center gap-1 text-xs font-medium",
            getStatusColor()
          )}>
            {isLive || isPastDue ? <AlertCircle className="h-3 w-3" /> : null}
            {getStatusMessage()}
          </span>
        )}
        
        <Button 
          size="sm" 
          variant={isLive ? "default" : "outline"}
          asChild
        >
          <Link href={getPath()}>
            {isLive ? "Join Now" : isPastDue ? "View" : "Details"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function UpcomingItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 bg-white dark:border-gray-800 dark:bg-gray-950 animate-pulse">
      <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-8 w-8"></div>
      
      <div className="flex-1">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="mt-2 flex gap-2">
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      
      <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
}