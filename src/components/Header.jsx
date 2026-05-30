
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/lib/theme';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    // { name: 'Resources', path: '/resources' }, // Hidden for now
    { name: 'Courses', path: '/courses' },
    { name: 'Web Apps', path: '/web-apps' },
    { name: 'Blog', path: '/blog' },
    { name: 'Shop', path: 'https://reagleeagle.gumroad.com/?section=SoACiIzAf7Uk2VwpGfH5Xg%3D%3D' },
    { name: 'Contact', path: 'https://rindieme.formaloo.me/contact' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass border-b border-border"
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
                src={theme === 'dark' ? '/tr-rectangle-logo-on-blue.png' : '/tr-rectangle-logo-on-white.png'}
                alt="Therapist Resources Logo"
                className="h-8 sm:h-10 w-auto"
              />
              <span className="hidden sm:inline text-lg sm:text-xl font-bold tr-grad-text">
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
                    className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
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
                  className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
                >
                  {item.name}
                </motion.a>
              ) : (
                <Link key={item.name} to={item.path}>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`transition-colors duration-300 font-medium ${location.pathname === item.path ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                      }`}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          <ThemeToggle className="hidden md:inline-flex text-foreground hover:bg-accent" />

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle className="text-foreground hover:bg-accent" />
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 glass rounded-3xl p-4 border border-border"
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
                      className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
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
                    className="block py-3 text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
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
                      className={`block py-3 transition-colors duration-300 font-medium ${location.pathname === item.path ? 'text-primary' : 'text-foreground/80 hover:text-primary'
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
