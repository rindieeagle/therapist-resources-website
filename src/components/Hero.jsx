import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-sky-500/20 to-teal-500/20 animate-pulse-slow"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="container mx-auto max-w-6xl relative z-10 will-change-transform"
      >
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Professional photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex justify-center will-change-transform"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl blur-xl opacity-50"></div>
                <img
                  src="https://horizons-cdn.hostinger.com/3a008976-8773-4a6b-b312-6bad53146b92/a7950b78571b3e7df77ea21c27d8e446.png"
                  alt="Rindie Eagle - Professional Therapist"
                  className="relative rounded-2xl shadow-2xl w-full max-w-md object-cover"
                />
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center md:text-left space-y-6 will-change-transform"
            >
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
                  Rindie Eagle
                </h1>
                <p className="text-xl md:text-2xl text-cyan-300 font-semibold">
                  (MA, LPCC)
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-2xl md:text-3xl italic bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 bg-clip-text text-transparent font-medium"
              >
                Therapist + Tech Nerd
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-lg text-white/80 leading-relaxed"
              >
                Bridging the gap between traditional therapy and modern technology to create innovative resources that make a real difference in clinical practice.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex gap-3 sm:gap-4 justify-center md:justify-start flex-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-semibold shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300 text-sm sm:text-base will-change-transform"
                  onClick={() => document.querySelector('#resources')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Resources
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="px-6 sm:px-8 py-3 backdrop-blur-xl bg-white/5 text-white rounded-full font-semibold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-300 text-sm sm:text-base will-change-transform"
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