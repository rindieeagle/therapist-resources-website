
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import ResourcesPage from '@/pages/ResourcesPage';
import CoursesPage from '@/pages/CoursesPage';
import WebAppsPage from '@/pages/WebAppsPage';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>Therapist Resources - Rindie Eagle (MA, LPCC)</title>
        <meta name="description" content="Professional therapy resources, courses, and digital products designed by Rindie Eagle. From session-ready materials to clinical tools, everything you need with no prep time required." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
        {/* Animated gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-teal-500/10 animate-gradient pointer-events-none"></div>
        
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/web-apps" element={<WebAppsPage />} />
          </Routes>
        </main>
        
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;
