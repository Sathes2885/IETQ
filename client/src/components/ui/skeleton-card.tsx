import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SkeletonCardProps {
  className?: string;
  hasIcon?: boolean;
  hasTitle?: boolean;
  hasFooter?: boolean;
  height?: number;
}

export function SkeletonCard({
  className,
  hasIcon = true,
  hasTitle = true,
  hasFooter = false,
  height = 120
}: SkeletonCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          {hasIcon && (
            <Skeleton className="h-10 w-10 rounded-md" />
          )}
          <div className="space-y-2 flex-1">
            {hasTitle && (
              <Skeleton className="h-4 w-3/4" />
            )}
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-3">
          <Skeleton className={`h-${height/4} w-full`} />
          <Skeleton className={`h-${height/4} w-3/4`} />
          {hasFooter && (
            <>
              <Skeleton className="h-px w-full bg-gray-200 my-2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonCard key={index} height={100} />
      ))}
    </div>
  );
}

export function SkeletonCourseList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonCard key={index} height={200} hasFooter={true} />
      ))}
    </div>
  );
}

export function SkeletonCompetitionList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonCard key={index} height={180} hasFooter={true} />
      ))}
    </div>
  );
}

export function SkeletonQuizList() {
  return (
    <div className="grid grid-cols-1 gap-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonCard key={index} height={100} />
      ))}
    </div>
  );
}