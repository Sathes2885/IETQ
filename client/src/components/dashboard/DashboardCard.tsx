import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  id?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
}

export function DashboardCard({
  id,
  title,
  description,
  icon,
  className,
  contentClassName,
  children,
  footer,
  isLoading = false,
}: DashboardCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm dark:border-gray-800 dark:bg-gray-950/70 overflow-hidden",
        className
      )}
    >
      {isLoading ? (
        <CardSkeleton hasHeader={!!title} hasFooter={!!footer} />
      ) : (
        <>
          {(title || icon) && (
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {icon && (
                  <div className="flex items-center justify-center rounded-md bg-indigo-500/10 p-2 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                    {icon}
                  </div>
                )}
                <div>
                  {title && <h3 className="font-medium">{title}</h3>}
                  {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
                </div>
              </div>
            </div>
          )}

          {children && <div className={cn("p-4", contentClassName)}>{children}</div>}

          {footer && (
            <div className="border-t border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CardSkeleton({ hasHeader, hasFooter }: { hasHeader: boolean; hasFooter: boolean }) {
  return (
    <div className="animate-pulse">
      {hasHeader && (
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {hasFooter && (
        <div className="border-t border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="h-8 w-24 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>
      )}
    </div>
  );
}