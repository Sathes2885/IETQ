import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const statVariants = cva(
  "rounded-xl border p-4 transition-all",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800",
        purple: "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-950/50 dark:to-indigo-950/50 dark:border-purple-900/50",
        blue: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-900/50",
        amber: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 dark:from-amber-950/50 dark:to-yellow-950/50 dark:border-amber-900/50",
        green: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-950/50 dark:to-green-950/50 dark:border-emerald-900/50",
        pink: "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 dark:from-pink-950/50 dark:to-rose-950/50 dark:border-pink-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconVariants = cva(
  "p-2 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
        blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
        amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400", 
        green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
        pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const valueVariants = cva(
  "font-display text-2xl sm:text-3xl font-bold",
  {
    variants: {
      variant: {
        default: "text-gray-900 dark:text-gray-100",
        purple: "text-purple-700 dark:text-purple-300",
        blue: "text-blue-700 dark:text-blue-300",
        amber: "text-amber-700 dark:text-amber-300",
        green: "text-emerald-700 dark:text-emerald-300",
        pink: "text-pink-700 dark:text-pink-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  variant?: "default" | "purple" | "blue" | "amber" | "green" | "pink";
  className?: string;
  isLoading?: boolean;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
  className,
  isLoading = false,
}: StatsCardProps) {
  return (
    <div className={cn(
      statVariants({ variant }),
      "relative overflow-hidden shadow-sm backdrop-blur-sm",
      className
    )}>
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <h3 className={cn(
                valueVariants({ variant }),
                "mt-1"
              )}>{value}</h3>
            </div>
            {icon && (
              <div className={cn(
                iconVariants({ variant })
              )}>
                {icon}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            )}
            
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isUpward 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : "text-rose-600 dark:text-rose-400"
              )}>
                <span>
                  {trend.isUpward ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          
          {/* Decorative background element */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 blur-2xl" 
               style={{ 
                 background: 
                   variant === "purple" ? "radial-gradient(circle, rgba(147, 51, 234, 0.8), rgba(79, 70, 229, 0.4))" :
                   variant === "blue" ? "radial-gradient(circle, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.4))" :
                   variant === "amber" ? "radial-gradient(circle, rgba(245, 158, 11, 0.8), rgba(252, 211, 77, 0.4))" :
                   variant === "green" ? "radial-gradient(circle, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.4))" :
                   variant === "pink" ? "radial-gradient(circle, rgba(236, 72, 153, 0.8), rgba(219, 39, 119, 0.4))" :
                   "radial-gradient(circle, rgba(107, 114, 128, 0.6), rgba(75, 85, 99, 0.3))"
               }}
          />
        </>
      )}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
        </div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
}