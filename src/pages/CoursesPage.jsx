import React from 'react';
import { motion } from 'framer-motion';
import { Clock, GraduationCap, Brain, Heart, Users, ShieldAlert, Sparkles, MessageCircle, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const courses = [{
  title: "Write it Right: SOAP Notes | Interactive Training Course",
  description: "Stop second-guessing every note. Learn to write concise, audit-ready SOAP notes in under 10 minutes.",
  instructor: "Rindie Eagle, MA, LPCC",
  level: "Intermediate",
  icon: GraduationCap,
  duration: "1.5 Hours",
  enrollmentLink: "https://soap.therapistresources.com"
}, {
  title: "Sleep Hygiene 101",
  description: "What is good sleep hygiene and how to do set up good sleep habits. Perfect for those wanting to know the science behind sleep.",
  instructor: "Rindie Eagle",
  level: "Intermediate",
  icon: ShieldAlert,
  duration: "2 Hours",
  enrollmentLink: "https://experts.45d.ai/site/rindie"
}, {
  title: "Befriending Your Nervous System",
  description: "This course is for people who are done trying to “calm down” and ready to understand what their body is actually doing.",
  instructor: "Rindie Eagle",
  level: "Beginner",
  icon: Brain,
  duration: "1.5 Hours",
  enrollmentLink: "https://experts.45d.ai/site/rindie"
}, {
  title: "Guide to Motivation",
  description: "Learn to effectively integrate mindfulness practices into your clinical work.",
  instructor: "Rindie Eagle",
  level: "Beginner",
  icon: Sparkles,
  duration: "1 Hours",
  enrollmentLink: "https://experts.45d.ai/site/rindie"
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
        <img src="/rainbowbrain.png" alt="Professional Courses" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-primary/40 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center p-6 max-w-3xl">
            <motion.h1 initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} className="text-4xl md:text-6xl font-bold mb-6 tr-grad-text">
              Professional Development
            </motion.h1>
            <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="text-xl text-foreground/90">Deepen your clinical expertise with comprehensive, yet quick courses.</motion.p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto max-w-7xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => <motion.div key={index} variants={itemVariants} whileHover={{
            scale: 1.02,
            y: -5
          }} className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-border bg-card shadow-[0_12px_28px_-12px_rgba(14,116,144,0.18)] transition-all duration-300 hover:shadow-violet-500/20 dark:bg-white/5 dark:border-white/10 dark:shadow-2xl">
            <div className="relative aspect-video bg-gradient-to-br from-[#E9E1FF] to-[#DCEEFB] dark:from-violet-300/30 dark:to-sky-300/30 flex items-center justify-center">
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#BFDDE9] bg-white px-3 py-1 text-sm font-semibold text-[#155E75] dark:border-sky-300/50 dark:bg-sky-300/30 dark:text-white dark:backdrop-blur-sm">
                  {course.level}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#F9C8D9] bg-[#FDEEF4] px-3 py-1 text-sm font-semibold text-[#BE185D] dark:border-pink-300/55 dark:bg-pink-300/30 dark:text-white dark:backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {course.duration}
                </span>
              </div>

              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#6D5BBA] to-[#0E7490] text-white shadow-[0_8px_20px_-6px_rgba(14,116,144,0.35)] transition-transform duration-300 group-hover:scale-110 dark:border dark:border-white/30 dark:bg-white/20 dark:bg-none dark:backdrop-blur-md">
                <course.icon className="h-8 w-8" />
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-primary dark:text-cyan-300">
                Instructor: {course.instructor}
              </div>
              <h3 className="text-2xl font-bold leading-snug text-foreground mb-3">{course.title}</h3>
              <p className="text-foreground/80 text-base leading-relaxed mb-6">{course.description}</p>

              <div className="mt-auto space-y-5">
                <Button
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-6 text-base font-bold text-white border-0 shadow-lg shadow-violet-900/20 transition-all duration-300 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 md:w-auto md:self-start md:px-8"
                  onClick={() => handleEnrollClick(course.enrollmentLink)}
                >
                  Enroll Now
                </Button>
                <div className="flex items-center gap-2 border-t border-border pt-4 text-sm font-medium text-foreground/70 dark:border-white/10 dark:text-white/75">
                  <GraduationCap className="h-4 w-4 text-primary dark:text-cyan-300" />
                  {course.duration}
                </div>
              </div>
            </div>
          </motion.div>)}
        </motion.div>
      </div>
    </div>
  </>;
};
export default CoursesPage;
