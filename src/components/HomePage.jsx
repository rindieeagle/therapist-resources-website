
import React from 'react';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import ResourcesShowcase from '@/components/ResourcesShowcase';
import CallToAction from '@/components/CallToAction';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Story />
      <ResourcesShowcase />
      <CallToAction />
    </>
  );
};

export default HomePage;
