import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { registerUser, loginUser } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { RegisterData } from '@shared/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// For the public registration form, we allow registering as student, teacher or admin
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'teacher', 'admin']),
  grade: z.string().optional(),
  // Teacher specific fields
  subject: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  school: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: 'login' | 'register';
  defaultRole?: 'student' | 'teacher' | 'admin';
}

export default function AuthForm({ type, defaultRole = 'student' }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formSchema = type === 'login' ? loginSchema : registerSchema;
  
  // Define form with proper types
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: type === 'login' 
      ? { email: '', password: '' } 
      : { 
          name: '', 
          email: '', 
          password: '', 
          role: defaultRole, 
          grade: '8',
          subject: '',
          qualification: '',
          experience: '',
          school: ''
        },
  });

  // Watch the role to determine which fields should be shown
  const selectedRole = form.watch('role');
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const showGradeField = type === 'register' && selectedRole === 'student';
  const showTeacherFields = type === 'register' && selectedRole === 'teacher';

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      if (type === 'login') {
        console.log('Attempting login with:', data.email);
        const loginData = data as LoginFormValues;
        const result = await loginUser(loginData);
        
        console.log('Login result:', { 
          success: !!result.user,
          error: result.error || 'none',
          hasToken: !!result.token 
        });
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        if (!result.user) {
          throw new Error('Authentication successful but user profile not found. Please try again.');
        }
        
        if (result.user) {
          // Force a complete invalidation and refetch of auth status
          await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
          queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${result.user.name}!`,
          });
          
          // Redirect based on user role
          if (result.user.role === 'admin') {
            setLocation('/admin/dashboard');
          } else if (result.user.role === 'teacher') {
            setLocation('/teacher/dashboard');
          } else {
            setLocation('/student/dashboard');
          }
        }
      } else {
        // Handle registration (student or teacher)
        console.log('Attempting registration with:', data);
        
        const registerData: RegisterData = {
          ...data,
          // Only include grade if role is student
          grade: data.role === 'student' ? data.grade : undefined,
          // Only include teacher-specific fields if role is teacher
          subject: data.role === 'teacher' ? data.subject : undefined,
          qualification: data.role === 'teacher' ? data.qualification : undefined,
          experience: data.role === 'teacher' ? data.experience : undefined,
          school: data.role === 'teacher' ? data.school : undefined,
        };
        
        const result = await registerUser(registerData);
        
        console.log('Registration result:', { 
          success: !!result.user,
          error: result.error || 'none',
          hasToken: !!result.token 
        });
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        if (!result.user) {
          throw new Error('Registration process completed but user profile not created. Please try again or contact support.');
        }
        
        if (result.user) {
          // Force a complete invalidation and refetch of auth status
          await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
          queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
          
          toast({
            title: "Registration successful",
            description: `Your ${result.user.role} account has been created successfully!`,
          });
          
          // Redirect based on user role
          if (result.user.role === 'admin') {
            setLocation('/admin/dashboard');
          } else if (result.user.role === 'teacher') {
            setLocation('/teacher/dashboard');
          } else {
            setLocation('/student/dashboard');
          }
        }
      }
    } catch (error) {
      console.error(`${type === 'login' ? 'Login' : 'Registration'} error:`, error);
      toast({
        title: `${type === 'login' ? 'Login' : 'Registration'} failed`,
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === 'login' ? 'Login' : 'Create an Account'}</CardTitle>
        <CardDescription>
          {type === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Fill in the information below to join IETQ'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === 'register' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Show role and grade selection for registration */}
            {type === 'register' && (
              <>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <div className="text-xs text-gray-500 mb-2">
                        Please select your role in the platform (Student, Teacher, or Administrator)
                      </div>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {showGradeField && (
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((grade) => (
                              <SelectItem key={grade} value={grade.toString()}>
                                Grade {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Show teacher-specific fields */}
                {showTeacherFields && (
                  <div className="space-y-4 mt-4 p-4 border border-blue-100 rounded-lg bg-blue-50">
                    <div className="text-sm font-semibold text-blue-700 mb-2">
                      Teacher Information
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Specialization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Mathematics, Science, English" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Highest Qualification</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. B.Ed, M.Ed, Ph.D" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 5 years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School/Institution</FormLabel>
                          <FormControl>
                            <Input placeholder="Name of your school or institution" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </>
            )}
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {type === 'login' ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                type === 'login' ? 'Login' : 'Register'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          {type === 'login' ? (
            <>
              Don't have an account?{' '}
              <Button variant="link" className="p-0" onClick={() => setLocation('/register')}>
                Register
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button variant="link" className="p-0" onClick={() => setLocation('/login')}>
                Login
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
