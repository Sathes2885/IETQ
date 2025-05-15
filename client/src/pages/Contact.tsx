import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin 
} from 'lucide-react';

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond to your inquiry shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        enquiryType: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-blue-800 to-indigo-900 text-white relative overflow-hidden">
          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-white/80 mb-8">
                Have questions about IETQ? We're here to help and answer any questions you might have.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mb-4">
                    <PhoneCall className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-white/80 text-center">+91 (800) 123-4567</p>
                  <p className="text-white/80 text-center">Mon-Fri: 9 AM - 6 PM</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mb-4">
                    <Mail className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-white/80 text-center">info@ietq.edu.in</p>
                  <p className="text-white/80 text-center">support@ietq.edu.in</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mb-4">
                    <MapPin className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <p className="text-white/80 text-center">123 Education Park</p>
                  <p className="text-white/80 text-center">New Delhi, 110001</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Send us a Message</h2>
                  <p className="text-gray-600 mb-8">
                    Fill out the form below, and our team will get back to you within 24 hours.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="enquiryType" className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type *</label>
                      <Select
                        value={formData.enquiryType}
                        onValueChange={(value) => handleSelectChange('enquiryType', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select enquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Enquiry</SelectItem>
                          <SelectItem value="courses">Course Information</SelectItem>
                          <SelectItem value="competitions">Competitions</SelectItem>
                          <SelectItem value="registration">Registration Process</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                      <Textarea 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : (
                        <>
                          Send Message <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
                
                {/* Map and Additional Info */}
                <div className="space-y-8">
                  {/* Map Frame - Replace with an actual map in a real application */}
                  <div className="bg-gray-200 rounded-xl overflow-hidden h-64 md:h-80">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.54005400542!2d77.04417985082293!3d28.52728034314605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sus!4v1684930934120!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="IETQ Office Location"
                    ></iframe>
                  </div>
                  
                  {/* Office Hours */}
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Office Hours</h3>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex justify-between items-center">
                            <span>Monday - Friday:</span>
                            <span>9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Saturday:</span>
                            <span>10:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Sunday:</span>
                            <span>Closed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Media */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Connect With Us</h3>
                    <div className="flex gap-4">
                      <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                        <Facebook className="h-6 w-6 text-blue-600" />
                      </a>
                      <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                        <Twitter className="h-6 w-6 text-blue-400" />
                      </a>
                      <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                        <Instagram className="h-6 w-6 text-pink-600" />
                      </a>
                      <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                        <Linkedin className="h-6 w-6 text-blue-700" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Find quick answers to common questions about IETQ.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">How do I register for IETQ competitions?</h3>
                <p className="text-gray-700">
                  You can register for competitions through our online platform. Simply create an account, 
                  browse available competitions, and follow the registration instructions for the specific competition.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Are IETQ courses available for all grade levels?</h3>
                <p className="text-gray-700">
                  Yes, IETQ offers courses for students in grades 1-10. Our courses are tailored to each grade level 
                  and aligned with the national curriculum while providing additional enrichment.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">How are competition winners determined?</h3>
                <p className="text-gray-700">
                  Competition winners are determined based on their performance according to the criteria specified for each 
                  competition. Evaluations are conducted by a panel of experts in the relevant field.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Can schools register as a group?</h3>
                <p className="text-gray-700">
                  Yes, schools can register their students as a group. We offer special registration processes for educational 
                  institutions. Please contact our support team for more information on school registrations.
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