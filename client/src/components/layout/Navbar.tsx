import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { User as UserType } from '@shared/schema';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: authData } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: getCurrentUser,
    staleTime: 300000, // 5 minutes
  });

  const user = authData?.user as UserType | null;
  
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      // Clear all queries from the cache
      queryClient.clear();
      setLocation('/');
      toast({
        title: "Logged out successfully",
        variant: "default",
      });
    } else {
      toast({
        title: "Logout failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L2 9.27273L12 14.5455L22 9.27273L12 4Z" fill="currentColor"/>
                <path d="M2 14.5455L12 19.8182L22 14.5455" fill="currentColor"/>
                <path d="M2 14.5455L12 19.8182L22 14.5455" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 9.27273L12 14.5455L22 9.27273" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-2 text-xl font-bold text-primary font-education">IETQ</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <div onClick={() => setLocation('/')} className="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer">
                Home
              </div>
              <div onClick={() => setLocation('/about')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer">
                About
              </div>
              <div onClick={() => setLocation('/courses')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer">
                Courses
              </div>
              <div onClick={() => setLocation('/competitions')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer">
                Competitions
              </div>
              <div onClick={() => setLocation('/contact')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer">
                Contact
              </div>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="font-normal">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                        {user.grade && (
                          <p className="text-xs text-muted-foreground">Grade {user.grade}</p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div className="w-full cursor-pointer" onClick={() => setLocation(`/${user.role}/dashboard`)}>Dashboard</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="w-full cursor-pointer" onClick={() => setLocation('/profile')}>Profile</div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="ml-4" onClick={() => setLocation(`/${user.role}/dashboard`)}>
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="mr-2 text-black" onClick={() => setLocation('/login')}>
                  Login
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>Register</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setLocation('/register?role=student')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Register as Student</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation('/register?role=teacher')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Register as Teacher</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <div onClick={() => setLocation('/')} className="bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer">
              Home
            </div>
            <div onClick={() => setLocation('/about')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer">
              About
            </div>
            <div onClick={() => setLocation('/courses')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer">
              Courses
            </div>
            <div onClick={() => setLocation('/competitions')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer">
              Competitions
            </div>
            <div onClick={() => setLocation('/contact')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer">
              Contact
            </div>
          </div>
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  {user.grade && (
                    <div className="text-sm font-medium text-gray-500">Grade {user.grade}</div>
                  )}
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <div 
                  onClick={() => setLocation(`/${user.role}/dashboard`)}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                >
                  Dashboard
                </div>
                <div 
                  onClick={() => setLocation('/profile')}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-3 px-4">
                <Button variant="outline" className="w-full text-black" onClick={() => setLocation('/login')}>
                  Login
                </Button>
                <div className="text-center text-sm font-medium text-gray-700 my-2">Register as:</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => setLocation('/register?role=student')} className="w-full">
                    Student
                  </Button>
                  <Button onClick={() => setLocation('/register?role=teacher')} className="w-full">
                    Teacher
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
