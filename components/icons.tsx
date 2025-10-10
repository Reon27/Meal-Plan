
import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
} as const;


export const UserIcon = () => (
  <svg {...iconProps}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export const FridgeIcon = () => (
  <svg {...iconProps}><path d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zM3 11h18M9 5v14"></path></svg>
);

export const SparklesIcon = () => (
  <svg {...iconProps}><path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3L12 2z"></path><path d="M20 22l-3-3"></path><path d="M6 8l-3-3"></path></svg>
);

export const BookOpenIcon = () => (
  <svg {...iconProps}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);

export const ChevronLeftIcon = () => (
    <svg {...iconProps}><path d="m15 18-6-6 6-6"></path></svg>
);

export const PlusIcon = () => (
    <svg {...iconProps} className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const TrashIcon = ({ className = "w-5 h-5" }) => (
    <svg {...iconProps} className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export const ClockIcon = () => (
    <svg className="w-4 h-4 mr-1 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export const FireIcon = () => (
    <svg className="w-4 h-4 mr-1 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.42 21.93a2.08 2.08 0 0 0 2.16 0A12.07 12.07 0 0 0 22 12.5c0-5-4-9.5-6-9.5-2 0-3.23 2.78-3.72 4.2-.42 1.2-1.94 1.2-2.36 0C9.23 5.78 8 3 6 3c-2 0-6 4.5-6 9.5a12.07 12.07 0 0 0 8.42 9.43Z"></path></svg>
);
