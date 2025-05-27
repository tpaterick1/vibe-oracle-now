
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
import { Loader2, Mail } from 'lucide-react';

const passwordAuthSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type PasswordAuthFormData = z.infer<typeof passwordAuthSchema>;

const magicLinkSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<PasswordAuthFormData>({
    resolver: zodResolver(passwordAuthSchema),
  });

  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm<PasswordAuthFormData>({
    resolver: zodResolver(passwordAuthSchema),
  });

  const { register: registerMagicLink, handleSubmit: handleMagicLinkSubmit, formState: { errors: magicLinkErrors } } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  const handleLogin: SubmitHandler<PasswordAuthFormData> = async (data) => {
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

  const handleSignup: SubmitHandler<PasswordAuthFormData> = async (data) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      toast.success('Signed up successfully! Please check your email to confirm.');
      navigate('/'); 
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn: SubmitHandler<MagicLinkFormData> = async (data) => {
    setIsMagicLinkLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          // emailRedirectTo: should be your site's URL where users are redirected after clicking the link
          // For local development, window.location.origin should work if your Supabase URL config is correct.
          // For production, ensure this matches your deployed site's URL.
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast.success('Magic link sent! Check your email to log in.');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-deep-black p-4 space-y-8">
      <Tabs defaultValue="login" className="w-full max-w-md glassmorphism-card border-neon-pink">
        <TabsList className="grid w-full grid-cols-2 bg-brand-charcoal">
          <TabsTrigger value="login" className="data-[state=active]:bg-neon-pink data-[state=active]:text-white">Login</TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-neon-pink data-[state=active]:text-white">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="neon-text-pink">Login with Password</CardTitle>
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
              <CardTitle className="neon-text-pink">Sign Up with Password</CardTitle>
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

      <Card className="w-full max-w-md glassmorphism-card border-neon-teal">
        <CardHeader>
          <CardTitle className="neon-text-teal">Sign in with Magic Link</CardTitle>
          <CardDescription className="text-gray-400">Enter your email to receive a one-time login link.</CardDescription>
        </CardHeader>
        <form onSubmit={handleMagicLinkSubmit(handleMagicLinkSignIn)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magic-link-email" className="text-gray-300">Email</Label>
              <Input id="magic-link-email" type="email" placeholder="you@example.com" {...registerMagicLink('email')} className="bg-brand-charcoal border-gray-700 text-white focus:border-neon-teal" />
              {magicLinkErrors.email && <p className="text-sm text-red-500">{magicLinkErrors.email.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-neon-teal hover:bg-neon-teal/80 text-white" disabled={isMagicLinkLoading}>
              {isMagicLinkLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send Magic Link
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;

