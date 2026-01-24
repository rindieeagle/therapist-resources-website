import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Briefcase, FileCheck, BookOpen, PenTool, ClipboardList, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const resources = [
  {
    title: "Session-Ready Resources",
    description: "Complete therapy session plans and activities that require zero prep time.",
    icon: FileText,
    type: "Digital Download"
  },
  {
    title: "Client Handouts",
    description: "Psychoeducational handouts to support client learning between sessions.",
    icon: Users,
    type: "PDF Bundle"
  },
  /*{
    title: "Clinical Tools",
    description: "Assessment scales and clinical documentation templates.",
    icon: Briefcase,
    type: "Templates"
  },

  {
    title: "Treatment Guides",
    description: "Step-by-step guides for specific clinical presentations.",
    icon: BookOpen,
    type: "E-Book"
  },
  {
    title: "Therapy Worksheets",
    description: "Engaging worksheets for CBT, DBT, and ACT interventions.",
    icon: PenTool,
    type: "Worksheet Pack"
  },
  {
    title: "Progress Tracking",
    description: "Visual tools to help clients see their therapeutic progress.",
    icon: ClipboardList,
    type: "Dashboard Tool"
  },
  {
    title: "Therapy Scripts",
    description: "Verbatim scripts for guided imagery and relaxation exercises.",
    icon: Mic2,
    type: "Audio Scripts"
  }*/
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const ResourcesPage = () => {
  return (
    <>
      <Helmet>
        <title>Therapy Resources | Rindie Eagle</title>
        <meta name="description" content="Explore a comprehensive collection of therapy resources, handouts, and clinical tools." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-20 px-4">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-16 h-[40vh] min-h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3"
            alt="Therapy Resources"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-teal-900/80 to-slate-900/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-6 max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent"
              >
                Therapy Resources
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/90"
              >
                Professional tools designed to enhance your clinical practice and support client growth.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30">
                      {resource.type}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <resource.icon className="w-6 h-6 text-cyan-300" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">{resource.description}</p>

                  <div className="mt-auto pt-4 border-t border-white/10">
                    <Button className="w-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white shadow-lg transition-all duration-300">
                      View Details
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

export default ResourcesPage;