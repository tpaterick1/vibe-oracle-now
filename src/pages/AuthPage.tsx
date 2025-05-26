
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleLogin: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      toast.success('Signed up successfully! Please check your email to confirm.');
      // Depending on your Supabase settings (email confirmation),
      // user might not be logged in immediately.
      // For now, we navigate to home. If email confirmation is on, they'll be redirected if Index is protected.
      navigate('/'); 
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-deep-black p-4">
      <Tabs defaultValue="login" className="w-[400px] glassmorphism-card border-neon-pink">
        <TabsList className="grid w-full grid-cols-2 bg-brand-charcoal">
          <TabsTrigger value="login" className="data-[state=active]:bg-neon-pink data-[state=active]:text-white">Login</TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-neon-pink data-[state=active]:text-white">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="neon-text-pink">Login</CardTitle>
              <CardDescription className="text-gray-400">Access your St. Augustine Tonight account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLoginSubmit(handleLogin)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                  <Input id="login-email" type="email" placeholder="m@example.com" {...registerLogin('email')} className="bg-brand-charcoal border-gray-700 text-white focus:border-neon-pink" />
                  {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                  <Input id="login-password" type="password" {...registerLogin('password')} className="bg-brand-charcoal border-gray-700 text-white focus:border-neon-pink" />
                  {loginErrors.password && <p className="text-sm text-red-500">{loginErrors.password.message}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-neon-pink hover:bg-neon-pink/80 text-white" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="neon-text-pink">Sign Up</CardTitle>
              <CardDescription className="text-gray-400">Create a new account to save your preferences.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignupSubmit(handleSignup)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" {...registerSignup('email')} className="bg-brand-charcoal border-gray-700 text-white focus:border-neon-pink" />
                  {signupErrors.email && <p className="text-sm text-red-500">{signupErrors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                  <Input id="signup-password" type="password" {...registerSignup('password')} className="bg-brand-charcoal border-gray-700 text-white focus:border-neon-pink" />
                  {signupErrors.password && <p className="text-sm text-red-500">{signupErrors.password.message}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-neon-pink hover:bg-neon-pink/80 text-white" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;

