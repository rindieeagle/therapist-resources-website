
import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Magnet, Puzzle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const apps = [
  {
    title: "Caseload Calculator",
    description: "Calculate your ideal caseload based on your income goals, business expenses, and desired work-life balance. Stop guessing and start planning for a sustainable practice.",
    icon: Calculator,
    gradient: "from-primary via-sky-500 to-primary",
    buttonText: "Launch Calculator",
    link: "https://encourage.outgrow.us/caseloadcalc"
  },
  {
    title: "Attract Your Ideal Client",
    description: "A comprehensive mini-course and interactive workbook designed to help you clarify your niche and speak directly to the clients you do your best work with.",
    icon: Magnet,
    gradient: "from-primary via-sky-500 to-cyan-500",
    buttonText: "Start Mini-Course",
    link: "https://share.minicoursegenerator.com/attract-your-ideal-client-638138860996532035/1"
  },
  {
    title: "Behavioral Definition Builder",
    description: "Create clear, objective operational definitions for target behaviors. Essential for functional behavior assessments and treatment planning documentation.",
    icon: Puzzle,
    gradient: "from-primary via-teal-500 to-emerald-500",
    buttonText: "Build Definition",
    link: "https://bdb.therapistresources.com/"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const cardVariants = [
  {
    cover: 'from-[#E9E1FF] to-[#DCEEFB] dark:from-white/15 dark:to-cyan-300/20',
    glyph: 'from-[#1B5A7E] to-[#0E7490]',
    badge: 'border-[#BFDDE9] bg-white text-[#155E75] dark:border-sky-300/50 dark:bg-sky-300/30 dark:text-white'
  },
  {
    cover: 'from-[#D7F0F4] to-[#DDF3EC] dark:from-cyan-500/30 dark:to-teal-500/30',
    glyph: 'from-[#0E7490] to-[#0D9488]',
    badge: 'border-[#B6E1DA] bg-white text-[#0F766E] dark:border-cyan-400/40 dark:bg-cyan-500/30 dark:text-cyan-300'
  }
];

const WebAppsPage = () => {
  return (
    <>
      <Helmet>
        <title>Web Apps & Tools | Rindie Eagle</title>
        <meta name="description" content="Interactive clinical tools and web applications for therapists. Streamline your practice with our Caseload Calculator and Behavioral Definition Builder." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-20 px-4 relative">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Section */}
        <div className="container mx-auto max-w-7xl mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-10 md:pt-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-border text-primary text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Interactive Clinical Tools
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tr-grad-text drop-shadow-lg">
              Smart Tools for <br /> Modern Therapists
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Web-based applications designed to streamline your administrative tasks
              and enhance your clinical effectiveness without the headache.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {apps.map((app, index) => {
              const variant = cardVariants[index % cardVariants.length];
              return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, translateY: -5 }}
                className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-border bg-card shadow-[0_12px_28px_-12px_rgba(14,116,144,0.18)] transition-all duration-300 hover:shadow-2xl dark:bg-white/5 dark:border-white/10 dark:shadow-2xl"
              >
                <div className={`relative aspect-video bg-gradient-to-br ${variant.cover} flex items-center justify-center`}>
                  <div className="absolute left-4 top-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${variant.badge} dark:backdrop-blur-sm`}>
                      {app.buttonText}
                    </span>
                  </div>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br ${variant.glyph} text-white shadow-[0_8px_20px_-6px_rgba(14,116,144,0.35)] transition-transform duration-300 group-hover:scale-110 dark:border dark:border-cyan-300/40 dark:bg-cyan-300/20 dark:bg-none dark:text-cyan-300 dark:backdrop-blur-md`}>
                    <app.icon className="w-7 h-7" />
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col relative z-10">
                  <div className="mb-2 bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-xs font-bold uppercase tracking-[0.06em] text-transparent dark:from-cyan-300 dark:to-sky-200">
                    Interactive Clinical Tools
                  </div>

                  <h3 className="text-xl font-bold leading-snug text-foreground mb-2">{app.title}</h3>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-5 flex-grow">
                    {app.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <Button
                      asChild
                      className={`w-full rounded-xl bg-gradient-to-r ${app.gradient} px-5 py-5 text-sm font-bold text-white border-0 shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-cyan-500/40`}
                    >
                      <a href={app.link} target="_blank" rel="noopener noreferrer">
                        {app.buttonText}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default WebAppsPage;
