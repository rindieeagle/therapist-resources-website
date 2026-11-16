import React from 'react';
import { BadgeCheck, BookOpen } from 'lucide-react';
import { NBCC_CREDIT_HOURS } from '@/lib/nbcc';

const CreditBadge = ({ courseLink, onDark = false }) => {
  const hours = NBCC_CREDIT_HOURS[courseLink];
  const Icon = hours ? BadgeCheck : BookOpen;
  const colors = hours
    ? onDark
      ? 'border-teal-200/40 bg-white/10 text-teal-100'
      : 'border-teal-700/25 bg-teal-50 text-teal-800 dark:border-teal-300/40 dark:bg-teal-300/10 dark:text-teal-200'
    : 'border-border bg-muted/50 text-foreground/80';

  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${colors}`}>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{hours ? `${hours} NBCC credit ${hours === 1 ? 'hour' : 'hours'}` : 'No NBCC credit'}</span>
    </span>
  );
};

export default CreditBadge;
