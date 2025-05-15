import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface RegistrationSectionProps {
  inDashboard?: boolean;
}

export function RegistrationSection({ inDashboard = false }: RegistrationSectionProps) {
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    age: '',
    schoolName: '',
    schoolLocation: '',
    grade: '',
    registrationType: 'individual'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.studentName || !formData.email || !formData.phone || !formData.grade) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Show success message
    toast({
      title: "Registration Submitted",
      description: "Thank you for registering! Check your email for confirmation.",
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
          
          // Form animation
          if (formRef.current) {
            gsap.fromTo(formRef.current, 
              { y: 40, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out" }
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
    <section ref={sectionRef} id="registration" className={inDashboard ? "" : "py-16 md:py-24 bg-gradient-to-b from-white to-amber-50 dark:from-gray-900 dark:to-amber-950/30"}>
      <div className={inDashboard ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {!inDashboard && (
          <div ref={headingRef} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Join IETQ?</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
              Register now to embark on an exciting journey of discovery, learning, and achievement.
              Complete the form below to secure your spot in India's premier talent program.
            </p>
          </div>
        )}
        
        {/* Registration Form */}
        <div ref={formRef} className={`bg-white dark:bg-gray-800 rounded-xl ${inDashboard ? "p-4" : "p-8 shadow-lg max-w-4xl mx-auto"}`}>
          {!inDashboard && <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Registration Form</h3>}
          
          {!inDashboard && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={formData.registrationType === 'individual' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleSelectChange('registrationType', 'individual')}
                  className="gap-1"
                >
                  <User className="h-4 w-4" />
                  Individual Registration
                </Button>
                <Button 
                  variant={formData.registrationType === 'school' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleSelectChange('registrationType', 'school')}
                  className="gap-1"
                >
                  <Users className="h-4 w-4" />
                  School-Coordinated
                </Button>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Name */}
              <div className="space-y-2">
                <Label htmlFor="studentName" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Student Name *
                </Label>
                <Input
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter student's full name"
                  className="w-full"
                />
              </div>
              
              {/* Parent/Guardian Name */}
              <div className="space-y-2">
                <Label htmlFor="parentName" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Parent/Guardian Name *
                </Label>
                <Input
                  id="parentName"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder="Enter parent/guardian's name"
                  className="w-full"
                />
              </div>
              
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  className="w-full"
                />
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full"
                />
              </div>
              
              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter home address"
                  className="w-full"
                />
              </div>
              
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Student's Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="5"
                  max="18"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  className="w-full"
                />
              </div>
              
              {/* Grade */}
              <div className="space-y-2">
                <Label htmlFor="grade" className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  Grade *
                </Label>
                <Select 
                  value={formData.grade} 
                  onValueChange={(value) => handleSelectChange('grade', value)}
                >
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Grade 1</SelectItem>
                    <SelectItem value="2">Grade 2</SelectItem>
                    <SelectItem value="3">Grade 3</SelectItem>
                    <SelectItem value="4">Grade 4</SelectItem>
                    <SelectItem value="5">Grade 5</SelectItem>
                    <SelectItem value="6">Grade 6</SelectItem>
                    <SelectItem value="7">Grade 7</SelectItem>
                    <SelectItem value="8">Grade 8</SelectItem>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  School Name *
                </Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  placeholder="Enter school name"
                  className="w-full"
                />
              </div>
              
              {/* School Location */}
              <div className="space-y-2">
                <Label htmlFor="schoolLocation" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  School Location
                </Label>
                <Select 
                  value={formData.schoolLocation} 
                  onValueChange={(value) => handleSelectChange('schoolLocation', value)}
                >
                  <SelectTrigger id="schoolLocation">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4 text-center">
              <Button 
                type="submit" 
                size={inDashboard ? "default" : "lg"} 
                className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
              >
                {inDashboard ? (
                  <>Register Friend</>
                ) : (
                  <><CreditCard className="h-4 w-4" /> Pay Now</>
                )}
              </Button>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                By registering, you agree to our Terms & Conditions and Privacy Policy.
                A confirmation email will be sent once registration is complete.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}