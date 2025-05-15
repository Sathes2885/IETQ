import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Users, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompetitionCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  startDate: Date;
  endDate: Date;
  participants?: number;
  status: 'upcoming' | 'ongoing' | 'ended' | 'open';
  hasRegistered?: boolean;
  hasSubmitted?: boolean;
  isWinner?: boolean;
  className?: string;
}

export function CompetitionCard({
  id,
  title,
  description,
  category,
  thumbnailUrl,
  startDate,
  endDate,
  participants = 0,
  status,
  hasRegistered = false,
  hasSubmitted = false,
  isWinner = false,
  className,
}: CompetitionCardProps) {
  // Format dates
  const formattedStartDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(startDate);
  
  const formattedEndDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(endDate);
  
  // Calculate time remaining
  const calculateTimeRemaining = (): string => {
    if (status === 'ended') return 'Ended';
    
    const now = new Date();
    const targetDate = status === 'upcoming' ? startDate : endDate;
    const diffTime = Math.max(0, targetDate.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours} hr${diffHours !== 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours} hr${diffHours !== 1 ? 's' : ''} ${diffMinutes} min${diffMinutes !== 1 ? 's' : ''}`;
    }
  };
  
  // Badge style based on status
  const getBadgeStyle = () => {
    switch (status) {
      case 'ongoing':
        return { variant: 'default' as const, label: 'Ongoing' };
      case 'upcoming':
        return { variant: 'outline' as const, label: 'Upcoming' };
      case 'ended':
        return { variant: 'secondary' as const, label: 'Ended' };
      case 'open':
        return { variant: 'destructive' as const, label: 'Open for Submissions' };
      default:
        return { variant: 'outline' as const, label: 'Unknown' };
    }
  };
  
  // Action button text based on status
  const getActionText = () => {
    if (isWinner) return 'View Certificate';
    if (status === 'ended') return 'View Results';
    if (status === 'ongoing' && hasRegistered && !hasSubmitted) return 'Submit Entry';
    if (status === 'ongoing' && hasRegistered && hasSubmitted) return 'View Submission';
    if (status === 'ongoing' && !hasRegistered) return 'Register Now';
    if (status === 'upcoming' && hasRegistered) return 'View Details';
    if (status === 'upcoming' && !hasRegistered) return 'Register Now';
    return 'View Details';
  };
  
  const badge = getBadgeStyle();
  const timeRemaining = calculateTimeRemaining();

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Competition thumbnail */}
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500/20 to-indigo-500/20 dark:from-purple-900/40 dark:to-indigo-900/40">
            <Trophy className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
        )}
        
        {/* Category tag */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-purple-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/80 dark:text-purple-400">
          <Tag className="h-3 w-3 mr-0.5" />
          {category}
        </div>
        
        {/* Status badge */}
        <Badge 
          variant={badge.variant} 
          className="absolute right-3 top-3 shadow-sm"
        >
          {badge.label}
        </Badge>
        
        {/* Winner badge overlay */}
        {isWinner && (
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/70 to-yellow-600/70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
            <Trophy className="h-12 w-12 text-white animate-pulse" />
            <p className="mt-2 text-xl font-bold uppercase tracking-wider">Winner!</p>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
        
        <div className="mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Start: {formattedStartDate}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>End: {formattedEndDate}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Users className="h-3.5 w-3.5" />
              <span>{participants} Participants</span>
            </div>
            
            <div className={cn(
              "flex items-center gap-1 font-medium",
              status === 'ended' ? "text-gray-500 dark:text-gray-400" : "text-purple-600 dark:text-purple-400"
            )}>
              <Clock className="h-3.5 w-3.5" />
              <span>{status === 'ongoing' ? "Ends in: " : status === 'upcoming' ? "Starts in: " : ""}{timeRemaining}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {hasRegistered && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                Registered
              </Badge>
            )}
            {hasSubmitted && (
              <Badge variant="outline" className="text-xs ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                Submitted
              </Badge>
            )}
          </div>
          
          <Button 
            asChild 
            size="sm"
            variant={status === 'ongoing' && !hasRegistered ? "default" : "outline"}
            className={cn(
              isWinner ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "",
              status === 'ended' && !isWinner ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" : ""
            )}
          >
            <Link href={`/student/competitions/${id}`}>
              {getActionText()}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CompetitionCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-sm animate-pulse">
      <div className="aspect-[2/1] w-full bg-gray-200 dark:bg-gray-800"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-800"></div>
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <div className="h-9 w-24 rounded bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
}