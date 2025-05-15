import { gsap } from 'gsap';

export const fadeIn = (element: HTMLElement | string, delay: number = 0, duration: number = 0.5): gsap.core.Tween => {
  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration,
    delay,
    ease: 'power2.out'
  });
};

export const fadeOut = (element: HTMLElement | string, delay: number = 0, duration: number = 0.5): gsap.core.Tween => {
  return gsap.to(element, {
    opacity: 0,
    y: -20,
    duration,
    delay,
    ease: 'power2.in'
  });
};

export const staggerFadeIn = (elements: HTMLElement[] | string, staggerTime: number = 0.1, delay: number = 0): gsap.core.Timeline => {
  return gsap.timeline({ delay }).from(elements, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: staggerTime,
    ease: 'power2.out'
  });
};

export const scaleOnHover = (element: HTMLElement): void => {
  const enterAnimation = () => {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.2,
      ease: 'power1.out'
    });
  };

  const leaveAnimation = () => {
    gsap.to(element, {
      scale: 1,
      duration: 0.2,
      ease: 'power1.out'
    });
  };

  element.addEventListener('mouseenter', enterAnimation);
  element.addEventListener('mouseleave', leaveAnimation);
};

export const initDashboardAnimations = (): void => {
  // Hero section animation
  const heroHeading = document.querySelector('.hero-heading');
  const heroText = document.querySelector('.hero-text');
  const heroButtons = document.querySelector('.hero-buttons');
  const heroImage = document.querySelector('.hero-image');

  if (heroHeading) {
    gsap.from(heroHeading, {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    });
  }

  if (heroText) {
    gsap.from(heroText, {
      duration: 0.8,
      opacity: 0,
      y: 30,
      delay: 0.2,
      ease: 'power3.out'
    });
  }

  if (heroButtons) {
    gsap.from(heroButtons, {
      duration: 0.8,
      opacity: 0,
      y: 30,
      delay: 0.4,
      ease: 'power3.out'
    });
  }

  if (heroImage) {
    gsap.from(heroImage, {
      duration: 1,
      opacity: 0,
      x: 50,
      delay: 0.3,
      ease: 'power3.out'
    });
  }

  // Setup section animations using Intersection Observer
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        
        // Find all stagger children inside this section
        const staggerContainers = entry.target.querySelectorAll('.stagger-children');
        staggerContainers.forEach(container => {
          container.classList.add('animate');
        });
        
        // Animate section-specific elements
        const sectionHeading = entry.target.querySelector('h2');
        const sectionText = entry.target.querySelector('p');
        
        if (sectionHeading) {
          gsap.from(sectionHeading, {
            duration: 0.7,
            opacity: 0,
            y: 20,
            ease: 'power2.out'
          });
        }
        
        if (sectionText) {
          gsap.from(sectionText, {
            duration: 0.7,
            opacity: 0,
            y: 20,
            delay: 0.1,
            ease: 'power2.out'
          });
        }
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    section.classList.add('section-appear');
    observer.observe(section);
  });

  // Stats cards animation
  const statsCards = document.querySelectorAll('.stat-card');
  if (statsCards.length) {
    gsap.from(statsCards, {
      duration: 0.6,
      opacity: 0,
      y: 30,
      stagger: 0.15,
      ease: 'back.out(1.2)'
    });
  }

  // Course cards animation
  const courseCards = document.querySelectorAll('.course-card');
  if (courseCards.length) {
    gsap.from(courseCards, {
      duration: 0.7,
      opacity: 0,
      y: 40,
      stagger: 0.15,
      ease: 'back.out(1.4)',
      delay: 0.2
    });
  }

  // Competition cards animation
  const competitionCards = document.querySelectorAll('.competition-card');
  if (competitionCards.length) {
    gsap.from(competitionCards, {
      duration: 0.7,
      opacity: 0,
      y: 40,
      stagger: 0.15,
      ease: 'back.out(1.4)',
      delay: 0.3
    });
  }

  // Add hover animations to buttons
  const buttons = document.querySelectorAll('button, .btn, .btn-primary, .btn-secondary');
  buttons.forEach(button => {
    if (button instanceof HTMLElement) {
      scaleOnHover(button);
    }
  });
};

export const animateProgressBars = (): void => {
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  
  progressBars.forEach(bar => {
    const width = bar.getAttribute('data-progress') || '0';
    gsap.to(bar, {
      width: `${width}%`,
      duration: 1,
      ease: 'power2.out',
      delay: 0.5
    });
  });
};

export const animateCountUp = (element: HTMLElement, endValue: number, duration: number = 1.5): void => {
  let startValue = 0;
  const startTime = new Date().getTime();
  const endTime = startTime + duration * 1000;

  const countUp = () => {
    const currentTime = new Date().getTime();
    const remaining = Math.max(0, endTime - currentTime);
    const progress = 1 - remaining / (duration * 1000);
    
    const currentValue = Math.round(startValue + progress * (endValue - startValue));
    element.textContent = currentValue.toString();
    
    if (progress < 1) {
      requestAnimationFrame(countUp);
    } else {
      element.textContent = endValue.toString();
    }
  };

  countUp();
};

// New animated loading state functions
export const animateSkeletonPulse = (elements: HTMLElement | HTMLElement[] | string): gsap.core.Timeline => {
  return gsap.timeline({ repeat: -1 })
    .to(elements, {
      opacity: 0.5,
      duration: 0.8,
      ease: 'sine.inOut'
    })
    .to(elements, {
      opacity: 1,
      duration: 0.8,
      ease: 'sine.inOut'
    });
};

export const animateSkeletonLoading = (): void => {
  const skeletons = document.querySelectorAll('.skeleton');
  if (skeletons.length) {
    animateSkeletonPulse(skeletons as unknown as HTMLElement[]);
  }
};

export const animateLoadingToContent = (
  loadingElement: HTMLElement | string, 
  contentElement: HTMLElement | string
): void => {
  gsap.timeline()
    .to(loadingElement, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        if (loadingElement instanceof HTMLElement) {
          loadingElement.style.display = 'none';
        } else {
          document.querySelectorAll(loadingElement as string).forEach(
            el => (el as HTMLElement).style.display = 'none'
          );
        }
      }
    })
    .from(contentElement, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => {
        if (contentElement instanceof HTMLElement) {
          contentElement.style.display = 'block';
        } else {
          document.querySelectorAll(contentElement as string).forEach(
            el => (el as HTMLElement).style.display = 'block'
          );
        }
      }
    });
};

// React-specific functions for animations
export const useDashboardLoadingAnimation = (
  loadingRef: React.RefObject<HTMLElement>,
  contentRef: React.RefObject<HTMLElement>,
  isLoading: boolean,
  delay: number = 0.5
) => {
  const animate = () => {
    if (loadingRef.current && contentRef.current) {
      if (isLoading) {
        gsap.set(contentRef.current, { display: 'none', opacity: 0 });
        gsap.set(loadingRef.current, { display: 'block', opacity: 1 });
        animateSkeletonPulse(loadingRef.current);
      } else {
        // Stop the pulse animation first
        gsap.killTweensOf(loadingRef.current);
        
        gsap.timeline()
          .to(loadingRef.current, {
            opacity: 0,
            duration: 0.3,
            delay,
            ease: 'power2.in',
            onComplete: () => {
              if (loadingRef.current) {
                loadingRef.current.style.display = 'none';
              }
            }
          })
          .to(contentRef.current, {
            display: 'block',
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            onStart: () => {
              if (contentRef.current) {
                contentRef.current.style.display = 'block';
              }
            }
          });
      }
    }
  };
  
  return animate;
};
