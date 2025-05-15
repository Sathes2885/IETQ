import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { 
  BrainCircuit, 
  Trophy, 
  Award, 
  Monitor, 
  Building2, 
  Award as AwardIcon, 
  Globe, 
  UsersRound
} from 'lucide-react';

export function BenefitsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const studentBenefitsRef = useRef<HTMLDivElement>(null);
  const schoolBenefitsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observer for section animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Heading animation
          if (headingRef.current) {
            gsap.fromTo(headingRef.current, 
              { y: 30, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
            );
          }
          
          // Student benefits animation
          if (studentBenefitsRef.current) {
            const items = studentBenefitsRef.current.querySelectorAll('.benefit-card');
            gsap.fromTo(items, 
              { y: 40, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power3.out" }
            );
          }
          
          // School benefits animation
          if (schoolBenefitsRef.current) {
            const items = schoolBenefitsRef.current.querySelectorAll('.benefit-card');
            gsap.fromTo(items, 
              { y: 40, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power3.out" }
            );
          }
          
          // CTA animation
          if (ctaRef.current) {
            gsap.fromTo(ctaRef.current, 
              { y: 20, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.7, delay: 0.7, ease: "back.out(1.4)" }
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Who Benefits from IETQ?</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            IETQ is designed to create value for both students and educational institutions.
            Check out how the platform serves different stakeholders.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* For Students */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left">For Students</h3>
            <div ref={studentBenefitsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Benefit 1 */}
              <div className="benefit-card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 mb-4">
                  <BrainCircuit className="h-6 w-6 animate-spin-slow" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Improve Critical Thinking</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Develop analytical skills and problem-solving abilities through our carefully designed challenges.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className="benefit-card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 mb-4">
                  <Trophy className="h-6 w-6 animate-bounce-slow" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Compete Nationally</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Showcase your talents on a national stage and compete with peers from across India.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className="benefit-card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 mb-4">
                  <Award className="h-6 w-6 animate-pulse-icon" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Awards & Certificates</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Earn prestigious certificates and awards that enhance your academic portfolio.
                </p>
              </div>
              
              {/* Benefit 4 */}
              <div className="benefit-card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500 mb-4">
                  <Monitor className="h-6 w-6 animate-float" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Media Exposure</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Get recognized through our media partnerships and gain visibility for your accomplishments.
                </p>
              </div>
            </div>
          </div>
          
          {/* For Schools */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left">For Schools</h3>
            <div ref={schoolBenefitsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Benefit 1 */}
              <div className="benefit-card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 mb-4">
                  <Building2 className="h-6 w-6 animate-float" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Recognition as a Talent Promoter</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Be recognized as an institution that actively promotes student talents and skills.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className="benefit-card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 mb-4">
                  <AwardIcon className="h-6 w-6 animate-pulse-icon" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">National-Level Participation Certificate</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Receive official certification for your school's participation in this national initiative.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className="benefit-card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 mb-4">
                  <Globe className="h-6 w-6 animate-spin-slow" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Visibility on IETQ Website</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Featured presence on our platform increases your institution's visibility nationwide.
                </p>
              </div>
              
              {/* Benefit 4 */}
              <div className="benefit-card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500 mb-4">
                  <UsersRound className="h-6 w-6 animate-bounce-slow" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Networking Opportunities</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Connect with other educational institutions and experts from across the country.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col items-center justify-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 shadow-xl text-white text-center max-w-2xl transform transition-transform hover:scale-[1.02]">
            <h3 className="text-2xl font-bold mb-4">Ready to Join the Movement?</h3>
            <p className="mb-6 text-white/90">
              Whether you're a student eager to showcase your skills or a school looking to provide exceptional opportunities, 
              IETQ welcomes you to be part of this transformative journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90">
                Student Registration
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Get Your School Onboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}