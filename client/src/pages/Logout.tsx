import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '@/lib/auth';

export default function Logout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Invalidate all queries to ensure cache is cleared
        queryClient.clear();
        
        // Call the logout function
        await logoutUser();
        
        // The redirect will be handled by the logoutUser function
        // through window.location.href to ensure full page refresh
      } catch (error) {
        console.error('Logout error:', error);
        // If there's an error, redirect to home page and force refresh
        window.location.href = '/';
      }
    };

    performLogout();
  }, [queryClient]);

  // Display a simple loading message while logging out
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Logging out...</h1>
        <p className="text-gray-600">You will be redirected shortly.</p>
      </div>
    </div>
  );
}