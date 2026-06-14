
import React from 'react';
import { motion } from 'framer-motion';

const CallToAction = () => {
  const scrollToCourses = () =>
    document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="bundle" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] px-6 py-14 text-center shadow-[0_25px_60px_-15px_rgba(0,28,63,0.6)] sm:px-12 sm:py-16"
          style={{ background: 'linear-gradient(135deg, #001C3F 0%, #1B5A7E 55%, #0E7490 100%)' }}
        >
          {/* Peacock + aqua radial blooms for depth */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(at 12% 0%, rgba(56,189,248,0.28) 0px, transparent 55%), radial-gradient(at 88% 100%, rgba(94,234,212,0.20) 0px, transparent 55%)',
            }}
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">
              All five courses · Available now
            </span>

            <h2 className="mx-auto mt-5 max-w-3xl font-sans text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
              Complete the series. Document with confidence.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              The Write it Right bundle takes you from intake to discharge, all based on the golden-thread framework. Build audit-ready notes that hold up, and get your evenings back.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="https://goldenthread.therapistresources.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-[#001C3F] shadow-[0_12px_30px_-8px_rgba(6,182,212,0.6)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DD3FC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001C3F]"
              >
                Get the Write it Right Bundle
                <span aria-hidden="true">→</span>
              </a>
              <button
                onClick={scrollToCourses}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001C3F]"
              >
                Browse the courses
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
