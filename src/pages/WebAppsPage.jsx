
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
    gradient: "from-teal-500 via-cyan-500 to-sky-500",
    buttonText: "Launch Calculator",
    link: "https://encourage.outgrow.us/caseloadcalc"
  },
  {
    title: "Attract Your Ideal Client",
    description: "A comprehensive mini-course and interactive workbook designed to help you clarify your niche and speak directly to the clients you do your best work with.",
    icon: Magnet,
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    buttonText: "Start Mini-Course",
    link: "https://share.minicoursegenerator.com/attract-your-ideal-client-638138860996532035/1"
  },
  {
    title: "Behavioral Definition Builder",
    description: "Create clear, objective operational definitions for target behaviors. Essential for functional behavior assessments and treatment planning documentation.",
    icon: Puzzle,
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
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

const WebAppsPage = () => {
  return (
    <>
      <Helmet>
        <title>Web Apps & Tools | Rindie Eagle</title>
        <meta name="description" content="Interactive clinical tools and web applications for therapists. Streamline your practice with our Caseload Calculator and Behavioral Definition Builder." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-20 px-4 relative">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Section */}
        <div className="container mx-auto max-w-7xl mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-10 md:pt-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Interactive Clinical Tools
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-100 to-sky-200 bg-clip-text text-transparent drop-shadow-lg">
              Smart Tools for <br /> Modern Therapists
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Web-based applications designed to streamline your administrative tasks
              and enhance your clinical effectiveness without the headache.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {apps.map((app, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, translateY: -5 }}
                className="group relative flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Gradient Top Border/Glow */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${app.gradient}`} />
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${app.gradient} opacity-20 blur-[50px] group-hover:opacity-30 transition-opacity duration-500`} />

                <div className="p-8 flex-grow flex flex-col relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <app.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{app.title}</h3>
                  <p className="text-white/70 leading-relaxed mb-8 flex-grow">
                    {app.description}
                  </p>

                  <div className="pt-6 border-t border-white/5">
                    <Button
                      asChild
                      className={`w-full py-6 text-lg font-medium bg-gradient-to-r ${app.gradient} hover:opacity-90 text-white border-0 shadow-lg transition-all duration-300 hover:shadow-cyan-500/40`}
                    >
                      <a href={app.link} target="_blank" rel="noopener noreferrer">
                        {app.buttonText}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default WebAppsPage;
