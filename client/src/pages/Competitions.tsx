import { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
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
  Trophy, 
  Calendar,
  Clock, 
  Users, 
  Tag,
  ArrowRight,
  CheckCircle2,
  Timer,
  Medal
} from 'lucide-react';

// Mock competitions data
const COMPETITIONS = [
  {
    id: 1,
    title: 'National Mathematics Olympiad 2025',
    category: 'Mathematics',
    description: 'Challenge your mathematical skills against the brightest minds across the country.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    deadline: 'June 15, 2025',
    participants: 1876,
    eligibility: 'Grades 6-10',
    prizePool: '₹250,000',
    status: 'Open',
    badge: 'Featured'
  },
  {
    id: 2,
    title: 'Young Scientists Challenge',
    category: 'Science',
    description: 'Showcase your scientific knowledge and innovative ideas in this prestigious national competition.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    deadline: 'July 10, 2025',
    participants: 1425,
    eligibility: 'Grades 5-9',
    prizePool: '₹200,000',
    status: 'Open',
    badge: null
  },
  {
    id: 3,
    title: 'Digital Storytelling Competition',
    category: 'Language Arts',
    description: 'Create compelling digital stories that inspire, educate, and entertain audiences.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    deadline: 'May 25, 2025',
    participants: 932,
    eligibility: 'Grades 3-8',
    prizePool: '₹150,000',
    status: 'Open',
    badge: 'New'
  },
  {
    id: 4,
    title: 'Coding Challenge 2025',
    category: 'Computer Science',
    description: 'Solve complex problems and create innovative applications in this coding competition.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    deadline: 'August 5, 2025',
    participants: 1547,
    eligibility: 'Grades 7-10',
    prizePool: '₹300,000',
    status: 'Open',
    badge: 'Popular'
  },
  {
    id: 5,
    title: 'Environmental Conservation Project',
    category: 'Environmental Science',
    description: 'Develop projects that address environmental challenges and promote sustainable practices.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1491825684231-1fba80e1c1a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    deadline: 'September 12, 2025',
    participants: 723,
    eligibility: 'Grades 4-10',
    prizePool: '₹180,000',
    status: 'Open',
    badge: null
  },
  {
    id: 6,
    title: 'National Art Exhibition',
    category: 'Art',
    description: 'Showcase your artistic talent and creativity in various mediums at this national exhibition.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    deadline: 'July 30, 2025',
    participants: 891,
    eligibility: 'Grades 1-10',
    prizePool: '₹220,000',
    status: 'Open',
    badge: null
  },
];

// Unique categories from competitions data
const categoriesSet = new Set<string>();
COMPETITIONS.forEach(comp => categoriesSet.add(comp.category));
const categories = Array.from(categoriesSet);

// Unique eligibility options from competitions data
const eligibilitySet = new Set<string>();
COMPETITIONS.forEach(comp => eligibilitySet.add(comp.eligibility));
const eligibilityOptions = Array.from(eligibilitySet);

export default function Competitions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all_categories');
  const [eligibilityFilter, setEligibilityFilter] = useState('all_grades');
  
  // Filter competitions based on search and filters
  const filteredCompetitions = COMPETITIONS.filter(competition => {
    // Search filter
    const matchesSearch = competition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          competition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          competition.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all_categories' || competition.category === categoryFilter;
    
    // Eligibility filter
    const matchesEligibility = eligibilityFilter === 'all_grades' || competition.eligibility === eligibilityFilter;
    
    return matchesSearch && matchesCategory && matchesEligibility;
  });
  
  // Badge color mapping
  const getBadgeColor = (badge: string | null) => {
    switch(badge) {
      case 'Featured': return 'bg-yellow-500';
      case 'New': return 'bg-green-500';
      case 'Popular': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-indigo-900 to-blue-800 text-white">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full bg-purple-500 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-blue-500 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">National Competitions</h1>
              <p className="text-xl mb-8 text-blue-100">
                Showcase your talent, compete with peers, and win recognition in our prestigious competitions designed for grades 1-10.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  <span>Win Amazing Prizes</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3">
                  <Medal className="w-5 h-5 mr-2 text-yellow-400" />
                  <span>National Recognition</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3">
                  <Users className="w-5 h-5 mr-2 text-yellow-400" />
                  <span>Connect with Peers</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={() => window.location.href = '/register'}
              >
                Register Now
              </Button>
            </div>
          </div>
        </section>
        
        {/* Competitions List Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search competitions..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_categories">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Eligibility Filter */}
                  <Select value={eligibilityFilter} onValueChange={setEligibilityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Eligibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_grades">All Grades</SelectItem>
                      {eligibilityOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Competitions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {filteredCompetitions.map(competition => (
                  <Card key={competition.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={competition.thumbnailUrl} 
                        alt={competition.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                      {competition.badge && (
                        <Badge 
                          className={`absolute top-3 right-3 ${getBadgeColor(competition.badge)} text-white`}
                        >
                          {competition.badge}
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Tag className="w-4 h-4 mr-1" />
                        {competition.category}
                      </div>
                      <CardTitle className="text-xl">{competition.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <CardDescription className="mb-4">
                        {competition.description}
                      </CardDescription>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                          <span>Deadline: {competition.deadline}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-indigo-600" />
                          <span>{competition.participants.toLocaleString()} Participants</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                          <span>{competition.eligibility}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Trophy className="w-4 h-4 mr-2 text-indigo-600" />
                          <span>Prize: {competition.prizePool}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> {competition.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                        View Details <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* No Results */}
              {filteredCompetitions.length === 0 && (
                <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                  <div className="mb-4 text-gray-400">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No competitions found</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any competitions matching your current filters.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all_categories');
                      setEligibilityFilter('all_grades');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
              
              {/* CTA Section */}
              <div className="bg-indigo-50 rounded-xl p-8 mt-16">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to showcase your talent?</h3>
                    <p className="text-gray-600">
                      Join thousands of students who are participating in our competitions and win recognition.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => window.location.href = '/register'}
                    >
                      Register Now
                    </Button>
                    <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Competition Timeline</h2>
                <p className="text-lg text-gray-600">
                  Here's how our competition process works from registration to awards.
                </p>
              </div>
              
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center">
                    <div className="bg-blue-100 rounded-full p-4 mb-4">
                      <Timer className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-center">Registration</h3>
                  </div>
                  <div className="md:w-3/4 bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-2">
                      The registration period is the first step. Complete your profile, select the competitions you want to participate in, and submit any required documents.
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: 2-4 weeks before competition start
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center">
                    <div className="bg-purple-100 rounded-full p-4 mb-4">
                      <Trophy className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-center">Competition</h3>
                  </div>
                  <div className="md:w-3/4 bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-2">
                      Depending on the competition type, you may participate online or in person. Complete the assigned tasks, submit your entries, or take the required tests.
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: Varies by competition (1 day to 4 weeks)
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center">
                    <div className="bg-green-100 rounded-full p-4 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-center">Evaluation</h3>
                  </div>
                  <div className="md:w-3/4 bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-2">
                      Our panel of expert judges evaluates all entries based on predefined criteria. This may include accuracy, creativity, presentation, and other factors.
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: 2-3 weeks after competition end
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center">
                    <div className="bg-yellow-100 rounded-full p-4 mb-4">
                      <Medal className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-center">Results & Awards</h3>
                  </div>
                  <div className="md:w-3/4 bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-2">
                      Results are announced and winners are awarded certificates, medals, and prizes. All participants receive participation certificates and detailed feedback.
                    </p>
                    <p className="text-sm text-gray-500">
                      Timing: 3-4 weeks after evaluation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}