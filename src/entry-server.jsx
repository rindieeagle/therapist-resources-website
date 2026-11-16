import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MotionConfig } from 'framer-motion';
import App from '@/App';
import { ThemeProvider } from '@/lib/theme';

export function render(pathname) {
  const html = renderToString(
    <StaticRouter location={pathname}>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </ThemeProvider>
    </StaticRouter>
  );
  return { html, head: Helmet.renderStatic() };
}
