import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface RotationCardProps {
  frontContent: React.ReactNode;
  backContent?: React.ReactNode;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
  rotateOnHover?: boolean;
  rotateOnClick?: boolean;
  rotationDuration?: number;
  perspective?: number;
  rotate3d?: [number, number, number, number];
  backgroundColor?: string;
  rotateDegrees?: number;
}

export function RotationCard({
  frontContent,
  backContent,
  className,
  frontClassName,
  backClassName,
  rotateOnHover = true,
  rotateOnClick = false,
  rotationDuration = 0.6,
  perspective = 1000,
  rotate3d = [0, 1, 0, 180], // rotate around Y axis by default
  backgroundColor,
  rotateDegrees = 180
}: RotationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Handler for click rotation
  const handleClick = () => {
    if (rotateOnClick) {
      setIsFlipped(!isFlipped);
    }
  };
  
  // Setup the 3D rotation effect with GSAP
  useEffect(() => {
    if (!cardInnerRef.current) return;
    
    const card = cardInnerRef.current;
    
    if (isFlipped) {
      gsap.to(card, {
        rotateY: rotateDegrees,
        duration: rotationDuration,
        ease: 'power2.inOut'
      });
    } else {
      gsap.to(card, {
        rotateY: 0,
        duration: rotationDuration,
        ease: 'power2.inOut'
      });
    }
  }, [isFlipped, rotationDuration, rotateDegrees]);
  
  // Hover effect handlers
  const handleMouseEnter = () => {
    if (rotateOnHover && !rotateOnClick) {
      setIsFlipped(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (rotateOnHover && !rotateOnClick) {
      setIsFlipped(false);
    }
  };
  
  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative w-full cursor-pointer flip-card transform-gpu',
        className
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: `${perspective}px`, backgroundColor }}
    >
      <div
        ref={cardInnerRef}
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-gpu preserve-3d",
          {
            "flip-card-inner": true,
          }
        )}
      >
        {/* Front face */}
        <div
          className={cn(
            'absolute w-full h-full transform-gpu backface-hidden flip-card-front',
            frontClassName
          )}
        >
          {frontContent}
        </div>
        
        {/* Back face */}
        {backContent && (
          <div
            className={cn(
              'absolute w-full h-full transform-gpu backface-hidden flip-card-back',
              backClassName
            )}
            style={{ 
              transform: `rotateY(${rotateDegrees}deg)`
            }}
          >
            {backContent}
          </div>
        )}
      </div>
    </div>
  );
}

interface RotationCardGridProps {
  cards: {
    id: string | number;
    frontContent: React.ReactNode;
    backContent?: React.ReactNode;
    frontClassName?: string;
    backClassName?: string;
  }[];
  columns?: number;
  gap?: number;
  className?: string;
  cardClassName?: string;
  backgroundColor?: string;
}

export function RotationCardGrid({
  cards,
  columns = 3,
  gap = 4,
  className,
  cardClassName,
  backgroundColor
}: RotationCardGridProps) {
  const colClass = columns === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
                   columns === 4 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 
                   `grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 4)}`;
  
  return (
    <div
      className={cn(
        `grid gap-6 ${colClass}`,
        className
      )}
      style={{ backgroundColor }}
    >
      {cards.map((card) => (
        <div key={card.id} className="flip-card depth-effect css-only transform-gpu">
          <div className="flip-card-inner transform-gpu preserve-3d" style={{ minHeight: "320px" }}>
            <div className={cn('flip-card-front backface-hidden transform-gpu', card.frontClassName)}>
              {card.frontContent}
            </div>
            {card.backContent && (
              <div className={cn('flip-card-back backface-hidden transform-gpu', card.backClassName)}>
                {card.backContent}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RotationCardSection({
  title,
  subtitle,
  cards,
  columns,
  className,
  backgroundColor = 'bg-slate-100',
  textColor = 'text-slate-900'
}: {
  title?: string;
  subtitle?: string;
  cards: RotationCardGridProps['cards'];
  columns?: number;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
}) {
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
        <RotationCardGrid
          cards={cards}
          columns={columns}
          className="mt-8"
        />
      </div>
    </section>
  );
}