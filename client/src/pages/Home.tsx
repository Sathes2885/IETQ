import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomeHero from '@/components/layout/HomeHero';
import { VisionObjectiveSection } from '@/components/sections/VisionObjectiveSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { gsap } from 'gsap';

export default function Home() {
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const rewardsContainerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observer for feature cards
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.feature-card');
          gsap.fromTo(cards, 
            { y: 50, opacity: 0 }, 
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              stagger: 0.2, 
              ease: "power3.out" 
            }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observer for rewards section
    const rewardsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elements = entry.target.querySelectorAll('.reward-item');
          gsap.fromTo(elements, 
            { scale: 0.8, opacity: 0 }, 
            { 
              scale: 1, 
              opacity: 1, 
              duration: 0.8, 
              stagger: 0.2, 
              ease: "back.out(1.7)" 
            }
          );
          rewardsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observer for CTA section
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target, 
            { y: 30, opacity: 0 }, 
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8,
              ease: "power3.out" 
            }
          );
          ctaObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (featureCardsRef.current) {
      observer.observe(featureCardsRef.current);
    }

    if (rewardsContainerRef.current) {
      rewardsObserver.observe(rewardsContainerRef.current);
    }

    if (ctaRef.current) {
      ctaObserver.observe(ctaRef.current);
    }

    return () => {
      // Clean up all observers
      observer.disconnect();
      rewardsObserver.disconnect();
      ctaObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <HomeHero />
      
      {/* Vision & Objective Section */}
      <VisionObjectiveSection />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Rewards & Achievements Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Rewards & Recognition</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
              Your journey on IETQ is filled with recognition opportunities. From digital badges to national certificates, we celebrate every achievement.
            </p>
          </div>
          
          <div ref={rewardsContainerRef} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Digital Badges */}
            <div className="reward-item bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M12.3 2.9c.7-.9 2-.9 2.6 0l2.2 2.8c.2.3.6.5 1 .5h3.2c1.1 0 1.8 1.3 1.3 2.2l-1.6 3.1c-.2.3-.2.7 0 1l1.6 3.1c.5 1-.1 2.2-1.3 2.2h-3.2c-.4 0-.8.2-1 .5l-2.2 2.9c-.7.9-2 .9-2.6 0l-2.2-2.9c-.2-.3-.6-.5-1-.5H3.7c-1.1 0-1.8-1.3-1.3-2.2l1.6-3.1c.2-.3.2-.7 0-1l-1.6-3.1c-.5-1 .1-2.2 1.3-2.2h3.2c.4 0 .8-.2 1-.5l2.4-2.8z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Digital Badges</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn badges for completing challenges, perfect scores, and special achievements.
              </p>
            </div>
            
            {/* Leaderboards */}
            <div className="reward-item bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M5 22v-2"/><path d="M12 22v-6"/><path d="M19 22v-10"/><path d="M5 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Leaderboards</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Compete with peers nationally and see your ranking across subjects and competitions.
              </p>
            </div>
            
            {/* Certificates */}
            <div className="reward-item bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M17 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4Z"/><path d="M17 13h-6l2-6"/><path d="M11 13l-4 5"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Certificates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn official certificates for course completion and competition excellence.
              </p>
            </div>
            
            {/* Prizes */}
            <div className="reward-item bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <div className="mx-auto w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M16 22H8"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Special Prizes</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Top performers can win scholarships, gadgets, and special recognition awards.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              Hear from students who have transformed their learning journey through IETQ.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 opacity-80"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              </div>
              <p className="text-white/90 mb-4">
                "IETQ competitions helped me discover my love for mathematics. I won the national math challenge and gained so much confidence!"
              </p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Student" className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h4 className="font-bold">Priya S.</h4>
                  <p className="text-white/70 text-sm">Grade 8, Delhi</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 opacity-80"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              </div>
              <p className="text-white/90 mb-4">
                "The creativity challenges pushed me to think differently. I learned how to approach problems from multiple angles."
              </p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/58.jpg" alt="Student" className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h4 className="font-bold">Rahul M.</h4>
                  <p className="text-white/70 text-sm">Grade 10, Mumbai</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 opacity-80"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              </div>
              <p className="text-white/90 mb-4">
                "I was always shy in school, but the team competitions helped me develop leadership skills. Now I confidently present to large groups!"
              </p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/26.jpg" alt="Student" className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h4 className="font-bold">Ananya K.</h4>
                  <p className="text-white/70 text-sm">Grade 7, Bangalore</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-white text-blue-900 hover:bg-white/90">
              Read More Success Stories
            </Button>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 md:py-24 bg-gradient-to-r from-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your IETQ Journey?</h2>
          <p className="text-white/80 max-w-3xl mx-auto text-lg mb-8">
            Join thousands of students across India who are discovering their potential, developing 
            new skills, and showcasing their talents on a national platform.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                Register Now
              </Button>
            </Link>
            <Link href="/student/competitions">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Competitions
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}