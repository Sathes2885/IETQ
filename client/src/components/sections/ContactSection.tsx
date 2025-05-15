import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { 
  Mail,
  Phone,
  MapPin,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ContactSection() {
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    queryType: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      queryType: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Show success message
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us! We'll respond soon.",
    });
    
    // In a real app, this would send data to the server
    console.log('Form submitted:', formData);
  };

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
          
          // Contact info animation
          if (contactInfoRef.current) {
            gsap.fromTo(contactInfoRef.current, 
              { x: -30, opacity: 0 }, 
              { x: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out" }
            );
          }
          
          // Form animation
          if (formRef.current) {
            gsap.fromTo(formRef.current, 
              { x: 30, opacity: 0 }, 
              { x: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out" }
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
    <section ref={sectionRef} id="contact" className="py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            Have questions or need assistance? Reach out to our team.
            We're here to help you with any inquiries about IETQ.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div ref={contactInfoRef}>
            <Card className="bg-white dark:bg-gray-800 shadow-md p-6 h-full">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Mail className="h-5 w-5 animate-pulse-icon" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Email</h4>
                    <a href="mailto:info@ietq.in" className="text-indigo-600 dark:text-indigo-400 hover:underline">info@ietq.in</a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      For general inquiries
                    </p>
                    <a href="mailto:support@ietq.in" className="text-indigo-600 dark:text-indigo-400 hover:underline block mt-2">support@ietq.in</a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      For technical support
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Phone className="h-5 w-5 animate-shake" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Phone / WhatsApp</h4>
                    <a href="tel:+919876543210" className="text-indigo-600 dark:text-indigo-400 hover:underline">+91 98765 43210</a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Monday to Friday, 9:00 AM - 6:00 PM IST
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      WhatsApp for quick responses
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <MapPin className="h-5 w-5 animate-bounce-slow" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Office Address</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      123 Education Avenue, <br />
                      Cyber City, Gurgaon <br />
                      Haryana - 122001, India
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Google Maps Embed (Placeholder) */}
              <div className="mt-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-gray-500 dark:text-gray-400">Google Maps Embed would be placed here</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    (For privacy and performance reasons, the actual embed is not loaded in this demo)
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div ref={formRef}>
            <Card className="bg-white dark:bg-gray-800 shadow-md p-6 h-full">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full"
                  />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full"
                  />
                </div>
                
                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full"
                  />
                </div>
                
                {/* Query Type */}
                <div className="space-y-2">
                  <Label htmlFor="queryType">Query Type</Label>
                  <Select 
                    value={formData.queryType} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="queryType">
                      <SelectValue placeholder="Select query type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registration">Registration</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="school-partnership">School Partnership</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className="w-full min-h-[120px]"
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full sm:w-auto gap-2">
                    <Send className="h-4 w-4" /> Send Message
                  </Button>
                  
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    We typically respond within 1-2 business days.
                    Your contact information will only be used to respond to your inquiry.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}