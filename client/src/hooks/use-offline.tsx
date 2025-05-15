import { useState, useEffect, useCallback } from 'react';
import {
  queueRequest,
  getCachedData,
  hasPendingRequests,
  cacheData,
  initOfflineSync
} from '@/lib/offlineSync';

// Initialize offline sync when this module is imported
initOfflineSync();

/**
 * Hook for managing offline functionality in a component
 * @returns Object with offline state and utilities
 */
export function useOffline() {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [pendingActions, setPendingActions] = useState<number>(0);

  // Update offline status when online/offline events change
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      checkPendingActions();
    };
    
    const handleOffline = () => {
      setIsOffline(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check for any pending actions
    checkPendingActions();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check for pending actions that need to be synced
  const checkPendingActions = useCallback(async () => {
    try {
      const hasPending = await hasPendingRequests();
      setPendingActions(hasPending ? 1 : 0); // We only care if there are any, not the exact count
    } catch (error) {
      console.error('Error checking pending actions:', error);
    }
  }, []);

  /**
   * Get data with offline support
   * @param endpoint API endpoint
   * @param fetchFn Function to fetch fresh data
   * @param expiryMinutes Cache expiry in minutes
   * @returns The fetched or cached data
   */
  const getDataWithOfflineSupport = async <T,>(
    endpoint: string,
    fetchFn: () => Promise<T>,
    expiryMinutes: number = 60
  ): Promise<T | null> => {
    try {
      // Try to get from network if online
      if (navigator.onLine) {
        try {
          const data = await fetchFn();
          
          // Cache the successful response for offline use
          await cacheData(endpoint, data, expiryMinutes);
          
          return data;
        } catch (error) {
          console.error(`Network request failed for ${endpoint}:`, error);
          // Fall back to cache if network request fails
        }
      }
      
      // Offline or network request failed, try to get from cache
      const cachedData = await getCachedData(endpoint);
      return cachedData as T;
    } catch (error) {
      console.error(`Error in getDataWithOfflineSupport for ${endpoint}:`, error);
      return null;
    }
  };

  /**
   * Submit data with offline support
   * @param endpoint API endpoint
   * @param method HTTP method
   * @param data Data to submit
   * @returns Object indicating success or offline queueing
   */
  const submitWithOfflineSupport = async (
    endpoint: string,
    method: string,
    data: any
  ): Promise<{ success: boolean; offline: boolean; message: string; id?: string }> => {
    try {
      // If online, try to submit directly
      if (navigator.onLine) {
        try {
          const response = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          
          if (response.ok) {
            return { 
              success: true, 
              offline: false, 
              message: 'Request processed successfully.' 
            };
          }
          
          // Network request failed despite being online
          throw new Error(`Request failed with status ${response.status}`);
        } catch (error) {
          console.error(`Online submission failed for ${endpoint}:`, error);
          // If the fetch fails, queue it for later
        }
      }
      
      // Offline or network request failed, queue for later
      const id = await queueRequest(endpoint, method, data);
      
      // Update pending actions count
      await checkPendingActions();
      
      return { 
        success: false, 
        offline: true, 
        message: 'You appear to be offline. Your request has been saved and will be processed when you reconnect.',
        id
      };
    } catch (error) {
      console.error(`Error in submitWithOfflineSupport for ${endpoint}:`, error);
      return { 
        success: false, 
        offline: isOffline, 
        message: 'An error occurred while processing your request. Please try again.' 
      };
    }
  };

  return {
    isOffline,
    hasPendingActions: pendingActions > 0,
    pendingActionsCount: pendingActions,
    getDataWithOfflineSupport,
    submitWithOfflineSupport,
  };
}

/**
 * Higher-order component for offline data fetching
 * @param Component Component to enhance with offline capabilities
 * @returns Enhanced component with offline data capabilities
 */
export function withOfflineSupport<P extends object>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const offlineSupport = useOffline();
    
    return <Component {...props} offlineSupport={offlineSupport} />;
  };
}