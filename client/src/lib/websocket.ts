// WebSocket service for real-time communication

let websocket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
const reconnectInterval = 3000; // 3 seconds
const maxReconnectAttempts = 5;
let reconnectAttempts = 0;
let isConnecting = false;

// Event listeners
const messageListeners: ((data: any) => void)[] = [];
const connectionListeners: ((status: boolean) => void)[] = [];

/**
 * Initialize WebSocket connection
 */
export function initWebSocket() {
  if (websocket && (websocket.readyState === WebSocket.OPEN || websocket.readyState === WebSocket.CONNECTING) || isConnecting) {
    return;
  }

  isConnecting = true;
  
  try {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('WebSocket connection established');
      isConnecting = false;
      reconnectAttempts = 0;
      
      // Notify listeners about connection
      connectionListeners.forEach(listener => listener(true));
      
      // Send current user activity
      sendUserActivity();
    };
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Notify all message listeners
        messageListeners.forEach(listener => listener(data));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnecting = false;
      // Notify listeners about disconnection
      connectionListeners.forEach(listener => listener(false));
    };
    
    websocket.onclose = () => {
      console.log('WebSocket connection closed');
      isConnecting = false;
      
      // Notify listeners about disconnection
      connectionListeners.forEach(listener => listener(false));
      
      // Try to reconnect
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectTimer = setTimeout(() => {
          reconnectAttempts++;
          console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
          initWebSocket();
        }, reconnectInterval);
      } else {
        console.log('Max reconnect attempts reached. Giving up.');
      }
    };
  } catch (error) {
    console.error('Error creating WebSocket connection:', error);
    isConnecting = false;
  }
}

/**
 * Send user activity update
 */
export function sendUserActivity(status: 'online' | 'away' | 'offline' = 'online') {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    // Queue the message to be sent when connection is established
    return;
  }
  
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      websocket.send(JSON.stringify({
        type: 'userActivity',
        userId: user.id,
        status
      }));
    }
  } catch (error) {
    console.error('Error sending user activity:', error);
  }
}

/**
 * Add message listener
 */
export function addMessageListener(listener: (data: any) => void) {
  messageListeners.push(listener);
  return () => {
    const index = messageListeners.indexOf(listener);
    if (index !== -1) {
      messageListeners.splice(index, 1);
    }
  };
}

/**
 * Add connection status listener
 */
export function addConnectionListener(listener: (status: boolean) => void) {
  connectionListeners.push(listener);
  return () => {
    const index = connectionListeners.indexOf(listener);
    if (index !== -1) {
      connectionListeners.splice(index, 1);
    }
  };
}

/**
 * Close WebSocket connection
 */
export function closeWebSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  
  if (websocket) {
    try {
      // Send offline status before closing
      sendUserActivity('offline');
      
      // Close the connection
      websocket.close();
      websocket = null;
    } catch (error) {
      console.error('Error closing WebSocket:', error);
    }
  }
}

// For development/debugging only
(window as any).websocketService = {
  initWebSocket,
  sendUserActivity,
  closeWebSocket
};