import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-primary/10 animate-pulse-slow"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto max-w-6xl relative z-10"
      >
        {/* Glass morphism card */}
        <div className="glass rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Professional photo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-sky-500 rounded-2xl blur-xl opacity-40"></div>
                <img
                  src="https://horizons-cdn.hostinger.com/3a008976-8773-4a6b-b312-6bad53146b92/a7950b78571b3e7df77ea21c27d8e446.png"
                  alt="Rindie Eagle - Professional Therapist"
                  className="relative rounded-2xl shadow-2xl w-full max-w-md object-cover"
                />
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-center md:text-left space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-3">
                  Rindie Eagle
                </h1>
                <p className="text-xl md:text-2xl text-primary font-semibold">
                  (MA, LPCC)
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-2xl md:text-3xl italic tr-grad-text font-medium"
              >
                Therapist + Tech Nerd
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-lg text-foreground/80 leading-relaxed"
              >
                Bridging the gap between traditional therapy and modern technology to create innovative resources that make a real difference in clinical practice.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex gap-3 sm:gap-4 justify-center md:justify-start flex-wrap"
              >
                <button
                  className="px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
                  onClick={() => document.querySelector('#resources')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Resources
                </button>
                <button
                  className="px-6 sm:px-8 py-3 bg-card text-foreground rounded-full font-semibold border border-border hover:bg-accent hover:border-border hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
                  onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Courses
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
