import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Brain, Heart, Users, ShieldAlert, Sparkles, MessageCircle, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const courses = [{
  title: "Sleep Hygiene 101",
  description: "What is good sleep hygiene and how to do set up good sleep habits. Perfect for those wanting to know the science behind sleep.",
  instructor: "Rindie Eagle",
  level: "Intermediate",
  icon: ShieldAlert,
  duration: "2 Hours",
  enrollmentLink: "https://unfold.unlikefraction.com/unfoldx/2a7d9617-0cd5-42f7-a165-6ab3f339fcc2"
}, {
  title: "Befriending Your Nervous System",
  description: "This course is for people who are done trying to “calm down” and ready to understand what their body is actually doing.",
  instructor: "Rindie Eagle",
  level: "Beginner",
  icon: Brain,
  duration: "1.5 Hours",
  enrollmentLink: "https://unfold.unlikefraction.com/unfoldx/49a77eb1-4f8b-4453-b011-61c8d8558018?course=nervous-system"
}, {
  title: "Guide to Motivation",
  description: "Learn to effectively integrate mindfulness practices into your clinical work.",
  instructor: "Rindie Eagle",
  level: "Beginner",
  icon: Sparkles,
  duration: "1 Hours",
  enrollmentLink: "https://unfold.unlikefraction.com/unfoldx/a02310ff-e048-4d41-b75c-7b3e03751eaa"
}, /*{
  title: "Group Therapy Techniques",
  description: "Strategies for facilitating dynamic and effective therapy groups.",
  instructor: "Mark Wilson",
  level: "Intermediate",
  icon: Users,
  duration: "10 Hours",
  enrollmentLink: "https://unfold.unlikefraction.com/unfoldx/49a77eb1-4f8b-4453-b011-61c8d8558018?course=group-therapy"
}, {
  title: "Crisis Intervention",
  description: "Essential skills for managing psychiatric emergencies and crises.",
  instructor: "Rindie Eagle",
  level: "All Levels",
  icon: ShieldAlert,
  duration: "6 Hours",
  enrollmentLink: "https://unfold.unlikefraction.com/unfoldx/49a77eb1-4f8b-4453-b011-61c8d8558018?course=crisis"
}, {
  title: "Couples Therapy",
  description: "Navigating relationship dynamics and fostering connection in couples work.",
  instructor: "Dr. Emily Post",
  level: "Advanced",
  icon: Heart,
  duration: "14 Hours",
  enrollmentLink: "https://unfold.unlikefraction.com/unfoldx/49a77eb1-4f8b-4453-b011-61c8d8558018?course=couples"
}, {
  title: "Child Psychology",
  description: "Developmental perspectives and play therapy interventions for children.",
  instructor: "Rindie Eagle",
  level: "Intermediate",
  icon: Baby,
  duration: "12 Hours",
  enrollmentLink: "https://unfold.unlikefraction.com/unfoldx/49a77eb1-4f8b-4453-b011-61c8d8558018?course=child-psych"
}, {
  title: "Motivational Interviewing",
  description: "Enhancing motivation for change in resistant clients.",
  instructor: "James Miller",
  level: "Beginner",
  icon: MessageCircle,
  duration: "8 Hours",
  enrollmentLink: "https://unfold.unlikefraction.com/unfoldx/49a77eb1-4f8b-4453-b011-61c8d8558018?course=motivational"
}*/];

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const CoursesPage = () => {
  const handleEnrollClick = (link) => {
    window.open(link, "_blank");
  };

  return <>
    <Helmet>
      <title>Professional Courses | Rindie Eagle</title>
      <meta name="description" content="Enroll in professional development courses for therapists. Expand your clinical skills with expert-led training." />
    </Helmet>

    <div className="min-h-screen pt-20 pb-20 px-4">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-16 h-[40vh] min-h-[400px]">
        <img src="https://images.unsplash.com/photo-1624388611710-bdf95023d1c2" alt="Professional Courses" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-slate-900/80 to-teal-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center p-6 max-w-3xl">
            <motion.h1 initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
              Professional Development
            </motion.h1>
            <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="text-xl text-white/90">Deepen your clinical expertise with comprehensive, yet quick courses.</motion.p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto max-w-7xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, index) => <motion.div key={index} variants={itemVariants} whileHover={{
            scale: 1.02,
            y: -5
          }} className="group relative flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-teal-500/10 transition-all duration-300">
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-500/20 to-sky-500/20 text-teal-300 border border-teal-500/30">
                  {course.level}
                </span>
                <span className="text-xs text-white/60 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {course.duration}
                </span>
              </div>

              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <course.icon className="w-6 h-6 text-teal-300" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{course.description}</p>

              <div className="mt-auto space-y-4">
                <div className="text-xs text-white/50 border-t border-white/10 pt-4">
                  Instructor: <span className="text-white/80">{course.instructor}</span>
                </div>
                <Button
                  className="w-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white shadow-lg transition-all duration-300"
                  onClick={() => handleEnrollClick(course.enrollmentLink)}
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          </motion.div>)}
        </motion.div>
      </div>
    </div>
  </>;
};
export default CoursesPage;