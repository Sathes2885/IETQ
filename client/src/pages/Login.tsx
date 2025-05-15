import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthForm from '@/components/auth/AuthForm';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary-500/10 filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-accent/10 filter blur-3xl"></div>
        
        <div className="w-full max-w-md z-10 relative">
          <div className="text-center mb-8">
            <h2 className="mt-6 text-4xl font-bold text-gray-900 font-education">
              Welcome Back to <span className="text-primary-600 tracking-wider font-rubik">IETQ</span>
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Log in to access your courses, competitions and quizzes
            </p>
          </div>
          
          <AuthForm type="login" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
