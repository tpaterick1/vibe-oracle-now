
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from 'lucide-react'; // Using Bot icon as a placeholder

interface VibeAgentMessageProps {
  message: string;
  avatarSrc?: string; // Optional: for when an image is provided
}

const VibeAgentMessage: React.FC<VibeAgentMessageProps> = ({ message, avatarSrc }) => {
  return (
    <div className="flex items-start space-x-3 p-4 glassmorphism-card border-neon-pink rounded-lg my-6 animate-fade-in-up animation-delay-200">
      <Avatar className="h-12 w-12 border-2 border-neon-pink">
        {avatarSrc ? (
          <AvatarImage src={avatarSrc} alt="AI Avatar" />
        ) : (
          <AvatarFallback className="bg-brand-charcoal">
            <Bot className="h-6 w-6 text-neon-pink" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="bg-brand-charcoal p-3 rounded-lg shadow-md flex-1">
        <p className="text-sm md:text-base text-gray-200">{message}</p>
      </div>
    </div>
  );
};

export default VibeAgentMessage;
