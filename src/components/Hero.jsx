import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-teal-500/20 animate-pulse-slow"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto max-w-6xl relative z-10"
      >
        {/* Glass morphism card */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Professional photo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl blur-xl opacity-50"></div>
                <img
                  src="https://horizons-cdn.hostinger.com/3a008976-8773-4a6b-b312-6bad53146b92/a7950b78571b3e7df77ea21c27d8e446.png"
                  alt="Rindie Eagle - Professional Therapist"
                  className="relative rounded-2xl shadow-2xl w-full max-w-md object-cover"
                />
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center md:text-left space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 font-playfair">
                  Rindie Eagle
                </h1>
                <p className="text-xl md:text-2xl text-cyan-300 font-semibold">
                  (MA, LPCC)
                </p>
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-2xl md:text-3xl font-playfair italic bg-gradient-to-r from-cyan-300 via-purple-300 to-teal-300 bg-clip-text text-transparent"
              >
                Therapist + Tech Nerd
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg text-white/80 leading-relaxed"
              >
                Bridging the gap between traditional therapy and modern technology to create innovative resources that make a real difference in clinical practice.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex gap-4 justify-center md:justify-start flex-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  onClick={() => document.querySelector('#resources')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Resources
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 backdrop-blur-md bg-white/10 text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                  onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Courses
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;