import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, BookOpen, ClipboardList, FileSearch, FileText } from 'lucide-react';

const milestones = [
  {
    quarter: 'Q1',
    title: 'SOAP Notes Course',
    description:
      'Master the art of writing effective SOAP notes. Clear, concise, and clinically sound documentation that saves you time.',
    icon: BookOpen,
    status: 'done',
    link: 'https://soap.therapistresources.com',
    gradient: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/20',
  },
  {
    quarter: 'Q2',
    title: 'Treatment Planning Course',
    description:
      'Build treatment plans that are individualized, measurable, and audit-ready. Connect goals to interventions with confidence.',
    icon: ClipboardList,
    status: 'upcoming',
    gradient: 'from-cyan-400 to-sky-500',
    glow: 'shadow-cyan-500/20',
  },
  {
    quarter: 'Q3',
    title: 'Diagnostic Assessment Course',
    description:
      'Conduct and document thorough diagnostic assessments. From clinical interviews to differential diagnosis and written formulation.',
    icon: FileSearch,
    status: 'upcoming',
    gradient: 'from-violet-400 to-purple-500',
    glow: 'shadow-violet-500/20',
  },
  {
    quarter: 'Q4',
    title: 'Discharge & Treatment Summary Course',
    description:
      'Close cases with well-documented discharge and treatment summaries that communicate outcomes and support continuity of care.',
    icon: FileText,
    status: 'upcoming',
    gradient: 'from-fuchsia-400 to-pink-500',
    glow: 'shadow-fuchsia-500/20',
  },
];

const ProjectRoadmap = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 text-cyan-300 mb-4">
            2026 Roadmap
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Write it Right
          </h2>
          <p className="text-xl text-cyan-300 max-w-2xl mx-auto">
            Clinical Documentation Series
          </p>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Four courses across four quarters. Each one builds on the last to give you a complete clinical documentation skill set.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connecting line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isVisible ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="h-full w-full bg-gradient-to-b from-emerald-500/50 via-cyan-500/50 via-purple-500/50 to-pink-500/50 origin-top"
            />
          </div>

          <div className="space-y-8 md:space-y-12">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isLeft = index % 2 === 0;
              const isDone = milestone.status === 'done';

              const card = (
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={
                    isVisible
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: isLeft ? -30 : 30 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  className={`relative backdrop-blur-xl rounded-2xl p-6 md:p-8 border transition-all duration-300 group ${
                    isDone
                      ? 'bg-white/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Quarter badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${milestone.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-md ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {milestone.quarter} 2026
                      </span>
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Available Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-white/40">
                          <Clock className="w-3.5 h-3.5" />
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed text-sm md:text-base">
                    {milestone.description}
                  </p>

                  {isDone && milestone.link && (
                    <a
                      href={milestone.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                    >
                      Start the Course
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                </motion.div>
              );

              return (
                <div key={milestone.quarter} className="relative">
                  {/* Desktop: alternating layout */}
                  <div className="hidden md:grid md:grid-cols-2 md:gap-12 items-center">
                    {isLeft ? (
                      <>
                        <div className="text-right">{card}</div>
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <div>{card}</div>
                      </>
                    )}
                  </div>

                  {/* Timeline node (desktop) */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isVisible ? { scale: 1 } : { scale: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: 0.3 + index * 0.15,
                    }}
                    className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 items-center justify-center ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/40'
                        : 'bg-slate-800 border-white/30'
                    }`}
                  >
                    {isDone && (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </motion.div>

                  {/* Mobile: stacked */}
                  <div className="md:hidden">{card}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Series CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-16 text-center backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-white/10"
        >
          <p className="text-xl md:text-2xl text-white font-semibold mb-2">
            The Complete Clinical Documentation Toolkit
          </p>
          <p className="text-white/70">
            From SOAP notes to discharge summaries. Finish the series and document with clarity and confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectRoadmap;
