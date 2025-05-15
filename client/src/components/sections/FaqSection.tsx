import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

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
          
          // Tabs animation
          if (tabsRef.current) {
            gsap.fromTo(tabsRef.current, 
              { y: 30, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out" }
            );
          }
          
          // Accordion animation
          if (accordionRef.current) {
            gsap.fromTo(accordionRef.current, 
              { y: 30, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.7, delay: 0.4, ease: "power3.out" }
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
    <section ref={sectionRef} id="faq" className="py-16 md:py-24 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            Find answers to common questions about IETQ, registration, competitions, and more.
            If you don't see your question here, feel free to contact us.
          </p>
        </div>
        
        <div ref={tabsRef} className="mb-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 max-w-md mx-auto">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" ref={accordionRef}>
              <Card className="bg-white dark:bg-gray-800 shadow-md p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      What is IETQ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      India's Emerging Talent Quest (IETQ) is a nationwide virtual platform for students in grades 1-10. 
                      It offers competitions, quizzes, and learning opportunities to help students discover and develop their talents 
                      while building critical thinking, creativity, and collaboration skills.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      Who can participate in IETQ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      IETQ is open to all students studying in grades 1 through 10 in schools across India. 
                      Students can participate individually or through their schools.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      What are the different rounds in the competition?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      IETQ consists of three main rounds: Quizz Whizz (knowledge-based assessments), 
                      Think Tank Challenge (problem-solving and creativity), and Me@My Best (talent showcase). 
                      Each round is designed to evaluate different skills and abilities.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      What kind of prizes can participants win?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      IETQ offers various prizes including trophies, medals, certificates, cash prizes, scholarships, 
                      gift cards, and special awards across multiple talent categories. All participants receive participation 
                      certificates, and top performers get nationwide recognition.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      How are the competitions judged?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      IETQ has a panel of over 500 judges and subject matter experts from diverse fields such as education, 
                      arts, STEM, design, and public speaking. Each round is evaluated by specialists to ensure fair, 
                      transparent, and skill-based judgment.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </TabsContent>
            
            <TabsContent value="registration">
              <Card className="bg-white dark:bg-gray-800 shadow-md p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      How do I register for IETQ?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      You can register through our online registration form on this website. Fill in the required details, 
                      select your preferred package, and complete the payment. You'll receive a confirmation email with your 
                      unique registration ID and further instructions.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      What is the registration fee structure?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      The basic entry fee is ₹499, which includes access to all three competition rounds. 
                      The premium package is ₹999, which includes competition access plus learning materials and live webinars. 
                      Schools registering 10 or more students can contact us for special rates.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      Can I register as part of my school?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      Yes, you can register individually or through your school. If your school is organizing a group registration, 
                      they will provide you with instructions. Schools can also contact us directly for bulk registrations at special rates.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      Is there a registration deadline?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      Yes, registration is open for a limited time. The current registration window closes in 30 days. 
                      We recommend registering early to access all preparatory materials and maximize your preparation time.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      What is your refund policy?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      Refund requests must be made within 7 days of registration. After this period, or after accessing 
                      any learning materials or participating in any rounds, refunds are not available. Please see our 
                      Terms & Conditions for complete details.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </TabsContent>
            
            <TabsContent value="technical">
              <Card className="bg-white dark:bg-gray-800 shadow-md p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      How do I access the learning platform after registration?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      After registration, you'll receive login credentials for our learning management system (LMS). 
                      You can access all competitions, learning materials, and webinars through this platform using 
                      any modern web browser.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      What technical requirements do I need to participate?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      You need a computer, tablet, or smartphone with a stable internet connection. For optimal 
                      experience, we recommend using a device with a larger screen (laptop/desktop/tablet) and 
                      a modern browser like Chrome, Firefox, Safari, or Edge.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      Will I be able to access the platform if my internet is unstable?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      Our platform has limited offline capabilities. While some content can be accessed offline after 
                      initial loading, most interactive features require an internet connection. Timed assessments have 
                      built-in safeguards for brief connection interruptions.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      I'm having trouble logging in. What should I do?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      Try resetting your password using the "Forgot Password" option. Ensure you're using the email 
                      address you registered with. If problems persist, contact our technical support team at 
                      support@ietq.in or call the helpline number provided in your registration email.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      How do I upload my files for the competition rounds?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      For rounds requiring file submissions, you'll find an "Upload" button in your dashboard during 
                      the submission period. The platform accepts common file formats (PDF, JPEG, MP4, etc.) with a 
                      maximum file size of 100MB. Detailed submission instructions will be provided before each round.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Still Have Questions */}
        <div className="text-center mt-12 bg-indigo-50 dark:bg-indigo-950/30 p-8 rounded-xl">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Still Have Questions?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Our support team is ready to help you with any additional questions or concerns.
          </p>
          <div className="inline-flex gap-2 flex-wrap justify-center">
            <a href="#contact" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-indigo-600 text-white">
              Contact Support
            </a>
            <a href="mailto:info@ietq.in" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}