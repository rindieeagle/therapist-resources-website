
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Facebook } from 'lucide-react';

const CallToAction = () => {
  return (
    <section id="courses" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-md bg-gradient-to-br from-cyan-500/20 via-sky-500/20 to-teal-500/20 rounded-3xl p-12 md:p-16 border border-white/20 shadow-2xl text-center"
        >
          <div className="pt-8">
            <p className="text-white/80 mb-4">Connect with me</p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-bold shadow-lg hover:from-cyan-400 hover:to-teal-400 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
                Follow on LinkedIn
              </motion.a>
              <motion.a
                href="https://www.facebook.com/rindieresources"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-bold shadow-lg hover:from-cyan-400 hover:to-teal-400 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
                Follow on Facebook
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
