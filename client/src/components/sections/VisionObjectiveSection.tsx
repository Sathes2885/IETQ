import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BrainCircuit, 
  Sparkles, 
  Video, 
  BookOpen, 
  Award
} from 'lucide-react';

export function VisionObjectiveSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const objectiveRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const prizesRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observer for section animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Vision animation
          if (visionRef.current) {
            gsap.fromTo(visionRef.current, 
              { y: 50, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
            );
          }
          
          // Objective animation
          if (objectiveRef.current) {
            gsap.fromTo(objectiveRef.current, 
              { y: 50, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out" }
            );
          }
          
          // Benefits animation
          if (benefitsRef.current) {
            const items = benefitsRef.current.querySelectorAll('.benefit-item');
            gsap.fromTo(items, 
              { y: 30, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power3.out" }
            );
          }
          
          // Prizes animation
          if (prizesRef.current) {
            gsap.fromTo(prizesRef.current, 
              { scale: 0.9, opacity: 0 }, 
              { scale: 1, opacity: 1, duration: 0.7, delay: 0.4, ease: "back.out(1.4)" }
            );
          }
          
          // Panel animation
          if (panelRef.current) {
            gsap.fromTo(panelRef.current, 
              { x: 40, opacity: 0 }, 
              { x: 0, opacity: 1, duration: 0.7, delay: 0.3, ease: "power3.out" }
            );
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Vision & Objective */}
          <div>
            {/* Vision */}
            <div ref={visionRef} className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Vision</h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                We aim to nurture every child's hidden potential and prepare them for a confident, capable, and creative future. 
                IETQ helps children shine beyond textbooks through fun, skill-based learning and recognition.
              </p>
            </div>
            
            {/* Objective */}
            <div ref={objectiveRef} className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Objective</h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                We strive to create learning experiences that build collaboration, critical thinking, and communication skills, 
                to support academic goals while encouraging self-expression and holistic development.
              </p>
            </div>
            
            {/* Benefits */}
            <div ref={benefitsRef} className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">What You'll Get</h2>
              <div className="space-y-6">
                <div className="benefit-item flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center">
                    <Video className="h-6 w-6 animate-pulse-icon" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Live Expert Webinars</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Engage in interactive sessions led by industry professionals and education experts.
                    </p>
                  </div>
                </div>
                
                <div className="benefit-item flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 flex items-center justify-center">
                    <Video className="h-6 w-6 animate-float" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">On-Demand Learning</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Access pre-recorded video lessons to learn at your own pace, anytime, anywhere.
                    </p>
                  </div>
                </div>
                
                <div className="benefit-item flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 animate-bounce-slow" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Curated E-Learning Material</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Get high-quality digital study content tailored to each round of the competition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Rounds & Prizes */}
          <div ref={panelRef}>
            {/* Eligibility */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Eligibility</h3>
              <div className="py-3 px-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <p className="text-center text-gray-800 dark:text-gray-200 font-medium">
                  Open to all students from Grade 1 to Grade 10
                </p>
              </div>
            </div>
            
            {/* 3 Rounds */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Competition Rounds</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 rounded-lg border-l-4 border-amber-500">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <BrainCircuit className="h-6 w-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Quizz Whizz</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Knowledge-based assessment across multiple subjects</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Sparkles className="h-6 w-6 animate-pulse-icon" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Think Tank Challenge</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Problem-solving and creative thinking challenges</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-lg border-l-4 border-green-500">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <Sparkles className="h-6 w-6 animate-float" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Me@My Best</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Showcase your unique talents and skills</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prizes */}
            <div ref={prizesRef} className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-800 rounded-xl p-6 shadow-md text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full filter blur-[60px] opacity-20"></div>
              
              <h3 className="text-2xl font-bold mb-4 relative z-10">Get ready to be rewarded for your talent!</h3>
              <p className="mb-4 relative z-10">
                IETQ offers 1000+ exciting prizes across categories — because every unique skill deserves to shine!
              </p>
              
              <h4 className="font-bold text-xl mb-3 relative z-10">🎁 What's in store?</h4>
              <ul className="space-y-2 mb-4 relative z-10">
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 animate-shake" />
                  <span>Trophies & Medals 🏅</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 animate-float" />
                  <span>Participation Certificates for ALL ✨</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 animate-pulse-icon" />
                  <span>Cash Prizes 💰</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 animate-bounce-slow" />
                  <span>Scholarships 🎓</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 animate-shake" />
                  <span>Gift Cards & Surprise Goodies 🎁</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 animate-spin-slow" />
                  <span>Special Awards in Multiple Talent Categories 🌟</span>
                </li>
              </ul>
              
              <p className="mb-4 text-white/90 relative z-10">
                And that's not all — top performers will be featured nationwide, earning the recognition they truly deserve!
              </p>
              
              <div className="text-center mt-6 relative z-10">
                <p className="font-bold text-xl mb-4">Step up. Stand out. Shine across India!</p>
                <Button variant="secondary" size="lg" className="font-bold">
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Jury Panel Info */}
        <div className="mt-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Our Esteemed Panel</h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg text-center max-w-4xl mx-auto">
            Our esteemed panel includes 500+ judges and subject matter experts from diverse fields such as education, arts, STEM, design, and public speaking. 
            Each round is evaluated by specialists to ensure fair, transparent, and skill-based judgment, giving every participant the recognition they truly deserve.
          </p>
        </div>
      </div>
    </section>
  );
}