import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface TickerProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
  separator?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export function Ticker({
  items,
  speed = 50, // pixels per second
  direction = 'left',
  pauseOnHover = true,
  className,
  itemClassName,
  separator = '•',
  backgroundColor,
  textColor
}: TickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const tickerContentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  
  useEffect(() => {
    if (!tickerRef.current || !tickerContentRef.current) return;
    
    const ticker = tickerRef.current;
    const tickerContent = tickerContentRef.current;
    const contentWidth = tickerContent.offsetWidth;
    const duration = contentWidth / speed;
    
    // Clone the content to create a seamless loop
    const clone = tickerContent.cloneNode(true) as HTMLDivElement;
    ticker.appendChild(clone);
    
    // Reset any previous animation
    if (animationRef.current) {
      animationRef.current.kill();
    }
    
    // Set initial positions
    gsap.set(tickerContent, { x: direction === 'left' ? 0 : -contentWidth });
    gsap.set(clone, { x: direction === 'left' ? contentWidth : 0 });
    
    // Create the animation
    const moveX = direction === 'left' ? -contentWidth : contentWidth;
    
    // Create timeline for seamless looping
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to([tickerContent, clone], { 
      x: `+=${moveX}`, 
      duration: duration, 
      ease: 'none' 
    });
    
    animationRef.current = tl;
    
    // Pause on hover if enabled
    if (pauseOnHover) {
      ticker.addEventListener('mouseenter', () => tl.pause());
      ticker.addEventListener('mouseleave', () => tl.play());
    }
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      if (ticker.contains(clone)) {
        ticker.removeChild(clone);
      }
      if (pauseOnHover) {
        ticker.removeEventListener('mouseenter', () => tl.pause());
        ticker.removeEventListener('mouseleave', () => tl.play());
      }
    };
  }, [items, speed, direction, pauseOnHover]);
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden whitespace-nowrap", 
        className
      )}
      style={{ backgroundColor, color: textColor }}
      ref={tickerRef}
    >
      <div className="inline-block" ref={tickerContentRef}>
        {items.map((item, index) => (
          <span key={index} className={cn("inline-block px-4", itemClassName)}>
            {item}
            {index < items.length - 1 && (
              <span className="px-2 opacity-50">{separator}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

interface TickerSectionProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  children?: React.ReactNode;
}

export function TickerSection({
  items,
  speed,
  direction,
  className,
  backgroundColor = 'bg-primary',
  textColor = 'text-primary-foreground',
  children
}: TickerSectionProps) {
  return (
    <section className={cn("py-6", className)} style={{ backgroundColor }}>
      <Ticker 
        items={items} 
        speed={speed}
        direction={direction}
        className="py-3 font-medium text-base md:text-lg"
        textColor={textColor}
      />
      {children && <div className="container mx-auto mt-6">{children}</div>}
    </section>
  );
}