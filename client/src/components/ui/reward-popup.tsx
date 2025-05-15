import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Award, Trophy, Star, Sparkles } from "lucide-react";

// CSS for confetti particles
const confettiStyle = `
.confetti-particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  will-change: transform;
}`;

export interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  image?: string; 
  points?: number;
  badgeText?: string;
  type?: "achievement" | "milestone" | "certificate" | "prize";
}

export default function RewardPopup({
  isOpen,
  onClose,
  title,
  description,
  image,
  points,
  badgeText = "Achievement Unlocked!",
  type = "achievement"
}: RewardPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Icon based on type
  const getIcon = () => {
    switch (type) {
      case "achievement":
        return <Award className="h-10 w-10 text-yellow-500" />;
      case "milestone":
        return <Star className="h-10 w-10 text-purple-500" />;
      case "certificate":
        return <Trophy className="h-10 w-10 text-blue-500" />;
      case "prize":
        return <Sparkles className="h-10 w-10 text-green-500" />;
      default:
        return <Award className="h-10 w-10 text-yellow-500" />;
    }
  };

  // Confetti animation
  useEffect(() => {
    if (isOpen && confettiRef.current) {
      // Create confetti particles
      const colors = ["#FFC700", "#FF0058", "#2E7CF6", "#01FF89"];
      const confettiCount = 100;
      
      // Clear any existing confetti
      while (confettiRef.current.firstChild) {
        confettiRef.current.removeChild(confettiRef.current.firstChild);
      }
      
      // Create and animate confetti particles
      for (let i = 0; i < confettiCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confettiRef.current.appendChild(particle);
        
        // Random positions for starting point (middle bottom of the popup)
        const startX = popupRef.current ? popupRef.current.clientWidth / 2 : 150;
        const startY = popupRef.current ? popupRef.current.clientHeight : 300;
        
        gsap.set(particle, {
          x: startX,
          y: startY,
          rotation: Math.random() * 360
        });
        
        // Animate particle explosion
        gsap.to(particle, {
          x: startX + (Math.random() - 0.5) * 300,
          y: startY - 200 - Math.random() * 200,
          opacity: 0,
          rotation: Math.random() * 520,
          duration: 1 + Math.random() * 2,
          ease: "power2.out",
          onComplete: () => {
            if (confettiRef.current && particle.parentNode === confettiRef.current) {
              confettiRef.current.removeChild(particle);
            }
          }
        });
      }
    }
  }, [isOpen]);

  // Entry animation for popup content
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const elements = contentRef.current.children;
      gsap.from(elements, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.4)"
      });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={popupRef}
            className="bg-white dark:bg-slate-900 relative rounded-xl overflow-hidden shadow-2xl max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Confetti container */}
            <div 
              ref={confettiRef} 
              className="absolute inset-0 pointer-events-none overflow-hidden"
            ></div>
            
            {/* Reward content */}
            <div className="p-6">
              <div className="text-center" ref={contentRef}>
                <Badge 
                  variant="outline" 
                  className="mb-4 px-3 py-1 text-sm font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90 border-primary/70"
                >
                  {badgeText}
                </Badge>
                
                <div className="mb-6 flex justify-center">
                  {image ? (
                    <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-primary/20 dark:border-primary/30 shadow-lg">
                      <img src={image} alt={title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      {getIcon()}
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                
                {description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {description}
                  </p>
                )}
                
                {points !== undefined && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="inline-flex items-center bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500 dark:fill-yellow-300 dark:text-yellow-300" />
                      <span className="font-bold">{points}</span>
                      <span className="ml-1 text-sm">points earned</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={onClose}
                  className="w-full mt-2 text-base font-medium py-2 h-auto"
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}