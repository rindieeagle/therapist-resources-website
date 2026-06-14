import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <>
      <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-4 pb-16 pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F2F7FB] dark:bg-none dark:from-transparent dark:to-transparent"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(at_0%_0%,rgba(27,90,126,0.10)_0px,transparent_55%),radial-gradient(at_100%_100%,rgba(14,116,144,0.08)_0px,transparent_55%)] dark:bg-[radial-gradient(at_0%_0%,rgba(56,189,248,0.18)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(6,182,212,0.20)_0px,transparent_50%),linear-gradient(135deg,#0F3A52_0%,#1B5A7E_50%,#0E7490_100%)]"></div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container relative z-10 mx-auto max-w-5xl"
        >
          <a
            href="https://goldenthread.therapistresources.com"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#BFDDE9] bg-[#ECF5FA] px-4 py-2 text-xs font-bold uppercase tracking-[0.04em] text-primary transition-colors hover:border-primary hover:bg-accent dark:border-white/20 dark:bg-white/10 dark:text-cyan-100 dark:hover:bg-white/15"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#9F90C9] shadow-[0_0_8px_rgba(159,144,201,0.55)]" aria-hidden="true"></span>
            Write it Right Course Bundle is now available
          </a>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] md:text-6xl lg:text-7xl">
            <span className="block bg-gradient-to-r from-[#001C3F] via-primary to-cyan-500 bg-clip-text text-transparent dark:from-white dark:via-cyan-100 dark:to-sky-300">
              Smart Tools
            </span>
            <span className="block bg-gradient-to-r from-primary via-cyan-600 to-cyan-400 bg-clip-text text-transparent dark:from-sky-300 dark:via-cyan-400 dark:to-teal-300">
              for the Modern Therapist
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80 dark:text-white/80">
            Audit-ready documentation, ethics-first AI workflows, and clinical templates. Built by a clinician with 10+ years in private practice, for therapists who want their paperwork to hold up and their evenings back.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center rounded-full bg-gradient-to-r from-primary via-cyan-700 to-sky-600 px-7 py-3 text-base font-bold text-white shadow-[0_12px_28px_-10px_rgba(27,90,126,0.55)] transition-transform duration-200 hover:-translate-y-0.5"
              onClick={() => document.querySelector('#resources')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Resources →
            </button>
            <button
              className="inline-flex items-center rounded-full border border-[#CBD9E2] bg-white px-7 py-3 text-base font-bold text-[#001C3F] transition-colors duration-200 hover:border-primary hover:bg-accent dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Courses
            </button>
          </div>

          <div className="mt-9 grid gap-5 border-t border-border pt-5 sm:grid-cols-3 dark:border-white/10">
            <div>
              <div className="font-sans text-3xl font-extrabold text-[#001C3F] dark:text-white">10+</div>
              <div className="mt-1 text-sm text-foreground/70 dark:text-white/75">Years in private practice</div>
            </div>
            <div>
              <div className="font-sans text-3xl font-extrabold text-primary dark:text-sky-300">4-course</div>
              <div className="mt-1 text-sm text-foreground/70 dark:text-white/75">Write it Right documentation series</div>
            </div>
            <div>
              <div className="font-sans text-3xl font-extrabold text-cyan-700 dark:text-cyan-400">Bi-monthly</div>
              <div className="mt-1 text-sm text-foreground/70 dark:text-white/75">The Modern Therapist newsletter</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center py-20 px-4 relative">
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
                    src="https://i.ibb.co/VpbD95Tk/6-EF9-C4-B7-1-ADC-48-FF-A7-F9-B07367-AAE4-C4.jpg"
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
                  className="text-2xl md:text-3xl italic text-primary font-medium"
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
                    onClick={() => document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Read my story
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
