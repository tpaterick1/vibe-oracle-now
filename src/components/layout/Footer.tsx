
import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-8 mt-12 border-t border-gray-800">
      <p className="text-gray-500">&copy; {new Date().getFullYear()} StAugustineTonight. All rights reserved.</p>
      <p className="text-sm text-gray-600 mt-1">Find your vibe, discover your night.</p>
    </footer>
  );
};

export default Footer;
