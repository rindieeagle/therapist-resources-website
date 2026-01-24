
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Story = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-md bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl space-y-8"
        >
          {/* Story text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white font-playfair text-center mb-6">
              My Journey
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed text-center">
              From the Navy, to the IT field, to Therapy… It's been a variable smorgasbord of experiences to draw from in order to help others.
            </p>
          </motion.div>

          {/* Quote section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative pl-8 md:pl-12 py-6 border-l-4 border-gradient-to-b from-purple-500 to-cyan-500"
            style={{
              borderImage: 'linear-gradient(to bottom, #9D4EDD, #00D9FF) 1'
            }}
          >
            <Quote className="absolute -left-4 top-4 w-8 h-8 text-cyan-400" />
            <blockquote className="space-y-4">
              <p className="text-2xl md:text-3xl font-playfair italic text-white/95 leading-relaxed">
                "Follow your heart, but take your brain with you."
              </p>
              <cite className="text-lg text-purple-300 not-italic font-semibold">
                — Alfred Adler
              </cite>
            </blockquote>
          </motion.div>

          {/* Additional context */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-white/80 leading-relaxed text-center"
          >
            This quote perfectly encapsulates my approach to therapy and resource development. Combining empathy with evidence-based practices to create tools that truly serve clinicians and their clients.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Story;
