
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Heart, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer id="contact" className="relative py-12 px-4 backdrop-blur-xl bg-white/5 border-t border-white/10 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)]">
      {/* Optional gradient overlay for extra depth, matching header vibe */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <img src="/logo.png" alt="Therapist Resources" className="h-32 w-auto" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-white font-bold mb-4 text-lg drop-shadow-md">Quick Links</h3>
            <nav className="space-y-2">
              <a href="#home" className="block text-white/80 hover:text-cyan-300 transition-colors duration-300 font-medium">
                Home
              </a>
              <a href="#resources" className="block text-white/80 hover:text-cyan-300 transition-colors duration-300 font-medium">
                Resources
              </a>
              <a href="#courses" className="block text-white/80 hover:text-cyan-300 transition-colors duration-300 font-medium">
                Courses
              </a>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-right">
            <h3 className="text-white font-bold mb-4 text-lg drop-shadow-md">Connect</h3>
            <div className="flex gap-4 justify-center md:justify-end mb-4">
              <motion.a
                href="https://www.linkedin.com/in/rindieeagle"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-cyan-500/50 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/rindieresources"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-sky-500/50 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://rindieme.formaloo.me/contact"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-teal-500/50 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
            <p className="text-white/80 text-sm font-medium drop-shadow-sm">
              rindie@therapistresources.com
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/20 text-center">
          <p className="text-white/70 text-sm flex items-center justify-center gap-2 font-medium">
            <span>© {currentYear} Therapist Resources & Encouragement Ink.</span>
            <span className="hidden sm:inline">Made with</span>
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400 inline sm:inline drop-shadow-md" />
            <span className="hidden sm:inline">for therapists everywhere.</span>
          </p>
          <p className="text-white/50 text-xs mt-2 font-medium">All rights reserved. Professional resources designed by Rindie Eagle MA, LPCC</p>

          <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-white/50">
            <a href="https://reagleeagle.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Privacy Policy</a>
            <a href="https://reagleeagle.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Terms and Conditions</a>
            <a href="https://reagleeagle.com/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
