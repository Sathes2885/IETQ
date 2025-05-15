import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Star, Zap, BrainCircuit, Lightbulb, Target, Users, Award, Medal, BarChart, ArrowRight } from "lucide-react";

export function UnlockPotentialSection() {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // First card animation
    if (card1Ref.current) {
      const tl1 = gsap.timeline({ repeat: -1 });
      tl1.to(card1Ref.current, { rotationY: 0, duration: 0 });
      tl1.to(card1Ref.current, { rotationY: 0, duration: 3 }); // Pause on front
      tl1.to(card1Ref.current, { rotationY: 180, duration: 1.5, ease: "power2.inOut" });
      tl1.to(card1Ref.current, { rotationY: 180, duration: 3 }); // Pause on back
      tl1.to(card1Ref.current, { rotationY: 360, duration: 1.5, ease: "power2.inOut" });
      tl1.to(card1Ref.current, { rotationY: 0, duration: 0 }); // Reset
    }
    
    // Second card animation - delay the start to create staggered effect
    if (card2Ref.current) {
      const tl2 = gsap.timeline({ repeat: -1 });
      tl2.to(card2Ref.current, { rotationY: 0, duration: 0 });
      tl2.to(card2Ref.current, { rotationY: 0, duration: 4 }); // Longer pause to create staggered effect
      tl2.to(card2Ref.current, { rotationY: 180, duration: 1.5, ease: "power2.inOut" });
      tl2.to(card2Ref.current, { rotationY: 180, duration: 3 }); // Pause on back
      tl2.to(card2Ref.current, { rotationY: 360, duration: 1.5, ease: "power2.inOut" });
      tl2.to(card2Ref.current, { rotationY: 0, duration: 0 }); // Reset
    }
    
    // Third card animation - delay even more for staggered effect
    if (card3Ref.current) {
      const tl3 = gsap.timeline({ repeat: -1 });
      tl3.to(card3Ref.current, { rotationY: 0, duration: 0 });
      tl3.to(card3Ref.current, { rotationY: 0, duration: 5 }); // Even longer pause
      tl3.to(card3Ref.current, { rotationY: 180, duration: 1.5, ease: "power2.inOut" });
      tl3.to(card3Ref.current, { rotationY: 180, duration: 3 }); // Pause on back
      tl3.to(card3Ref.current, { rotationY: 360, duration: 1.5, ease: "power2.inOut" });
      tl3.to(card3Ref.current, { rotationY: 0, duration: 0 }); // Reset
    }
    
    // Cleanup all animations on unmount
    return () => {
      gsap.killTweensOf(card1Ref.current);
      gsap.killTweensOf(card2Ref.current);
      gsap.killTweensOf(card3Ref.current);
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-indigo-800">
            Unlock Your Potential
          </h2>
          <p className="text-lg text-indigo-600 max-w-2xl mx-auto">
            Showcase talents, develop skills, and rise as future-ready leaders!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Critical Thinking */}
          <div className="h-96 perspective-1000">
            <div
              ref={card1Ref}
              className="relative w-full h-full preserve-3d transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div 
                className="absolute w-full h-full backface-hidden rounded-lg shadow-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-5 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div>
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <BrainCircuit className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Critical Thinking</h3>
                  <p className="text-purple-100">
                    Develop analytical skills and learn to approach problems from multiple perspectives.
                  </p>
                </div>
                <div className="mt-6">
                  <Badge className="bg-purple-300 text-purple-900">Core Skill</Badge>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-purple-100">Watch for more info</span>
                    <ArrowRight className="h-5 w-5 text-purple-200" />
                  </div>
                </div>
              </div>
              
              {/* Back */}
              <div 
                className="absolute w-full h-full backface-hidden rounded-lg shadow-xl bg-gradient-to-br from-indigo-800 to-purple-900 text-white p-5 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">How We Develop This Skill</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Target className="h-4 w-4 mr-2 mt-0.5 text-purple-300" />
                      <span>Problem-solving challenges across subjects</span>
                    </li>
                    <li className="flex items-start">
                      <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-purple-300" />
                      <span>Guided analysis of complex scenarios</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart className="h-4 w-4 mr-2 mt-0.5 text-purple-300" />
                      <span>Data interpretation and evaluation exercises</span>
                    </li>
                  </ul>
                </div>
                <Button className="mt-4 bg-white text-purple-800 hover:bg-purple-100">
                  View Related Courses
                </Button>
              </div>
            </div>
          </div>
          
          {/* Card 2: Creative Thinking */}
          <div className="h-96 perspective-1000">
            <div
              ref={card2Ref}
              className="relative w-full h-full preserve-3d transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div 
                className="absolute w-full h-full backface-hidden rounded-lg shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div>
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Creative Thinking</h3>
                  <p className="text-amber-100">
                    Unleash your imagination and develop innovative solutions to real-world challenges.
                  </p>
                </div>
                <div className="mt-6">
                  <Badge className="bg-amber-300 text-amber-900">Essential Skill</Badge>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-amber-100">Watch for more info</span>
                    <ArrowRight className="h-5 w-5 text-amber-200" />
                  </div>
                </div>
              </div>
              
              {/* Back */}
              <div 
                className="absolute w-full h-full backface-hidden rounded-lg shadow-xl bg-gradient-to-br from-orange-700 to-amber-900 text-white p-5 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">How We Develop This Skill</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 mr-2 mt-0.5 text-amber-300" />
                      <span>Open-ended project-based learning</span>
                    </li>
                    <li className="flex items-start">
                      <Medal className="h-4 w-4 mr-2 mt-0.5 text-amber-300" />
                      <span>Design thinking workshops and competitions</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 mr-2 mt-0.5 text-amber-300" />
                      <span>Interdisciplinary arts and science activities</span>
                    </li>
                  </ul>
                </div>
                <Button className="mt-4 bg-white text-amber-800 hover:bg-amber-100">
                  View Related Courses
                </Button>
              </div>
            </div>
          </div>
          
          {/* Card 3: Collaboration */}
          <div className="h-96 perspective-1000">
            <div
              ref={card3Ref}
              className="relative w-full h-full preserve-3d transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div 
                className="absolute w-full h-full backface-hidden rounded-lg shadow-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-5 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div>
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Collaboration</h3>
                  <p className="text-teal-100">
                    Learn to work effectively in teams, communicate ideas, and achieve shared goals.
                  </p>
                </div>
                <div className="mt-6">
                  <Badge className="bg-teal-300 text-teal-900">Future Skill</Badge>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-teal-100">Watch for more info</span>
                    <ArrowRight className="h-5 w-5 text-teal-200" />
                  </div>
                </div>
              </div>
              
              {/* Back */}
              <div 
                className="absolute w-full h-full backface-hidden rounded-lg shadow-xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white p-5 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">How We Develop This Skill</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Award className="h-4 w-4 mr-2 mt-0.5 text-teal-300" />
                      <span>Team-based competitions and challenges</span>
                    </li>
                    <li className="flex items-start">
                      <Trophy className="h-4 w-4 mr-2 mt-0.5 text-teal-300" />
                      <span>Peer review and collaborative assessment</span>
                    </li>
                    <li className="flex items-start">
                      <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-teal-300" />
                      <span>Group projects with defined roles and goals</span>
                    </li>
                  </ul>
                </div>
                <Button className="mt-4 bg-white text-teal-800 hover:bg-teal-100">
                  View Related Courses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}