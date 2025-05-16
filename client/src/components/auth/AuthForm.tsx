import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { registerUser, loginUser } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { RegisterData } from '@shared/types';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// Zod Schemas
const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'teacher', 'admin']),
  grade: z.string().optional(),
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

  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(type === 'login' ? loginSchema : registerSchema),
    defaultValues: type === 'login'
      ? { email: '', password: '' }
      : {
          name: '',
          email: '',
          password: '',
          role: defaultRole,
          grade: '',
          subject: '',
          qualification: '',
          experience: '',
          school: '',
        },
  });

  const selectedRole = form.watch('role');
  const showGrade = type === 'register' && selectedRole === 'student';
  const showTeacherFields = type === 'register' && selectedRole === 'teacher';

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setLoading(true);

    try {
      if (type === 'login') {
        const result = await loginUser(data as LoginFormValues);
        if (result.error || !result.user) throw new Error(result.error || 'User not found');

        await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });

        toast({
          title: 'Login successful',
          description: `Welcome back, ${result.user.name}!`,
        });

        setLocation(`/${result.user.role}/dashboard`);
      } else {
        const payload: RegisterData = {
          ...data,
          grade: selectedRole === 'student' ? data.grade : undefined,
          subject: selectedRole === 'teacher' ? data.subject : undefined,
          qualification: selectedRole === 'teacher' ? data.qualification : undefined,
          experience: selectedRole === 'teacher' ? data.experience : undefined,
          school: selectedRole === 'teacher' ? data.school : undefined,
        };

        const result = await registerUser(payload);
        if (result.error || !result.user) throw new Error(result.error || 'User not created');

        await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });

        toast({
          title: 'Registration successful',
          description: `Welcome, ${result.user.name}!`,
        });

        setLocation(`/${result.user.role}/dashboard`);
      }
    } catch (err) {
      toast({
        title: `${type === 'login' ? 'Login' : 'Registration'} failed`,
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === 'login' ? 'Login' : 'Register for IETQ'}</CardTitle>
        <CardDescription>
          {type === 'login'
            ? 'Enter your credentials to access your account'
            : 'Create your free account to get started'}
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
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <Input type="email" placeholder="you@example.com" {...field} />
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
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(prev => !prev)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'register' && (
              <>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showGrade && (
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                Grade {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {showTeacherFields && (
                  <div className="space-y-4 mt-4 p-4 border border-blue-200 bg-blue-50 rounded-md">
                    <div className="text-sm font-semibold text-blue-700 mb-2">Teacher Information</div>

                    {['subject', 'qualification', 'experience', 'school'].map((fieldKey) => (
                      <FormField
                        key={fieldKey}
                        control={form.control}
                        name={fieldKey as keyof RegisterFormValues}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">{fieldKey}</FormLabel>
                            <FormControl>
                              <Input placeholder={`Enter ${fieldKey}`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-6">
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
        <p className="text-sm text-gray-600">
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