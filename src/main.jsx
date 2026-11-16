
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from '@/App';
import { ThemeProvider } from '@/lib/theme';
import '@/index.css';

const app = (
  <>
    <BrowserRouter>
      <ThemeProvider>
        {/* Honor prefers-reduced-motion: disables transform/positional reveals, keeps crossfades. */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </ThemeProvider>
    </BrowserRouter>
  </>
);

const root = document.getElementById('root');
const pathname = window.location.pathname.replace(/\/$/, '') || '/';
if (root.dataset.prerenderRoute === pathname) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
