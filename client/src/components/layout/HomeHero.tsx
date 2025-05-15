import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

export default function HomeHero() {
  // Animation redundancy guard
  const [animationPlayed, setAnimationPlayed] = useState(false);
  
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const azVirtualRef = useRef<HTMLDivElement>(null);
  const callToActionRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run animations if they haven't played before
    if (animationPlayed) return;
    
    // Create a main timeline for better control and performance
    const mainTimeline = gsap.timeline({
      onComplete: () => setAnimationPlayed(true)
    });

    // Animate hero elements with optimized animations
    if (heroTitleRef.current) {
      mainTimeline.from(heroTitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8, // Slightly shorter for performance
        ease: "power3.out"
      });
    }

    if (subTitleRef.current) {
      mainTimeline.from(subTitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5"); // Overlap for smoother flow
    }

    if (taglineRef.current) {
      mainTimeline.from(taglineRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5");
    }

    if (azVirtualRef.current) {
      mainTimeline.from(azVirtualRef.current, {
        scale: 0.9, // Less extreme for performance
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.5)" // Less extreme for performance
      }, "-=0.4");
    }

    if (callToActionRef.current) {
      mainTimeline.from(callToActionRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");
    }

    if (rightPanelRef.current) {
      mainTimeline.from(rightPanelRef.current, {
        x: 40, // Less extreme for performance
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.7");
    }

    // Cleanup function
    return () => {
      mainTimeline.kill(); // Ensure timeline is properly killed for cleanup
    };
  }, [animationPlayed]);

  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 text-white overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpolygon fill='%23FFC107' points='100 0 0 100 100 100' opacity='0.05'/%3E%3Cpolygon fill='%23FFFFFF' points='0 100 100 0 0 0' opacity='0.05'/%3E%3C/svg%3E\")",
        backgroundSize: "24px 24px"
      }}></div>

      {/* Glowing orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-[100px] opacity-20"></div>
      <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px] opacity-20"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Main Title */}
          <div>
            {/* A-Z Virtual Presents */}
            <div ref={azVirtualRef} className="mb-6">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 py-2 px-6 rounded-full">
                <p className="text-sm font-medium text-white/90">
                  <span className="text-amber-300 font-bold">A-Z Virtual</span> proudly presents
                </p>
              </div>
            </div>

            {/* Main Title */}
            <div ref={heroTitleRef} className="mb-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                India's Emerging<br />
                Talent Quest
              </h1>
            </div>

            {/* Subtitle */}
            <div ref={subTitleRef} className="mb-6">
              <div className="text-2xl md:text-3xl lg:text-4xl font-light text-white/80">
                EMPOWERING<br />
                TOMORROW'S<br />
                LEADERS
              </div>
            </div>

            {/* Tagline & CTA */}
            <div ref={taglineRef} className="mb-8">
              <h2 className="text-xl md:text-2xl font-medium mb-2">
                Discover. Develop. Dazzle."
              </h2>
              <p className="text-white/80 max-w-lg text-lg">
                Get Ready for the Ultimate Student Showdown — IETQ is Here!
              </p>
            </div>

            {/* Call to Action */}
            <div ref={callToActionRef} className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-bold">
                  Register Now
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column - Banner with CTAs */}
          <div ref={rightPanelRef} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-3">Unlock Your Potential</h2>
              <p className="text-white/80">
                Showcase talents, develop skills, and rise as future-ready leaders!
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-5 mb-4">
              <h3 className="text-xl font-bold mb-2">Competition</h3>

              {/* 3D Rotating Cards Container */}
              <div className="learning-card-scene mb-6">
                <div className="learning-card-container">
                  {/* Quizz Whizz Card */}
                  <div className="learning-card border-amber-500 bg-gradient-to-br from-amber-500/10 to-amber-700/20" style={{ transform: 'rotateY(0deg) translateZ(150px)' }}>
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg learning-card-icon">
                      QW
                    </div>
                    <div className="learning-card-content">
                      <h3 className="text-white">Quizz Whizz</h3>
                      <p className="mb-2 text-white/90">Knowledge-based assessment across multiple subjects</p>
                      <Button variant="link" className="text-amber-300 p-0 h-6 mt-1" aria-label="Start Quizz Whizz journey">
                        Start your journey here <span aria-hidden="true">→</span>
                      </Button>
                    </div>
                  </div>

                  {/* Think Tank Card */}
                  <div className="learning-card border-blue-500 bg-gradient-to-br from-blue-500/10 to-blue-700/20" style={{ transform: 'rotateY(120deg) translateZ(150px)' }}>
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg learning-card-icon">
                      TT
                    </div>
                    <div className="learning-card-content">
                      <h3 className="text-white">Think Tank Challenge</h3>
                      <p className="mb-2 text-white/90">Problem-solving and creative thinking challenges</p>
                      <Button variant="link" className="text-blue-300 p-0 h-6 mt-1" aria-label="Develop critical skills with Think Tank Challenge">
                        Develop your critical skills <span aria-hidden="true">→</span>
                      </Button>
                    </div>
                  </div>

                  {/* Me@My Best Card */}
                  <div className="learning-card border-green-500 bg-gradient-to-br from-green-500/10 to-green-700/20" style={{ transform: 'rotateY(240deg) translateZ(150px)' }}>
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg learning-card-icon">
                      MB
                    </div>
                    <div className="learning-card-content">
                      <h3 className="text-white">Me@My Best</h3>
                      <p className="mb-2 text-white/90">Showcase your unique talents and skills on a national platform</p>
                      <Button variant="link" className="text-green-300 p-0 h-6 mt-1" aria-label="Showcase your talents">
                        Showcase your talents <span aria-hidden="true">→</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add a message about certificates */}
              <div className="bg-white/10 rounded-lg p-4 mt-4 text-center">
                <div className="text-white font-semibold mb-1">Complete all three stages to unlock exclusive certificates!</div>
                <div className="text-sm text-white/80 mt-2">Registration closes in: 30 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}