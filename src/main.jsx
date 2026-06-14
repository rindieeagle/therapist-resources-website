
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from '@/App';
import { ThemeProvider } from '@/lib/theme';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
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
