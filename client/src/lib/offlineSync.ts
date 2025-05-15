import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the database schema
interface IETQSyncDB extends DBSchema {
  pendingRequests: {
    key: string;
    value: {
      id: string;
      url: string;
      method: string;
      body: any;
      timestamp: number;
      retries: number;
    };
    indexes: { 'by-timestamp': number };
  };
  cachedData: {
    key: string;
    value: {
      id: string;
      endpoint: string;
      data: any;
      timestamp: number;
      expiry: number;
    };
    indexes: { 'by-endpoint': string; 'by-expiry': number };
  };
  userActions: {
    key: string;
    value: {
      id: string;
      type: string;
      data: any;
      timestamp: number;
      synced: boolean;
    };
    indexes: { 'by-type': string; 'by-synced': boolean };
  };
}

let db: IDBPDatabase<IETQSyncDB> | null = null;

/**
 * Initialize the IndexedDB database for offline functionality
 */
export async function initOfflineDB(): Promise<IDBPDatabase<IETQSyncDB>> {
  if (db) return db;
  
  db = await openDB<IETQSyncDB>('ietq-offline-sync', 1, {
    upgrade(database) {
      // Create object stores
      const pendingStore = database.createObjectStore('pendingRequests', { keyPath: 'id' });
      pendingStore.createIndex('by-timestamp', 'timestamp');
      
      const cacheStore = database.createObjectStore('cachedData', { keyPath: 'id' });
      cacheStore.createIndex('by-endpoint', 'endpoint');
      cacheStore.createIndex('by-expiry', 'expiry');
      
      const actionsStore = database.createObjectStore('userActions', { keyPath: 'id' });
      actionsStore.createIndex('by-type', 'type');
      actionsStore.createIndex('by-synced', 'synced');
    },
  });
  
  return db;
}

/**
 * Queue a request to be processed later when online
 */
export async function queueRequest(url: string, method: string, body?: any): Promise<string> {
  const database = await initOfflineDB();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const request = {
    id,
    url,
    method,
    body,
    timestamp: Date.now(),
    retries: 0,
  };
  
  await database.add('pendingRequests', request);
  
  // Register for sync if supported
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-pending-requests');
  }
  
  return id;
}

/**
 * Cache data from API response for offline use
 */
export async function cacheData(endpoint: string, data: any, expiryMinutes: number = 60): Promise<void> {
  const database = await initOfflineDB();
  const id = `cache-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  const cacheEntry = {
    id,
    endpoint,
    data,
    timestamp: Date.now(),
    expiry: Date.now() + (expiryMinutes * 60 * 1000),
  };
  
  // Use put to overwrite any existing data for this endpoint
  await database.put('cachedData', cacheEntry);
}

/**
 * Retrieve cached data for an endpoint
 */
export async function getCachedData(endpoint: string): Promise<any | null> {
  const database = await initOfflineDB();
  const id = `cache-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  try {
    const cachedEntry = await database.get('cachedData', id);
    
    // Check if data exists and is not expired
    if (cachedEntry && cachedEntry.expiry > Date.now()) {
      return cachedEntry.data;
    }
    
    // Remove expired data
    if (cachedEntry) {
      await database.delete('cachedData', id);
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
}

/**
 * Check if there are pending requests that need synchronization
 */
export async function hasPendingRequests(): Promise<boolean> {
  const database = await initOfflineDB();
  const count = await database.count('pendingRequests');
  return count > 0;
}

/**
 * Process all pending requests
 */
export async function processPendingRequests(): Promise<{ success: number; failed: number }> {
  const database = await initOfflineDB();
  const pendingRequests = await database.getAll('pendingRequests');
  
  let successCount = 0;
  let failedCount = 0;
  
  for (const request of pendingRequests) {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: request.method !== 'GET' ? JSON.stringify(request.body) : undefined,
      });
      
      if (response.ok) {
        // Request succeeded, remove from queue
        await database.delete('pendingRequests', request.id);
        successCount++;
      } else {
        // Request failed, increment retry count
        request.retries += 1;
        
        // If we've tried too many times, give up
        if (request.retries >= 5) {
          await database.delete('pendingRequests', request.id);
          failedCount++;
        } else {
          await database.put('pendingRequests', request);
          failedCount++;
        }
      }
    } catch (error) {
      console.error('Error processing pending request:', error);
      failedCount++;
    }
  }
  
  return { success: successCount, failed: failedCount };
}

/**
 * Save a user action for later sync
 */
export async function saveUserAction(type: string, data: any): Promise<string> {
  const database = await initOfflineDB();
  const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const action = {
    id,
    type,
    data,
    timestamp: Date.now(),
    synced: false,
  };
  
  await database.add('userActions', action);
  
  return id;
}

/**
 * Get all unsynchronized user actions
 */
export async function getUnsyncedActions(): Promise<any[]> {
  const database = await initOfflineDB();
  const index = database.transaction('userActions').store.index('by-synced');
  return index.getAll(IDBKeyRange.only(false));
}

/**
 * Mark a user action as synced
 */
export async function markActionSynced(id: string): Promise<void> {
  const database = await initOfflineDB();
  const tx = database.transaction('userActions', 'readwrite');
  const action = await tx.store.get(id);
  
  if (action) {
    action.synced = true;
    await tx.store.put(action);
  }
  
  await tx.done;
}

/**
 * Clear expired cache entries
 */
export async function cleanupExpiredCache(): Promise<number> {
  const database = await initOfflineDB();
  const tx = database.transaction('cachedData', 'readwrite');
  const index = tx.store.index('by-expiry');
  
  let deletedCount = 0;
  let cursor = await index.openCursor(IDBKeyRange.upperBound(Date.now()));
  
  while (cursor) {
    await cursor.delete();
    deletedCount++;
    cursor = await cursor.continue();
  }
  
  await tx.done;
  return deletedCount;
}

/**
 * Prefetch important data for offline use
 */
export async function prefetchImportantData(): Promise<void> {
  // Fetch and cache critical data
  const criticalEndpoints = [
    '/api/student/dashboard',
    '/api/competitions?status=active',
    '/api/user/profile',
  ];
  
  for (const endpoint of criticalEndpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        await cacheData(endpoint, data, 120); // Cache for 2 hours
      }
    } catch (error) {
      console.error(`Failed to prefetch ${endpoint}:`, error);
    }
  }
}

/**
 * Initialize offline synchronization functionality
 */
export function initOfflineSync(): void {
  // Initialize the database
  initOfflineDB().catch(error => {
    console.error('Failed to initialize offline database:', error);
  });
  
  // Setup online/offline event handlers
  window.addEventListener('online', async () => {
    console.log('App is online! Syncing pending requests...');
    
    try {
      const result = await processPendingRequests();
      console.log(`Sync complete: ${result.success} successful, ${result.failed} failed`);
      
      // Notify the user
      if (result.success > 0) {
        // Show success notification
      }
      
      // Refresh data if needed
      if (result.success > 0) {
        // Trigger data refresh
      }
    } catch (error) {
      console.error('Error during sync:', error);
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('App is offline! Switching to offline mode...');
    // Trigger offline mode UI updates
  });
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
  
  // Clean up expired cache once a day
  setInterval(async () => {
    try {
      const deleted = await cleanupExpiredCache();
      console.log(`Cleaned up ${deleted} expired cache entries`);
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  }, 24 * 60 * 60 * 1000);
}