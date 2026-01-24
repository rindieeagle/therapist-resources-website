
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Courses', path: '/courses' },
    { name: 'Web Apps', path: '/web-apps' },
    { name: 'Shop', path: 'https://www.skill.encouragementink.com' },
    { name: 'Contact', path: '#contact' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/10"
      style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <img 
                src="https://horizons-cdn.hostinger.com/3a008976-8773-4a6b-b312-6bad53146b92/3ced519d4edbaa36f541863fa979a0d2.png"
                alt="Therapist Resources Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-playfair">
                Therapist Resources
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isHash = item.path.startsWith('#');
              const isExternal = item.path.startsWith('http');
              
              if (isExternal) {
                return (
                  <motion.a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white/90 hover:text-cyan-300 transition-colors duration-300 font-medium"
                  >
                    {item.name}
                  </motion.a>
                );
              }

              return isHash ? (
                <motion.a
                  key={item.name}
                  href={item.path}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white/90 hover:text-cyan-300 transition-colors duration-300 font-medium"
                >
                  {item.name}
                </motion.a>
              ) : (
                <Link key={item.name} to={item.path}>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`transition-colors duration-300 font-medium ${
                      location.pathname === item.path ? 'text-cyan-300' : 'text-white/90 hover:text-cyan-300'
                    }`}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/10"
            >
              {navItems.map((item) => {
                const isHash = item.path.startsWith('#');
                const isExternal = item.path.startsWith('http');

                if (isExternal) {
                  return (
                    <motion.a
                      key={item.name}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileTap={{ scale: 0.95 }}
                      className="block py-3 text-white/90 hover:text-cyan-300 transition-colors duration-300 font-medium"
                    >
                      {item.name}
                    </motion.a>
                  );
                }

                return isHash ? (
                  <motion.a
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    className="block py-3 text-white/90 hover:text-cyan-300 transition-colors duration-300 font-medium"
                  >
                    {item.name}
                  </motion.a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={`block py-3 transition-colors duration-300 font-medium ${
                        location.pathname === item.path ? 'text-cyan-300' : 'text-white/90 hover:text-cyan-300'
                      }`}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
