import { Link } from 'wouter';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  id: number;
  title: string;
  subject: string;
  description: string;
  thumbnailUrl?: string;
  progress: number;
  duration?: string;
  lessons?: number;
  instructor?: string;
  isNew?: boolean;
  isCompleted?: boolean;
  lastAccessed?: Date;
  className?: string;
}

export function CourseCard({
  id,
  title,
  subject,
  description,
  thumbnailUrl,
  progress,
  duration,
  lessons,
  instructor,
  isNew = false,
  isCompleted = false,
  lastAccessed,
  className,
}: CourseCardProps) {
  // Format date if provided
  const formattedDate = lastAccessed 
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(lastAccessed)
    : null;

  return (
    <div className={cn(
      "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 transition-all hover:shadow-md",
      className
    )}>
      <div className="relative">
        {/* Course thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-900/40 dark:to-purple-900/40">
              <span className="text-xl font-medium text-indigo-600 dark:text-indigo-400">
                {title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Subject badge */}
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/80 dark:text-indigo-400">
            {subject}
          </div>
          
          {/* New badge or completed icon */}
          {isNew && (
            <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              NEW
            </div>
          )}
          {isCompleted && (
            <div className="absolute right-3 top-3 rounded-full bg-green-500/90 p-1 shadow-sm backdrop-blur-sm">
              <Award className="h-4 w-4 text-white" />
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
            <div className="rounded-full bg-indigo-600/90 p-3 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-110">
              <PlayCircle className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-1.5 w-full bg-gray-100 dark:bg-gray-800">
          <Progress value={progress} className="h-full rounded-none" indicatorClassName={
            isCompleted ? "bg-green-500" : progress >= 70 ? "bg-amber-500" : "bg-indigo-600"
          } />
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{title}</h3>
        </div>
        
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
        
        <div className="mb-4 flex flex-wrap gap-3 text-xs">
          {duration && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{duration}</span>
            </div>
          )}
          
          {lessons && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <span className="font-medium">{lessons} Lessons</span>
            </div>
          )}
          
          {instructor && (
            <div className="ml-auto flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <span>by <span className="font-medium text-gray-700 dark:text-gray-300">{instructor}</span></span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{progress}% Complete</span>
                {lastAccessed && (
                  <p className="mt-0.5">Last accessed: {formattedDate}</p>
                )}
              </div>
            </div>
          </div>
          
          <Button asChild className="gap-1" size="sm">
            <Link href={`/student/courses/${id}`}>
              {progress > 0 ? 'Continue' : 'Start Course'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 animate-pulse">
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800">
        <div className="h-full w-2/3 bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="flex justify-between pt-2">
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-9 w-24 rounded bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
}