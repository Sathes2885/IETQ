import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease';
  };
  changeText?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AnalyticsCard({
  title,
  value,
  change,
  changeText,
  className,
  children,
}: AnalyticsCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="mt-1 flex items-center text-xs">
            <span
              className={cn(
                'flex items-center font-medium',
                change.type === 'increase' ? 'text-green-500' : 'text-red-500'
              )}
            >
              {change.type === 'increase' ? (
                <ArrowUpIcon className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3" />
              )}
              {change.value}
              {typeof change.value === 'number' ? '%' : ''}
            </span>
            {changeText && <span className="ml-1 text-muted-foreground">{changeText}</span>}
          </div>
        )}
      </CardContent>
      {children && <CardFooter className="p-0">{children}</CardFooter>}
    </Card>
  );
}

export function AnalyticsTrendCard({
  title,
  value,
  change,
  data,
  className,
}: AnalyticsCardProps & { data?: React.ReactNode }) {
  return (
    <AnalyticsCard
      title={title}
      value={value}
      change={change}
      className={cn('relative', className)}
    >
      {data && <div className="absolute bottom-0 left-0 right-0 h-16">{data}</div>}
    </AnalyticsCard>
  );
}