
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Story = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Load Mailchimp validation script
  useEffect(() => {
    if (formRef.current && !document.getElementById('mc-validate-script')) {
      const script = document.createElement('script');
      script.id = 'mc-validate-script';
      script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Journey Block */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl bg-white/5 rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl space-y-8"
          >
            {/* Story text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
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
              className="relative pl-8 md:pl-12 py-6 border-l-4 border-gradient-to-b from-teal-500 to-cyan-500"
              style={{
                borderImage: 'linear-gradient(to bottom, #9D4EDD, #00D9FF) 1'
              }}
            >
              <Quote className="absolute -left-4 top-4 w-8 h-8 text-cyan-400" />
              <blockquote className="space-y-4">
                <p className="text-2xl md:text-3xl italic text-white/95 leading-relaxed">
                  "Follow your heart, but take your brain with you."
                </p>
                <cite className="text-lg text-teal-300 not-italic font-semibold">
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

          {/* Embedded Landing Page Block */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header section with background */}
            <div 
              className="relative p-6 sm:p-8 md:p-10 text-center"
              style={{
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/laptop-bg.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                Join the Modern Therapist
              </h2>
              <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                Bi-monthly field notes on AI, tech, and workflows that actually reduce your workload and generate income.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Get 5 prompts for creating psychoeducational handouts for clients - FREE!
              </p>
            </div>
            
            {/* Form section */}
            <div ref={formRef} id="mc_embed_shell" className="w-full p-6 sm:p-8 md:p-10">
              <div id="mc_embed_signup" className="w-full">
                <form
                  action="https://reagleeagle.us4.list-manage.com/subscribe/post?u=6a56fdf5ad057aa9d119505c9&amp;id=ad2a6e89da&amp;f_id=005640e8f0"
                  method="post"
                  id="mc-embedded-subscribe-form"
                  name="mc-embedded-subscribe-form"
                  className="validate"
                  target="_blank"
                >
                  <div id="mc_embed_signup_scroll" className="space-y-4">
                    <div className="mc-field-group">
                      <input
                        type="text"
                        name="FNAME"
                        className="w-full px-4 py-4 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                        id="mce-FNAME"
                        placeholder="First Name"
                      />
                    </div>
                    
                    <div className="mc-field-group">
                      <input
                        type="text"
                        name="LNAME"
                        className="w-full px-4 py-4 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                        id="mce-LNAME"
                        placeholder="Last Name"
                      />
                    </div>
                    
                    <div className="mc-field-group">
                      <input
                        type="email"
                        name="EMAIL"
                        className="w-full px-4 py-4 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                        id="mce-EMAIL"
                        required
                        placeholder="Email Address"
                      />
                    </div>
                    
                    <input type="hidden" name="tags" value="7148976" />
                    
                    <div id="mce-responses" className="clear">
                      <div className="response text-red-400" id="mce-error-response" style={{ display: 'none' }}></div>
                      <div className="response text-green-400" id="mce-success-response" style={{ display: 'none' }}></div>
                    </div>
                    
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                      <input type="text" name="b_6a56fdf5ad057aa9d119505c9_ad2a6e89da" tabIndex="-1" defaultValue="" />
                    </div>
                    
                    <div className="clear pt-2">
                      <input
                        type="submit"
                        name="subscribe"
                        id="mc-embedded-subscribe"
                        className="w-full px-8 py-4 bg-purple-300 hover:bg-purple-400 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 cursor-pointer"
                        value="Join and Send those prompts my way!"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Story;
