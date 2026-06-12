
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Heart, Facebook } from 'lucide-react';
import { useTheme } from '@/lib/theme';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  return (
    <footer id="contact" className="relative py-12 px-4 glass border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)]">
      {/* Optional gradient overlay for extra depth, matching header vibe */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center sm:text-left sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <img src={theme === 'dark' ? '/tr-rectangle-logo-on-blue.png' : '/tr-rectangle-logo-on-white.png'} alt="Therapist Resources" className="h-auto w-44 max-w-full sm:w-52 md:w-56 object-contain" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-foreground font-bold mb-4 text-lg drop-shadow-md">Quick Links</h3>
            <nav className="space-y-2">
              <a href="#home" className="block text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
                Home
              </a>
              <a href="#resources" className="block text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
                Resources
              </a>
              <a href="#courses" className="block text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
                Courses
              </a>
              {/* Static page outside the SPA router — mirror changes in tools/blog/templates/chrome.js */}
              <a href="/blog/" className="block text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
                Blog
              </a>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="text-center sm:text-right md:text-right">
            <h3 className="text-foreground font-bold mb-4 text-lg drop-shadow-md">Connect</h3>
            <div className="flex gap-4 justify-center sm:justify-end mb-4">
              <motion.a
                href="https://www.linkedin.com/in/rindieeagle"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 backdrop-blur-sm border border-border shadow-lg transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/rindieresources"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 backdrop-blur-sm border border-border shadow-lg transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://rindieme.formaloo.me/contact"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 backdrop-blur-sm border border-border shadow-lg transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
            <p className="text-foreground/80 text-sm font-medium drop-shadow-sm">
              rindie@therapistresources.com
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-foreground/70 text-sm flex flex-wrap items-center justify-center gap-1 sm:gap-2 font-medium">
            <span>© {currentYear} Therapist Resources & Encouragement Ink.</span>
            <span className="flex items-center gap-1">
              <span className="hidden xs:inline sm:inline">Made with</span>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 drop-shadow-md" />
              <span className="hidden xs:inline sm:inline">for therapists everywhere.</span>
            </span>
          </p>
          <p className="text-muted-foreground text-xs mt-2 font-medium">All rights reserved. Professional resources designed by Rindie Eagle MA, LPCC</p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-medium text-muted-foreground">
            <a href="https://reagleeagle.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="https://reagleeagle.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Terms and Conditions</a>
            <a href="https://reagleeagle.com/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
