import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthForm from '@/components/auth/AuthForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'wouter';

export default function Register() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create Your IETQ Account</h1>
            <p className="text-gray-600 mt-2">Join India's premier educational platform for students and teachers</p>
          </div>
          
          <Tabs defaultValue={role || "student"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student">Register as Student</TabsTrigger>
              <TabsTrigger value="teacher">Register as Teacher</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle>Student Registration</CardTitle>
                  <CardDescription>
                    Create an account to access courses, competitions, and quizzes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AuthForm type="register" defaultRole="student" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="teacher">
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Registration</CardTitle>
                  <CardDescription>
                    Create an account to create and manage educational content for students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AuthForm type="register" defaultRole="teacher" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
