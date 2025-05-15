import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  Trophy,
  Lightbulb,
  Users,
  Target,
  Zap,
  Calendar,
  School,
  Award
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">About IETQ</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                India's Emerging Talent Quest (IETQ) is a premier educational platform dedicated to 
                nurturing the intellectual growth and creative potential of students across India.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <BookOpen className="h-5 w-5 text-amber-300" />
                  <span>Academic Excellence</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Trophy className="h-5 w-5 text-amber-300" />
                  <span>Competitive Spirit</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Lightbulb className="h-5 w-5 text-amber-300" />
                  <span>Creative Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                  To nurture young minds through engaging educational competitions, 
                  accessible learning resources, and a supportive community that 
                  celebrates academic achievement, critical thinking, and creative expression.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-100 p-2 rounded-full">
                      <Target className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Unlocking Potential</h3>
                      <p className="text-gray-700">Creating opportunities for students to discover and develop their unique abilities and talents.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-purple-100 p-2 rounded-full">
                      <Zap className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Inspiring Innovation</h3>
                      <p className="text-gray-700">Encouraging students to think creatively and develop innovative solutions to complex problems.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h2>
                <p className="text-lg text-gray-700 mb-6">
                  To create a nationwide educational ecosystem where every student has the opportunity to 
                  showcase their talents, develop essential skills, and grow into confident, 
                  future-ready leaders regardless of their background or circumstances.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-indigo-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-indigo-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Inclusive Excellence</h3>
                      <p className="text-gray-700">Building a platform that serves students from all backgrounds, regions, and educational systems across India.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-indigo-100 p-2 rounded-full">
                      <Award className="h-5 w-5 text-indigo-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Recognized Achievement</h3>
                      <p className="text-gray-700">Creating a gold standard for academic accomplishment that is valued by educational institutions nationwide.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* What We Offer */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">What We Offer</h2>
              <p className="text-lg text-gray-700">
                IETQ provides a comprehensive suite of educational resources, competitions, and opportunities 
                designed to challenge students intellectually and creatively.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Interactive Courses</h3>
                <p className="text-gray-700">
                  Engaging, curriculum-aligned courses designed to complement school education and deepen understanding of key subjects.
                </p>
              </Card>
              
              <Card className="p-6 border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
                <div className="bg-amber-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Trophy className="h-7 w-7 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">National Competitions</h3>
                <p className="text-gray-700">
                  Challenging competitions across multiple disciplines that test knowledge, critical thinking, and creative problem-solving.
                </p>
              </Card>
              
              <Card className="p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Calendar className="h-7 w-7 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Scheduled Quizzes</h3>
                <p className="text-gray-700">
                  Regular assessment opportunities through timed quizzes that encourage consistent learning and retention.
                </p>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Team</h2>
              <p className="text-lg text-gray-700">
                IETQ is powered by a dedicated team of educators, technologists, and visionaries committed 
                to transforming education in India.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                    DR
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Dr. Rajesh Sharma</h3>
                <p className="text-purple-600 mb-2">Founder & Educational Director</p>
                <p className="text-gray-600 text-sm">
                  Former Principal with 25+ years in education, dedicated to reforming learning methodologies.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                    AP
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Anita Patil</h3>
                <p className="text-purple-600 mb-2">Chief Technology Officer</p>
                <p className="text-gray-600 text-sm">
                  Tech innovator with expertise in educational platforms and AI-driven learning systems.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                    MK
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Dr. Manoj Kumar</h3>
                <p className="text-purple-600 mb-2">Academic Content Head</p>
                <p className="text-gray-600 text-sm">
                  Curriculum expert specializing in designing engaging educational content across disciplines.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}