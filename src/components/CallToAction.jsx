
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Facebook } from 'lucide-react';

const CallToAction = () => {
  return (
    <section id="courses" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="glass-strong bg-gradient-to-br from-primary/10 via-accent/20 to-primary/10 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl text-center"
        >
          <div className="pt-4 sm:pt-8">
            <p className="text-foreground/80 mb-4">Connect with me</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
              >
                <Linkedin className="w-5 h-5" />
                Follow on LinkedIn
              </a>
              <a
                href="https://www.facebook.com/rindieresources"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
              >
                <Facebook className="w-5 h-5" />
                Follow on Facebook
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
