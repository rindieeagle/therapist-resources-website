
import React from 'react';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import ResourcesShowcase from '@/components/ResourcesShowcase';
import ProjectRoadmap from '@/components/ProjectRoadmap';
import CallToAction from '@/components/CallToAction';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Story />
      <ResourcesShowcase />
      <ProjectRoadmap />
      <CallToAction />
    </>
  );
};

export default HomePage;
