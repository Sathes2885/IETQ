import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Sparkles,
  Calendar,
  Award,
  Settings,
  User,
  Bell,
  Menu,
  LogOut,
  Users,
  FileText,
  LibraryBig,
  Video,
  BookMarked,
  GraduationCap,
  BarChart,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: ReactNode;
  user?: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    grade?: string;
  };
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [notificationsCount] = useState(3);
  
  // User data with proper fallbacks
  const userName = user?.name || 'User';
  const userGrade = user?.grade || '';
  const userRole = user?.role || 'student';
  
  // Log user data to verify we're getting the proper values
  console.log("DashboardLayout user data:", user);
  
  // Get user initials for avatar
  const userInitials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  // Student navigation items
  const studentNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/student/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'My Courses',
      href: '/student/courses',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      label: 'Competitions',
      href: '/student/competitions',
      icon: <Trophy className="h-5 w-5" />,
      badge: 'New',
    },
    {
      label: 'Quizzes',
      href: '/student/quizzes',
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      label: 'Schedule',
      href: '/student/schedule',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: 'Certificates',
      href: '/student/certificates',
      icon: <Award className="h-5 w-5" />,
    },
    {
      label: 'Settings',
      href: '/student/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Teacher navigation items
  const teacherNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/teacher/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'My Courses',
      href: '/teacher/courses',
      icon: <BookMarked className="h-5 w-5" />,
    },
    {
      label: 'Students',
      href: '/teacher/students',
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      label: 'Create Quiz',
      href: '/teacher/quizzes',
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      label: 'Competitions',
      href: '/teacher/competitions',
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      label: 'Live Classes',
      href: '/teacher/classes',
      icon: <Video className="h-5 w-5" />,
    },
    {
      label: 'Analytics',
      href: '/teacher/analytics',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      label: 'Settings',
      href: '/teacher/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Admin navigation items
  const adminNavItems: NavItem[] = [
    {
      label: 'Overview',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Manage Users',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: 'Manage Content',
      href: '/admin/content',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: 'Teacher Approvals',
      href: '/admin/approvals',
      icon: <LibraryBig className="h-5 w-5" />,
    },
    {
      label: 'Issue Certificates',
      href: '/admin/certificates',
      icon: <Award className="h-5 w-5" />,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Select the appropriate navigation items based on user role
  let navItems = studentNavItems;
  let portalTitle = 'Student Portal';

  if (userRole === 'teacher') {
    navItems = teacherNavItems;
    portalTitle = 'Teacher Portal';
  } else if (userRole === 'admin') {
    navItems = adminNavItems;
    portalTitle = 'Admin Portal';
  }

  // Generate student ID based on user ID
  const studentId = user?.id ? `IETQ-${new Date().getFullYear() % 100}-${(user.id + 8000)}` : 'IETQ-000';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Mobile header */}
      <header className="lg:hidden py-4 px-4 sm:px-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <SheetTitle className="text-xl font-display">IETQ {portalTitle}</SheetTitle>
                </SheetHeader>
                <div className="py-3 px-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/student-avatar.png" alt={userName} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userName}</p>
                      {userGrade && (
                        <p className="text-sm opacity-75">Grade {userGrade}</p>
                      )}
                    </div>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                          location === item.href
                            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-400'
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-500/5 dark:text-gray-300 dark:hover:text-indigo-400'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                        {item.badge && (
                          <Badge className="ml-auto" variant={item.badge === 'New' ? "destructive" : "secondary"}>
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
                  <Link href="/logout">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
            <div className="text-lg font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              IETQ
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/student-avatar.png" alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 overflow-y-auto py-6 px-3">
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              IETQ
            </div>
            <div className="text-lg font-medium">{portalTitle}</div>
          </div>
          
          <div className="flex flex-col gap-1 mb-8">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-md">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800">
                  <AvatarImage src="/student-avatar.png" alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userName}</p>
                  {userGrade && (
                    <p className="text-sm opacity-75">Grade {userGrade}</p>
                  )}
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="opacity-75">{userRole === 'student' ? 'Student ID' : (userRole === 'teacher' ? 'Teacher ID' : 'Admin ID')}</p>
                  <p className="font-medium">{studentId}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/${userRole}/profile`}>
                    <User className="h-3.5 w-3.5 mr-1" />
                    Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium ${
                  location === item.href
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-500/5 dark:text-gray-300 dark:hover:text-indigo-400'
                }`}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <Badge className="ml-auto" variant={item.badge === 'New' ? "destructive" : "secondary"}>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 px-4">
            <Link href="/logout">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </aside>

        <main className="flex-1">
          {/* Desktop header */}
          <header className="hidden lg:flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-6 sticky top-0 z-30">
            <h1 className="text-xl font-semibold font-display">
              {navItems.find((item) => item.href === location)?.label || 'Dashboard'}
            </h1>
            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationsCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/student-avatar.png" alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{userName}</p>
                  {userGrade && (
                    <p className="opacity-75">Grade {userGrade}</p>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}