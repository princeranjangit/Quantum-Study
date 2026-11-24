import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} shrink-0`}
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="9" className="fill-[#0F172A] dark:fill-violet-600" />
        <path
          d="M18 8.5L26.5 13.5V22.5L18 27.5L9.5 22.5V13.5L18 8.5Z"
          stroke="white"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M18 13.5V27.5M18 13.5L26.5 13.5M18 13.5L9.5 13.5"
          stroke="#A78BFA"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="18" cy="13.5" r="2.2" fill="white" />
      </svg>
      <span
        className={`font-display font-bold tracking-tight text-slate-900 dark:text-white ${textSize}`}
      >
        Quantum Study
      </span>
    </span>
  );
}
