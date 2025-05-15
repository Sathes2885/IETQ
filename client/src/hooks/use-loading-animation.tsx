import { useRef, useEffect } from 'react';
import { useDashboardLoadingAnimation } from '@/lib/animations';

/**
 * Hook to handle animations between loading and content states
 * @param isLoading Boolean indicating if data is still loading
 * @param delay Optional delay before showing content after loading completes
 * @returns Object containing refs to attach to loading and content elements
 */
export function useLoadingAnimation(isLoading: boolean, delay: number = 0.5) {
  const loadingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const animate = useDashboardLoadingAnimation(loadingRef, contentRef, isLoading, delay);
  
  useEffect(() => {
    animate();
  }, [isLoading, animate]);
  
  return {
    loadingRef,
    contentRef
  };
}

/**
 * Hook to handle animations for dashboard sections with multiple loading states
 * @param loadingStates Array of boolean loading states for different sections
 * @param staggerDelay Delay between animating different sections
 * @returns Array of refs to attach to each section's loading and content elements
 */
export function useDashboardSectionAnimations(
  loadingStates: boolean[],
  staggerDelay: number = 0.2
) {
  const sectionRefs = loadingStates.map(() => ({
    loadingRef: useRef<HTMLDivElement>(null),
    contentRef: useRef<HTMLDivElement>(null)
  }));
  
  useEffect(() => {
    loadingStates.forEach((isLoading, index) => {
      const { loadingRef, contentRef } = sectionRefs[index];
      const delay = index * staggerDelay;
      
      const animate = useDashboardLoadingAnimation(
        loadingRef,
        contentRef,
        isLoading,
        delay
      );
      
      animate();
    });
  }, [loadingStates, staggerDelay]);
  
  return sectionRefs;
}