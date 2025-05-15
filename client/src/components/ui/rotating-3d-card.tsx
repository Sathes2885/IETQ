import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface Rotating3DCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
  rotationDuration?: number;
  rotationPause?: number;
}

export function Rotating3DCard({
  frontContent,
  backContent,
  className,
  frontClassName,
  backClassName,
  rotationDuration = 1.5,
  rotationPause = 3
}: Rotating3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    // Create the rotation timeline
    const timeline = gsap.timeline({ repeat: -1 });
    
    // Initial state (showing front)
    timeline.set(cardRef.current, { rotateY: 0 });
    
    // Pause briefly on front
    timeline.to(cardRef.current, { duration: rotationPause, rotateY: 0 });
    
    // Rotate to back
    timeline.to(cardRef.current, { 
      duration: rotationDuration, 
      rotateY: 180, 
      ease: "power1.inOut" 
    });
    
    // Pause briefly on back
    timeline.to(cardRef.current, { duration: rotationPause, rotateY: 180 });
    
    // Rotate back to front
    timeline.to(cardRef.current, { 
      duration: rotationDuration, 
      rotateY: 360, 
      ease: "power1.inOut",
      onComplete: () => {
        // Reset rotation to avoid large numbers after long periods
        gsap.set(cardRef.current, { rotateY: 0 });
      }
    });
    
    return () => {
      timeline.kill();
    };
  }, [rotationDuration, rotationPause]);
  
  return (
    <div className={cn('perspective-1000 w-full h-full', className)}>
      <div 
        ref={cardRef}
        className="w-full h-full relative preserve-3d transform-gpu"
      >
        {/* Front */}
        <div className={cn(
          'absolute w-full h-full backface-hidden rounded-lg',
          frontClassName
        )}>
          {frontContent}
        </div>
        
        {/* Back */}
        <div className={cn(
          'absolute w-full h-full backface-hidden rounded-lg rotate-y-180',
          backClassName
        )}>
          {backContent}
        </div>
      </div>
    </div>
  );
}

interface Rotating3DCardSectionProps {
  title: string;
  subtitle?: string;
  cards: {
    id: string | number;
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
    frontClassName?: string;
    backClassName?: string;
  }[];
  className?: string;
}

export function Rotating3DCardSection({
  title,
  subtitle,
  cards,
  className
}: Rotating3DCardSectionProps) {
  return (
    <section className={cn('py-16 bg-gradient-to-b from-purple-50 to-indigo-50', className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-indigo-800 flex items-center justify-center">
            <span className="mr-4">{title}</span>
            
            {/* Small rotating 3D card next to title */}
            <div className="w-16 h-16 inline-block">
              <Rotating3DCard
                frontContent={
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-lg">
                    3D
                  </div>
                }
                backContent={
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xl font-bold rounded-lg">
                    🚀
                  </div>
                }
                rotationDuration={1.2}
                rotationPause={2}
              />
            </div>
          </h2>
          
          {subtitle && (
            <p className="text-lg text-indigo-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={card.id} className="h-96">
              <Rotating3DCard
                frontContent={card.frontContent}
                backContent={card.backContent}
                frontClassName={card.frontClassName}
                backClassName={card.backClassName}
                rotationDuration={1.5}
                rotationPause={3 + index * 0.5} // Stagger the animations
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}