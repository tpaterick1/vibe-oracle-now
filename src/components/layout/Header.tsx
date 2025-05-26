
import React from 'react';

const Header = () => {
  return (
    <header className="py-8 text-center">
      <h1 className="text-5xl md:text-6xl font-bold animate-fade-in-up">
        <span className="neon-text-blue">St</span>
        <span className="neon-text-pink">Augustine</span>
        <span className="neon-text-teal">Tonight</span>
      </h1>
      <p className="mt-4 text-xl text-gray-300 tracking-wide animate-fade-in-up animation-delay-200">
        No scrolls, just vibes.
      </p>
    </header>
  );
};

export default Header;
