import { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Star, 
  Clock, 
  User, 
  Calendar,
  ArrowRight
} from 'lucide-react';

// Mock course data
const COURSES = [
  {
    id: 1,
    title: 'Mathematics Mastery - Grade 8',
    subject: 'Mathematics',
    description: 'A comprehensive course covering all aspects of Grade 8 mathematics, from algebra to geometry.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    instructor: 'Dr. Anil Sharma',
    rating: 4.8,
    students: 1245,
    duration: '12 weeks',
    level: 'Intermediate',
    updated: '2 months ago'
  },
  {
    id: 2,
    title: 'Science Explorer - Chemistry Fundamentals',
    subject: 'Science',
    description: 'Explore the fascinating world of chemistry through interactive experiments and engaging lessons.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    instructor: 'Dr. Priya Patel',
    rating: 4.9,
    students: 982,
    duration: '10 weeks',
    level: 'Beginner',
    updated: '1 month ago'
  },
  {
    id: 3,
    title: 'English Literature - Classics & Modern Texts',
    subject: 'English',
    description: 'Develop critical reading and analysis skills through classic and contemporary literary works.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    instructor: 'Ms. Sarah Johnson',
    rating: 4.7,
    students: 756,
    duration: '8 weeks',
    level: 'All Levels',
    updated: '3 weeks ago'
  },
  {
    id: 4,
    title: 'History of India - Ancient Civilizations',
    subject: 'History',
    description: 'Journey through time to explore the rich heritage and ancient civilizations of India.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564890369878-4be5a6074690?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    instructor: 'Prof. Rajesh Kumar',
    rating: 4.6,
    students: 612,
    duration: '6 weeks',
    level: 'Beginner',
    updated: '1 month ago'
  },
  {
    id: 5,
    title: 'Computer Science Fundamentals - Programming Basics',
    subject: 'Computer Science',
    description: 'Learn the core concepts of computer science and build a foundation in programming.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    instructor: 'Mr. Vikram Singh',
    rating: 4.9,
    students: 1589,
    duration: '14 weeks',
    level: 'Intermediate',
    updated: '2 weeks ago'
  },
  {
    id: 6,
    title: 'Environmental Science - Understanding Ecosystems',
    subject: 'Science',
    description: 'Discover the complex relationships within ecosystems and the impact of human activities.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    instructor: 'Dr. Meera Rao',
    rating: 4.7,
    students: 843,
    duration: '8 weeks',
    level: 'All Levels',
    updated: '3 months ago'
  }
];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  
  // Filter courses based on search term and filters
  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === '' || course.subject === subjectFilter;
    const matchesLevel = levelFilter === '' || course.level === levelFilter;
    
    return matchesSearch && matchesSubject && matchesLevel;
  });
  
  // Get unique subjects for filter options
  const subjects = Array.from(new Set(COURSES.map(course => course.subject)));
  
  // Get unique levels for filter options
  const levels = Array.from(new Set(COURSES.map(course => course.level)));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-indigo-800 to-purple-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">Explore Courses</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Discover a wide range of courses designed to help you excel academically and develop essential skills for the future.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/60" />
                </div>
                <Input 
                  type="search" 
                  placeholder="Search courses by title or keywords..." 
                  className="pl-10 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Courses Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_subjects">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_levels">All Levels</SelectItem>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="ml-auto text-sm text-gray-500">
                Showing {filteredCourses.length} of {COURSES.length} courses
              </div>
            </div>
            
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {course.subject}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{course.instructor}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-gray-700">{course.rating}/5.0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{course.students} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Updated {course.updated}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full gap-1" asChild>
                      <Link href={`/student/courses/${course.id}`}>
                        View Course <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">No courses found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <Button onClick={() => { setSearchTerm(''); setSubjectFilter(''); setLevelFilter(''); }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to accelerate your learning?</h2>
              <p className="text-lg md:text-xl mb-6 text-white/90">
                Join thousands of students who are already mastering new subjects and skills with IETQ's comprehensive courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90" asChild>
                  <Link href="/register">
                    Register Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10 text-white">
                  Browse Competitions
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}