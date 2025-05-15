import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Activity, UserRound, Clock } from "lucide-react";
import { addMessageListener, addConnectionListener } from '@/lib/websocket';

// Interface for active user data
interface ActiveUser {
  userId: number;
  name: string;
  email: string;
  role: string;
  lastActivity: string;
  status: 'online' | 'away' | 'offline';
}

export default function ActiveUsersList() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [connected, setConnected] = useState(false);

  // Subscribe to WebSocket messages and connection status
  useEffect(() => {
    // Handle WebSocket messages
    const removeMessageListener = addMessageListener((data) => {
      if (data.type === 'activeUsers') {
        console.log('Received active users update:', data.data);
        setActiveUsers(data.data);
      }
    });
    
    // Handle connection status
    const removeConnectionListener = addConnectionListener((status) => {
      console.log('WebSocket connection status changed:', status);
      setConnected(status);
    });
    
    return () => {
      removeMessageListener();
      removeConnectionListener();
    };
  }, []);
  
  // Fallback to REST API if WebSocket connection fails
  useEffect(() => {
    if (!connected) {
      const fetchActiveUsers = async () => {
        try {
          const response = await fetch('/api/admin/active-users');
          if (response.ok) {
            const data = await response.json();
            setActiveUsers(data);
          }
        } catch (error) {
          console.error('Error fetching active users:', error);
        }
      };
      
      console.log('WebSocket disconnected, falling back to polling');
      fetchActiveUsers();
      const interval = setInterval(fetchActiveUsers, 10000);
      
      return () => clearInterval(interval);
    }
  }, [connected]);
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get role badge color
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500 hover:bg-red-600">{role}</Badge>;
      case 'teacher':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{role}</Badge>;
      case 'student':
        return <Badge className="bg-green-500 hover:bg-green-600">{role}</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };
  
  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string | Date) => {
    try {
      const time = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      const now = new Date();
      const diffMs = now.getTime() - time.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      
      if (diffSec < 60) {
        return 'just now';
      } else if (diffSec < 3600) {
        const minutes = Math.floor(diffSec / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffSec < 86400) {
        const hours = Math.floor(diffSec / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffSec / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    } catch (e) {
      console.error('Error formatting time:', e);
      return 'unknown';
    }
  };
  
  // Get avatar fallback initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl font-semibold">
          <Activity className="mr-2 h-5 w-5" />
          Real-time Active Users
          <Badge variant="outline" className="ml-2">
            {connected ? 'Live' : 'Polling'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
            <UserRound className="h-12 w-12 mb-2 opacity-20" />
            <p>No active users at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeUsers.map((user) => (
              <div key={user.userId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                        user.status
                      )}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getRoleBadge(user.role)}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {user.lastActivity ? formatRelativeTime(user.lastActivity) : 'unknown'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}