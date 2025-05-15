import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;
let registration: ServiceWorkerRegistration | null = null;

// Service Worker update notifications and refresh handling
const handleServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
  // Show notification to the user that there's an update available
  const updateAvailable = window.confirm(
    'A new version of the application is available. Reload to update?'
  );

  if (updateAvailable && registration.waiting) {
    // Send message to SW to skip waiting and activate new SW
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Reload once the new Service Worker activates
    registration.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
};

// Register and setup the Service Worker
export const register = () => {
  if ('serviceWorker' in navigator) {
    // Initialize the Workbox instance
    wb = new Workbox('/service-worker.js');

    // Add update handler
    wb.addEventListener('waiting', (event) => {
      if (event.isUpdate && registration) {
        handleServiceWorkerUpdate(registration);
      }
    });

    // Register the service worker
    wb.register()
      .then((reg) => {
        registration = reg;
        console.log('Service Worker registered successfully');
        
        // Handle service worker updates
        if (reg.waiting) {
          handleServiceWorkerUpdate(reg);
        }
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
};

// Check for app updates
export const checkForUpdates = async () => {
  if (wb) {
    try {
      await wb.update();
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }
};

// Request permission for push notifications
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (): Promise<boolean> => {
  try {
    if (!registration) {
      console.error('Service Worker not registered');
      return false;
    }

    // Check if push is supported
    if (!('PushManager' in window)) {
      console.log('Push notifications not supported');
      return false;
    }

    // Get permission
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      return false;
    }

    // Get the push subscription
    const existingSubscription = await registration.pushManager.getSubscription();
    
    // If already subscribed, return success
    if (existingSubscription) {
      return true;
    }

    // TODO: Replace with your actual VAPID public key
    const publicVapidKey = 'YOUR_PUBLIC_VAPID_KEY';
    
    // Subscribe the user
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    // Send the subscription to your backend
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscription }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
};

// Utility function for VAPID key conversion
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Trigger background sync
export const triggerBackgroundSync = async (tag: string = 'sync-pending-requests'): Promise<boolean> => {
  try {
    if (!registration) {
      console.error('Service Worker not registered');
      return false;
    }

    // Check if sync is supported
    if (!('sync' in registration)) {
      console.log('Background sync not supported');
      return false;
    }

    await registration.sync.register(tag);
    return true;
  } catch (error) {
    console.error('Error triggering background sync:', error);
    return false;
  }
};

// Listen for Service Worker messages
export const listenForServiceWorkerMessages = (
  callback: (data: any) => void
) => {
  navigator.serviceWorker.addEventListener('message', (event) => {
    callback(event.data);
  });
};