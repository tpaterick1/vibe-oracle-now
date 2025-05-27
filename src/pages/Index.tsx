
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import IndexPageContent from '@/components/page/index/IndexPageContent';

const Index = () => {
  return (
    <div className="min-h-screen bg-brand-deep-black text-foreground p-4 md:p-8 selection:bg-neon-pink selection:text-white">
      <div className="container mx-auto">
        <Header />
        <IndexPageContent />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
