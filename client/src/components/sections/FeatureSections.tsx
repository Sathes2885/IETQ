import { Ticker, TickerSection } from "@/components/ui/ticker";
import { RotationCard, RotationCardSection } from "@/components/ui/rotation-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Award, Medal, Star, Users, User, Trophy, Clock, Calendar } from "lucide-react";

export function AnnouncementTicker() {
  const announcements = [
    "Registration for National Science Olympiad is now open",
    "New Math Fundamentals course launching next week",
    "Congratulations to the winners of Creative Writing Challenge",
    "Parent-Teacher meeting scheduled for June 15th",
    "Summer camp registrations closing soon",
    "Interactive Physics Workshop starting this Friday",
  ];

  return (
    <TickerSection 
      items={announcements}
      backgroundColor="#FEEBC8"  // Light orange
      textColor="#9C4221"        // Dark orange
      className="py-2 border-y border-amber-300"
    />
  );
}

export function CompetitionCards() {
  const competitions = [
    {
      id: 1,
      frontContent: (
        <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardHeader className="p-0">
            <Badge className="absolute top-2 right-2 bg-yellow-500">Popular</Badge>
            <div className="flex items-center mb-2">
              <Award className="mr-2 h-5 w-5" />
              <CardTitle className="text-xl">Quiz Whizz</CardTitle>
            </div>
            <CardDescription className="text-blue-100">
              Test your knowledge against peers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-sm text-blue-100">
              Participate in online quizzes spanning various subjects and challenge students across the country
            </p>
          </CardContent>
          <CardFooter className="p-0 mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs">
              <Users className="mr-1 h-4 w-4" />
              <span>2,500+ participants</span>
            </div>
            <Button size="sm" variant="secondary" className="text-xs">
              Hover to Learn More <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      ),
      backContent: (
        <div className="h-full flex flex-col justify-between p-5 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
          <div>
            <h3 className="font-bold text-lg mb-2">Quiz Whizz Details</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <Calendar className="mr-2 h-4 w-4 mt-0.5" />
                <span>Open all year round with monthly finals</span>
              </li>
              <li className="flex items-start">
                <Trophy className="mr-2 h-4 w-4 mt-0.5" />
                <span>Digital certificates & national recognition</span>
              </li>
              <li className="flex items-start">
                <User className="mr-2 h-4 w-4 mt-0.5" />
                <span>Grades 1-10 with age-appropriate questions</span>
              </li>
            </ul>
          </div>
          <Button variant="outline" className="mt-4 border-white text-white hover:bg-blue-600">
            Register Now
          </Button>
        </div>
      )
    },
    {
      id: 2,
      frontContent: (
        <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardHeader className="p-0">
            <Badge className="absolute top-2 right-2 bg-green-500">New</Badge>
            <div className="flex items-center mb-2">
              <Medal className="mr-2 h-5 w-5" />
              <CardTitle className="text-xl">Think Tank</CardTitle>
            </div>
            <CardDescription className="text-purple-100">
              Critical thinking & problem solving
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-sm text-purple-100">
              Solve complex, real-world problems using critical thinking and collaboration with your peers
            </p>
          </CardContent>
          <CardFooter className="p-0 mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs">
              <Users className="mr-1 h-4 w-4" />
              <span>1,200+ participants</span>
            </div>
            <Button size="sm" variant="secondary" className="text-xs">
              Hover to Learn More <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      ),
      backContent: (
        <div className="h-full flex flex-col justify-between p-5 bg-gradient-to-br from-purple-700 to-purple-900 text-white">
          <div>
            <h3 className="font-bold text-lg mb-2">Think Tank Details</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <Calendar className="mr-2 h-4 w-4 mt-0.5" />
                <span>Competition runs Oct-Dec with 3 elimination rounds</span>
              </li>
              <li className="flex items-start">
                <Trophy className="mr-2 h-4 w-4 mt-0.5" />
                <span>Cash prizes and internship opportunities</span>
              </li>
              <li className="flex items-start">
                <User className="mr-2 h-4 w-4 mt-0.5" />
                <span>For grades 6-10 with team participation</span>
              </li>
            </ul>
          </div>
          <Button variant="outline" className="mt-4 border-white text-white hover:bg-purple-600">
            Register Now
          </Button>
        </div>
      )
    },
    {
      id: 3,
      frontContent: (
        <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardHeader className="p-0">
            <Badge className="absolute top-2 right-2 bg-amber-500">Featured</Badge>
            <div className="flex items-center mb-2">
              <Star className="mr-2 h-5 w-5" />
              <CardTitle className="text-xl">MindBloom</CardTitle>
            </div>
            <CardDescription className="text-green-100">
              Creative expression & innovation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-sm text-green-100">
              Showcase your creativity through art, writing, design, and innovation challenges
            </p>
          </CardContent>
          <CardFooter className="p-0 mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs">
              <Users className="mr-1 h-4 w-4" />
              <span>1,800+ participants</span>
            </div>
            <Button size="sm" variant="secondary" className="text-xs">
              Hover to Learn More <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      ),
      backContent: (
        <div className="h-full flex flex-col justify-between p-5 bg-gradient-to-br from-green-700 to-green-900 text-white">
          <div>
            <h3 className="font-bold text-lg mb-2">MindBloom Details</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <Calendar className="mr-2 h-4 w-4 mt-0.5" />
                <span>Annual competition with themed monthly challenges</span>
              </li>
              <li className="flex items-start">
                <Trophy className="mr-2 h-4 w-4 mt-0.5" />
                <span>Exhibition of winning entries & publication opportunities</span>
              </li>
              <li className="flex items-start">
                <User className="mr-2 h-4 w-4 mt-0.5" />
                <span>Open to all grades with age-specific categories</span>
              </li>
            </ul>
          </div>
          <Button variant="outline" className="mt-4 border-white text-white hover:bg-green-600">
            Register Now
          </Button>
        </div>
      )
    },
    {
      id: 4,
      frontContent: (
        <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-br from-pink-500 to-pink-700 text-white">
          <CardHeader className="p-0">
            <Badge className="absolute top-2 right-2 bg-blue-500">Limited</Badge>
            <div className="flex items-center mb-2">
              <Medal className="mr-2 h-5 w-5" />
              <CardTitle className="text-xl">Science Olympiad</CardTitle>
            </div>
            <CardDescription className="text-pink-100">
              Scientific exploration & discovery
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-sm text-pink-100">
              Compete in this prestigious science competition covering physics, chemistry, biology, and earth sciences
            </p>
          </CardContent>
          <CardFooter className="p-0 mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs">
              <Users className="mr-1 h-4 w-4" />
              <span>3,000+ participants</span>
            </div>
            <Button size="sm" variant="secondary" className="text-xs">
              Hover to Learn More <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      ),
      backContent: (
        <div className="h-full flex flex-col justify-between p-5 bg-gradient-to-br from-pink-700 to-pink-900 text-white">
          <div>
            <h3 className="font-bold text-lg mb-2">Science Olympiad Details</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <Calendar className="mr-2 h-4 w-4 mt-0.5" />
                <span>National competition with regional and state rounds</span>
              </li>
              <li className="flex items-start">
                <Trophy className="mr-2 h-4 w-4 mt-0.5" />
                <span>Scholarships and opportunities to represent India internationally</span>
              </li>
              <li className="flex items-start">
                <User className="mr-2 h-4 w-4 mt-0.5" />
                <span>For grades 5-10 with comprehensive science curriculum</span>
              </li>
            </ul>
          </div>
          <Button variant="outline" className="mt-4 border-white text-white hover:bg-pink-600">
            Register Now
          </Button>
        </div>
      )
    }
  ];

  return (
    <RotationCardSection
      title="Featured Competitions"
      subtitle="Complete all four stages to unlock exclusive certificates!"
      cards={competitions}
      columns={4}
      backgroundColor="#F0FDF4"  // Light green
      textColor="#1E3A8A"        // Dark blue
    />
  );
}

export function CourseCards() {
  const courses = [
    {
      id: 1,
      frontContent: (
        <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
          <CardHeader className="p-0">
            <Badge className="absolute top-2 right-2 bg-indigo-500 text-white">Trending</Badge>
            <div className="flex items-center mb-2">
              <BookOpen className="mr-2 h-5 w-5 text-indigo-600" />
              <CardTitle className="text-xl text-indigo-900">Mathematics Fundamentals</CardTitle>
            </div>
            <CardDescription className="text-indigo-700">
              Master core mathematical concepts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-sm text-indigo-700">
              Build a strong foundation in essential math topics through interactive lessons and practice exercises
            </p>
          </CardContent>
          <CardFooter className="p-0 mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs text-indigo-700">
              <Clock className="mr-1 h-4 w-4" />
              <span>6 weeks • 24 lessons</span>
            </div>
            <Button size="sm" variant="outline" className="text-xs border-indigo-500 text-indigo-700 hover:bg-indigo-100">
              Hover to Preview <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      ),
      backContent: (
        <div className="h-full flex flex-col justify-between p-5 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
          <div>
            <h3 className="font-bold text-lg mb-2">What You'll Learn</h3>
            <ul className="text-sm space-y-2">
              <li>• Number systems and operations</li>
              <li>• Algebraic expressions and equations</li>
              <li>• Geometry and measurement</li>
              <li>• Data analysis and probability</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm font-semibold">Suitable for: Grades 3-6</p>
              <p className="text-sm font-semibold">Instructor: Dr. Sharma</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4 border-white text-white hover:bg-indigo-600">
            Enroll Now
          </Button>
        </div>
      )
    },
    {
      id: 2,
      frontContent: (
        <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
          <CardHeader className="p-0">
            <Badge className="absolute top-2 right-2 bg-amber-500 text-white">Popular</Badge>
            <div className="flex items-center mb-2">
              <BookOpen className="mr-2 h-5 w-5 text-amber-600" />
              <CardTitle className="text-xl text-amber-900">Science Lab Series</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              Explore scientific principles through experiments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-sm text-amber-700">
              Conduct hands-on experiments and simulations to understand key scientific concepts and phenomena
            </p>
          </CardContent>
          <CardFooter className="p-0 mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs text-amber-700">
              <Clock className="mr-1 h-4 w-4" />
              <span>8 weeks • 32 lessons</span>
            </div>
            <Button size="sm" variant="outline" className="text-xs border-amber-500 text-amber-700 hover:bg-amber-100">
              Hover to Preview <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      ),
      backContent: (
        <div className="h-full flex flex-col justify-between p-5 bg-gradient-to-br from-amber-500 to-amber-700 text-white">
          <div>
            <h3 className="font-bold text-lg mb-2">What You'll Learn</h3>
            <ul className="text-sm space-y-2">
              <li>• Physical and chemical changes</li>
              <li>• Energy transformation</li>
              <li>• Simple machines and mechanisms</li>
              <li>• Environmental science experiments</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm font-semibold">Suitable for: Grades 4-8</p>
              <p className="text-sm font-semibold">Instructor: Dr. Patel</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4 border-white text-white hover:bg-amber-600">
            Enroll Now
          </Button>
        </div>
      )
    },
    {
      id: 3,
      frontContent: (
        <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200">
          <CardHeader className="p-0">
            <Badge className="absolute top-2 right-2 bg-cyan-500 text-white">New</Badge>
            <div className="flex items-center mb-2">
              <BookOpen className="mr-2 h-5 w-5 text-cyan-600" />
              <CardTitle className="text-xl text-cyan-900">Creative Writing Workshop</CardTitle>
            </div>
            <CardDescription className="text-cyan-700">
              Develop storytelling and creative expression
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-sm text-cyan-700">
              Learn how to craft compelling stories and express yourself through various creative writing techniques
            </p>
          </CardContent>
          <CardFooter className="p-0 mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs text-cyan-700">
              <Clock className="mr-1 h-4 w-4" />
              <span>4 weeks • 16 lessons</span>
            </div>
            <Button size="sm" variant="outline" className="text-xs border-cyan-500 text-cyan-700 hover:bg-cyan-100">
              Hover to Preview <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      ),
      backContent: (
        <div className="h-full flex flex-col justify-between p-5 bg-gradient-to-br from-cyan-500 to-cyan-700 text-white">
          <div>
            <h3 className="font-bold text-lg mb-2">What You'll Learn</h3>
            <ul className="text-sm space-y-2">
              <li>• Character development and world-building</li>
              <li>• Plot structure and storytelling techniques</li>
              <li>• Poetry and descriptive writing</li>
              <li>• Editing and revision processes</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm font-semibold">Suitable for: Grades 5-10</p>
              <p className="text-sm font-semibold">Instructor: Ms. Gupta</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4 border-white text-white hover:bg-cyan-600">
            Enroll Now
          </Button>
        </div>
      )
    },
    {
      id: 4,
      frontContent: (
        <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200">
          <CardHeader className="p-0">
            <div className="flex items-center mb-2">
              <BookOpen className="mr-2 h-5 w-5 text-violet-600" />
              <CardTitle className="text-xl text-violet-900">Computer Programming Basics</CardTitle>
            </div>
            <CardDescription className="text-violet-700">
              Introduction to coding and computational thinking
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-sm text-violet-700">
              Learn the fundamentals of programming through interactive exercises and simple projects
            </p>
          </CardContent>
          <CardFooter className="p-0 mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs text-violet-700">
              <Clock className="mr-1 h-4 w-4" />
              <span>10 weeks • 30 lessons</span>
            </div>
            <Button size="sm" variant="outline" className="text-xs border-violet-500 text-violet-700 hover:bg-violet-100">
              Hover to Preview <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      ),
      backContent: (
        <div className="h-full flex flex-col justify-between p-5 bg-gradient-to-br from-violet-500 to-violet-700 text-white">
          <div>
            <h3 className="font-bold text-lg mb-2">What You'll Learn</h3>
            <ul className="text-sm space-y-2">
              <li>• Basic programming concepts and syntax</li>
              <li>• Problem-solving with algorithms</li>
              <li>• Creating simple applications and games</li>
              <li>• Introduction to web development</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm font-semibold">Suitable for: Grades 6-10</p>
              <p className="text-sm font-semibold">Instructor: Mr. Singh</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4 border-white text-white hover:bg-violet-600">
            Enroll Now
          </Button>
        </div>
      )
    }
  ];

  return (
    <RotationCardSection
      title="Featured Courses"
      subtitle="Develop essential skills with our interactive courses led by expert instructors"
      cards={courses}
      columns={4}
      backgroundColor="#EFF6FF"  // Light blue
      textColor="#1E3A8A"        // Dark blue
    />
  );
}

export function EventTicker() {
  const events = [
    "👨‍🏫 Live webinar: 'Effective study techniques' - June 10th, 4PM",
    "🏆 Math Olympiad finals - June 15th-17th",
    "📚 New course: 'Advanced Literature Analysis' starting June 20th",
    "🎓 Student achievement ceremony - June 25th, 5PM",
    "🔬 Science Fair projects submission deadline - July 5th",
  ];

  return (
    <TickerSection 
      items={events}
      speed={30}
      backgroundColor="#E6F6FE"  // Light blue
      textColor="#2563EB"        // Blue
      className="py-3 border-y border-blue-200"
    />
  );
}

export function FeatureSections() {
  return (
    <div className="space-y-8">
      <AnnouncementTicker />
      
      <CompetitionCards />
      
      <EventTicker />
      
      <CourseCards />
    </div>
  );
}