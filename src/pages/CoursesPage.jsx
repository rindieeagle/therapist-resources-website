import React from 'react';
import { motion } from 'framer-motion';
import { Clock, GraduationCap, Brain, Heart, Users, ShieldAlert, Sparkles, MessageCircle, Baby, Waypoints, BookOpen, ClipboardList, FileSearch, FileText, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const courses = [{
  title: "Write it Right Bundle",
  description: "Get all four Write it Right documentation courses—SOAP Notes, Treatment Planning, Diagnostic Assessment, and Discharge & Treatment Summary—in one bundle and save $51 versus buying them individually.",
  instructor: "Rindie Eagle, MA, LPCC & Renee Devine, MS, LMHC",
  level: "Save $51",
  icon: Layers,
  duration: "4 Courses",
  enrollmentLink: "https://goldenthread.therapistresources.com",
  cta: "Get the Bundle"
}, {
  title: "Write it Right: The Golden Thread & Medical Necessity",
  description: "Establish the foundation of defensible documentation. Tie assessment, goals, and interventions into one continuous golden thread that demonstrates medical necessity.",
  instructor: "Rindie Eagle, MA, LPCC & Renee Devine, MS, LMHC",
  level: "Beginner",
  icon: Waypoints,
  duration: "1 Hour",
  enrollmentLink: "https://foundations.therapistresources.com"
}, {
  title: "Write it Right: SOAP Notes",
  description: "Master the art of writing effective SOAP notes. Clear, concise, and clinically sound documentation that saves you time.",
  instructor: "Rindie Eagle, MA, LPCC & Renee Devine, MS, LMHC",
  level: "Beginner",
  icon: BookOpen,
  duration: "2 Hours",
  enrollmentLink: "https://soap.therapistresources.com"
}, {
  title: "Write it Right: Treatment Planning",
  description: "Build treatment plans that are individualized, measurable, and audit-ready. Connect goals to interventions with confidence.",
  instructor: "Rindie Eagle, MA, LPCC & Renee Devine, MS, LMHC",
  level: "Beginner",
  icon: ClipboardList,
  duration: "1.5 Hours",
  enrollmentLink: "https://tp.therapistresources.com"
}, {
  title: "Write it Right: Diagnostic Assessment",
  description: "Conduct and document thorough diagnostic assessments. From clinical interviews to differential diagnosis and written formulation.",
  instructor: "Rindie Eagle, MA, LPCC & Renee Devine, MS, LMHC",
  level: "Beginner",
  icon: FileSearch,
  duration: "2 Hours",
  enrollmentLink: "https://da.therapistresources.com"
}, {
  title: "Write it Right: Discharge & Treatment Summary",
  description: "Close cases with well-documented discharge and treatment summaries that communicate outcomes and support continuity of care.",
  instructor: "Rindie Eagle, MA, LPCC & Renee Devine, MS, LMHC",
  level: "Beginner",
  icon: FileText,
  duration: "1.5 Hours",
  enrollmentLink: "https://discharge.therapistresources.com"
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

const cardVariants = [
  {
    cover: 'from-[#E9E1FF] to-[#DCEEFB] dark:from-white/15 dark:to-cyan-300/20',
    glyph: 'from-[#1B5A7E] to-[#0E7490]',
    badge: 'border-[#BFDDE9] bg-white text-[#155E75] dark:border-sky-300/50 dark:bg-sky-300/30 dark:text-white',
    accent: 'border-[#F9C8D9] bg-[#FDEEF4] text-[#BE185D] dark:border-pink-300/55 dark:bg-pink-300/30 dark:text-white'
  },
  {
    cover: 'from-[#D7F0F4] to-[#DDF3EC] dark:from-cyan-500/30 dark:to-teal-500/30',
    glyph: 'from-[#0E7490] to-[#0D9488]',
    badge: 'border-[#B6E1DA] bg-white text-[#0F766E] dark:border-cyan-400/40 dark:bg-cyan-500/30 dark:text-cyan-300',
    accent: 'border-[#BFDDE9] bg-white text-[#155E75] dark:border-sky-300/50 dark:bg-sky-300/30 dark:text-white'
  }
];

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
      <div className="container mx-auto max-w-6xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const variant = cardVariants[index % cardVariants.length];
            return <motion.div key={index} variants={itemVariants} whileHover={{
            scale: 1.02,
            y: -5
          }} className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-border bg-card shadow-[0_12px_28px_-12px_rgba(14,116,144,0.18)] transition-all duration-300 hover:shadow-cyan-500/20 dark:bg-white/5 dark:border-white/10 dark:shadow-2xl">
            <div className={`relative aspect-video bg-gradient-to-br ${variant.cover} flex items-center justify-center`}>
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${variant.badge} dark:backdrop-blur-sm`}>
                  {course.level}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${variant.accent} dark:backdrop-blur-sm`}>
                  <Clock className="h-3 w-3" />
                  {course.duration}
                </span>
              </div>

              <div className={`flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br ${variant.glyph} text-white shadow-[0_8px_20px_-6px_rgba(14,116,144,0.35)] transition-transform duration-300 group-hover:scale-110 dark:border dark:border-white/30 dark:bg-white/20 dark:bg-none dark:backdrop-blur-md`}>
                <course.icon className="h-7 w-7" />
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
              <div className="mb-2 bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-xs font-bold uppercase tracking-[0.06em] text-transparent dark:from-cyan-300 dark:to-sky-200">
                Instructor: {course.instructor}
              </div>
              <h3 className="text-xl font-bold leading-snug text-foreground mb-2">{course.title}</h3>
              <p className="text-foreground/80 text-sm leading-relaxed mb-5">{course.description}</p>

              <div className="mt-auto space-y-4">
                <Button
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-sky-600 py-5 text-sm font-bold text-primary-foreground border-0 shadow-lg shadow-cyan-900/20 transition-all duration-300 hover:from-primary/90 hover:to-sky-500 hover:shadow-cyan-500/40"
                  onClick={() => handleEnrollClick(course.enrollmentLink)}
                >
                  {course.cta || "Enroll Now"}
                </Button>
                <div className="flex items-center gap-2 border-t border-border pt-3 text-sm font-medium text-foreground/70 dark:border-white/10 dark:text-white/75">
                  <GraduationCap className="h-4 w-4 text-primary dark:text-cyan-300" />
                  {course.duration}
                </div>
              </div>
            </div>
          </motion.div>;
          })}
        </motion.div>
      </div>
    </div>
  </>;
};
export default CoursesPage;
