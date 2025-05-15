import React from 'react';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
}

export function FlipCard({ 
  frontContent, 
  backContent, 
  className,
  frontClassName,
  backClassName
}: FlipCardProps) {
  return (
    <div className={cn("h-full w-full perspective-1000 group", className)}>
      <div className="relative h-full w-full duration-500 preserve-3d group-hover:rotate-y-180">
        {/* Front */}
        <div className={cn(
          "absolute h-full w-full backface-hidden rounded-lg", 
          frontClassName
        )}>
          {frontContent}
        </div>
        
        {/* Back */}
        <div className={cn(
          "absolute h-full w-full backface-hidden rounded-lg rotate-y-180", 
          backClassName
        )}>
          {backContent}
        </div>
      </div>
    </div>
  );
}

interface FlipCardSectionProps {
  title?: string;
  subtitle?: string;
  cards: {
    id: string | number;
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
    frontClassName?: string;
    backClassName?: string;
  }[];
  columns?: number;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

export function FlipCardSection({
  title,
  subtitle,
  cards,
  columns = 3,
  backgroundColor,
  textColor,
  className
}: FlipCardSectionProps) {
  const colClass = 
    columns === 1 ? 'grid-cols-1' :
    columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
    columns === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
    columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

  return (
    <section 
      className={cn('py-16', className)} 
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2 className={cn('text-3xl font-bold mb-3 text-center', textColor)}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className={cn('text-lg mb-10 text-center max-w-2xl mx-auto', textColor)}>
            {subtitle}
          </p>
        )}
        
        <div className={cn('grid gap-6', colClass)}>
          {cards.map((card) => (
            <div key={card.id} className="h-96">
              <FlipCard
                frontContent={card.frontContent}
                backContent={card.backContent}
                frontClassName={card.frontClassName}
                backClassName={card.backClassName}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}