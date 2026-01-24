import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Briefcase, GraduationCap, Zap } from 'lucide-react'; // Added GraduationCap and Zap
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const ResourcesShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const resources = [
    {
      icon: FileText,
      title: 'Session-Ready Resources',
      description: 'Professionally designed worksheets, activities, and therapeutic materials ready to use in your next session. No preparation time needed.',
      gradient: 'from-cyan-500 to-blue-500',
      link: '/resources' // Add link property for navigation
    },
    {
      icon: GraduationCap, // Changed icon to GraduationCap
      title: 'Courses', // Changed title to Courses
      description: ( // Updated description

        <>
          Ready-to-use courses designed for therapists. Includes:
          <ul className="list-disc list-inside mt-2 text-white/70">
            <li>Motivation Course</li>
            <li>Sleep Hygiene 101 Course</li>
            <li>Befriending Your Nervous System Course</li>
          </ul>
          <p className="mt-2">Each course is crafted to integrate seamlessly into your therapeutic practice.</p>
        </>
      ),
      gradient: 'from-teal-500 to-emerald-500',
      link: '/courses' // Add link property for navigation
    },
    {
      icon: Zap, // Changed icon to Zap
      title: 'Web Apps', // Changed title to Web Apps
      description: ( // Updated description
        <>
          Interactive tools built for therapists. Features:
          <ul className="list-disc list-inside mt-2 text-white/70">
            <li>Behavioral Definition Builder (part of Golden Thread Therapist Resources)</li>
            <li>More tools coming soon</li>
          </ul>
          <p className="mt-2">Designed for immediate use in your practice. The Behavioral Definition Builder is nearly complete and ready to transform how you work with clients.</p>
        </>
      ),
      gradient: 'from-teal-500 to-cyan-500',
      link: '#' // Add a placeholder link, or a toast notification for unimplemented features
    }
  ];

  return (
    <section id="resources" ref={sectionRef} className="py-20 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional Resources
          </h2>
          <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
            Everything designed to be used immediately, with no prep time required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            // Determine if the item should be a Link or a div
            const Wrapper = resource.link && resource.link !== '#' ? Link : 'div';
            const wrapperProps = resource.link && resource.link !== '#' ? { to: resource.link } : {};

            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 transition-all hover:bg-white/10 hover:border-white/20 group"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${resource.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {resource.title}
                </h3>

                <p className="text-white/80 leading-relaxed min-h-[120px]"> {/* Added min-h for consistent card height */}
                  {resource.description}
                </p>

                <Wrapper
                  {...wrapperProps}
                  className="block mt-6" // Use block to contain the motion.div
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center text-cyan-300 font-semibold group-hover:text-cyan-200 transition-colors duration-300"
                  >
                    Learn More →
                  </motion.div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-cyan-500/10"
        >
          <p className="text-xl md:text-2xl text-white font-semibold mb-2">
            Ready to Use, Right Away
          </p>
          <p className="text-lg text-white/80">
            Download, print, and implement in your practice today
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ResourcesShowcase;