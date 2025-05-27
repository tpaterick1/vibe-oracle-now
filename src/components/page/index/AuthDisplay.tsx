
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AuthDisplayProps {
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
}

const AuthDisplay: React.FC<AuthDisplayProps> = ({ user, authLoading, logout }) => {
  return (
    <div className="flex justify-end items-center my-4 sm:my-6 space-x-4">
      {authLoading ? (
        <span className="text-muted-foreground">Loading user...</span>
      ) : user ? (
        <>
          <span className="text-neon-teal hidden sm:inline">Welcome, {user.email}!</span>
          <Button onClick={logout} variant="outline" className="border-neon-pink text-neon-pink hover:bg-neon-pink/20 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </>
      ) : (
        <Link to="/auth">
          <Button variant="outline" className="border-neon-teal text-neon-teal hover:bg-neon-teal/20 hover:text-white">
            <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
          </Button>
        </Link>
      )}
    </div>
  );
};

export default AuthDisplay;
