import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  HelpCircle, 
  Award, 
  User, 
  Users, 
  FileText, 
  Settings, 
  Plus,
  LibraryBig,
  Edit,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User as UserType } from '@shared/schema';

interface SidebarProps {
  user: UserType;
}

export default function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();
  
  // Add debug logs to verify user and role
  console.log("Sidebar received user:", user);
  console.log("User role:", user?.role);
  
  // Make sure we safely access the role
  const userRole = user?.role || 'student'; // Default to student if role is undefined

  const studentLinks = [
    {
      href: '/student/dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />
    },
    {
      href: '/student/courses',
      label: 'My Courses',
      icon: <BookOpen className="mr-3 h-5 w-5" />
    },
    {
      href: '/student/competitions',
      label: 'Competitions',
      icon: <Trophy className="mr-3 h-5 w-5" />
    },
    {
      href: '/student/quizzes',
      label: 'Quizzes',
      icon: <HelpCircle className="mr-3 h-5 w-5" />
    },
    {
      href: '/student/certificates',
      label: 'Certificates',
      icon: <Award className="mr-3 h-5 w-5" />
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <User className="mr-3 h-5 w-5" />
    }
  ];

  const teacherLinks = [
    {
      href: '/teacher/dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />
    },
    {
      href: '/teacher/courses',
      label: 'Manage Courses',
      icon: <BookOpen className="mr-3 h-5 w-5" />
    },
    {
      href: '/teacher/competitions',
      label: 'Manage Competitions',
      icon: <Trophy className="mr-3 h-5 w-5" />
    },
    {
      href: '/teacher/quizzes',
      label: 'Manage Quizzes',
      icon: <HelpCircle className="mr-3 h-5 w-5" />
    },
    {
      href: '/teacher/students',
      label: 'My Students',
      icon: <Users className="mr-3 h-5 w-5" />
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <User className="mr-3 h-5 w-5" />
    }
  ];

  const adminLinks = [
    {
      href: '/admin/dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />
    },
    {
      href: '/admin/users',
      label: 'Manage Users',
      icon: <Users className="mr-3 h-5 w-5" />
    },
    {
      href: '/admin/content',
      label: 'Manage Content',
      icon: <FileText className="mr-3 h-5 w-5" />
    },
    {
      href: '/admin/approvals',
      label: 'Teacher Approvals',
      icon: <LibraryBig className="mr-3 h-5 w-5" />
    },
    {
      href: '/admin/certificates',
      label: 'Issue Certificates',
      icon: <Award className="mr-3 h-5 w-5" />
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: <Settings className="mr-3 h-5 w-5" />
    }
  ];

  // Default to student links
  let links = studentLinks;
  let title = 'Student Dashboard';

  // Explicitly check for and assign the appropriate links based on role
  if (userRole === 'teacher') {
    links = teacherLinks;
    title = 'Teacher Dashboard';
  } else if (userRole === 'admin') {
    links = adminLinks;
    title = 'Admin Panel';
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-lg font-semibold text-primary-600">{title}</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    location === link.href
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              
              {userRole === 'teacher' && (
                <div className="pt-4">
                  <Separator className="my-4" />
                  <Link 
                    href="/teacher/create"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-secondary text-white hover:bg-secondary/90"
                  >
                    <Plus className="mr-3 h-5 w-5" />
                    Create New Content
                  </Link>
                </div>
              )}
              
              {/* Editor access removed */}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user.name}</p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  {userRole === 'student' && user.grade ? `Grade ${user.grade}` : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
