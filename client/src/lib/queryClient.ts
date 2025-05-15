import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from './supabase';
import { getCachedData, cacheData, queueRequest, hasPendingRequests, processPendingRequests } from './offlineSync';

interface OfflineOptions {
  offlineSupport?: boolean;
  cacheMinutes?: number;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper to get current session data from Supabase
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const headers: HeadersInit = {};
  
  if (data.session?.user) {
    headers["x-supabase-user-id"] = data.session.user.id;
    headers["Authorization"] = `Bearer ${data.session.access_token}`;
    
    // Add email to headers to help determine role on the server
    if (data.session.user.email) {
      headers["x-supabase-email"] = data.session.user.email;
    }
    
    // Add user role information if available in user metadata
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.user_metadata?.role) {
        headers["x-supabase-user-role"] = userData.user.user_metadata.role;
        console.log(`Added role header: ${userData.user.user_metadata.role}`);
      }
    } catch (error) {
      console.error("Failed to get user metadata:", error);
    }
  }
  
  return headers;
}

/**
 * Enhanced API request function with offline support
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: OfflineOptions = { offlineSupport: true, cacheMinutes: 60 }
): Promise<Response> {
  // Get auth headers
  const authHeaders = await getAuthHeaders();
  
  // Create headers with auth and content-type if needed
  const headers: HeadersInit = {
    ...authHeaders,
    ...(data ? { "Content-Type": "application/json" } : {})
  };
  
  // Check if we're offline and this request needs offline support
  if (!navigator.onLine && options.offlineSupport) {
    // For GET requests, try to return cached data
    if (method === "GET") {
      const cachedData = await getCachedData(url);
      
      if (cachedData) {
        console.log(`[Offline] Returning cached data for ${url}`);
        // Create a Response object from the cached data
        return new Response(JSON.stringify(cachedData), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      // No cached data available, return offline error
      console.log(`[Offline] No cached data available for ${url}`);
      throw new Error('You are offline and this data is not available in your cache.');
    }
    
    // For write operations, queue them for later
    if (method === "POST" || method === "PUT" || method === "DELETE" || method === "PATCH") {
      // Queue the request for later processing
      const requestId = await queueRequest(url, method, data);
      console.log(`[Offline] Queued ${method} request to ${url} with ID: ${requestId}`);
      
      // Return a fake successful response
      return new Response(JSON.stringify({
        success: true,
        message: 'Your request has been queued for processing when you go back online.',
        offline: true,
        requestId,
        queued: true
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 202, // Accepted
      });
    }
  }
  
  // Online case - proceed with normal request
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    
    // If this is a successful GET request and we have offline support enabled, cache the result
    if (method === "GET" && options.offlineSupport && res.headers.get('Content-Type')?.includes('application/json')) {
      // Clone the response before reading its body
      const clonedResponse = res.clone();
      const jsonData = await clonedResponse.json();
      
      // Cache the response data
      await cacheData(url, jsonData, options.cacheMinutes || 60);
    }
    
    return res;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    
    // If we have offline support and it's a GET request, try to fall back to cache even if we're online
    // This handles cases where the server is down but we still have internet
    if (options.offlineSupport && method === "GET") {
      const cachedData = await getCachedData(url);
      
      if (cachedData) {
        console.log(`[Fallback] Returning cached data for ${url} after failed request`);
        return new Response(JSON.stringify(cachedData), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }
    
    // Re-throw the error for the caller to handle
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
  offlineSupport?: boolean;
  cacheMinutes?: number;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior, offlineSupport = true, cacheMinutes = 60 }) =>
  async ({ queryKey }) => {
    try {
      // Get auth headers
      const authHeaders = await getAuthHeaders();
      
      // Check if we're offline and this request needs offline support
      if (!navigator.onLine && offlineSupport) {
        const cachedData = await getCachedData(queryKey[0] as string);
        
        if (cachedData) {
          console.log(`[Offline] Returning cached data for query ${queryKey[0]}`);
          return cachedData;
        }
        
        console.log(`[Offline] No cached data for query ${queryKey[0]}`);
        throw new Error(`You are offline and this data is not available in your cache.`);
      }
      
      // Online case - proceed with normal request
      const res = await fetch(queryKey[0] as string, {
        headers: authHeaders,
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Cache the successful response if offline support is enabled
      if (offlineSupport) {
        await cacheData(queryKey[0] as string, data, cacheMinutes);
      }
      
      return data;
    } catch (error) {
      console.error(`Query error for ${queryKey[0]}:`, error);
      
      // If we have offline support, try to fall back to cache even if we're online
      // This handles cases where the server is down but we still have internet
      if (offlineSupport) {
        const cachedData = await getCachedData(queryKey[0] as string);
        
        if (cachedData) {
          console.log(`[Fallback] Returning cached data for query ${queryKey[0]} after failed request`);
          return cachedData;
        }
      }
      
      // Re-throw the error for React Query to handle
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ 
        on401: "throw",
        offlineSupport: true,
        cacheMinutes: 60
      }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: (failureCount, error) => {
        // Don't retry if we're offline
        if (!navigator.onLine) return false;
        
        // Only retry network errors, not 4xx/5xx responses
        const isNetworkError = error instanceof Error && 
          !error.message.match(/^[4-5][0-9][0-9]/);
          
        // Retry up to 2 times for network errors only
        return isNetworkError && failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * Check if there are pending offline requests waiting to be processed
 */
export async function checkPendingOfflineRequests(): Promise<boolean> {
  return await hasPendingRequests();
}

/**
 * Sync any pending offline requests - can be called when coming back online
 */
export async function syncOfflineRequests(): Promise<{ success: number; failed: number }> {
  // Try to use the background sync API if available
  if ('serviceWorker' in navigator && 'SyncManager' in window && navigator.serviceWorker.controller) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-pending-requests');
      console.log('Background sync registered');
      return { success: 0, failed: 0 }; // We don't know the actual counts here
    } catch (error) {
      console.error('Failed to register background sync:', error);
      // Fall back to manual sync
    }
  }
  
  // Fallback for browsers without background sync support
  console.log('Using manual sync fallback');
  return await processPendingRequests();
}
