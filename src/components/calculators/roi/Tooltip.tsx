"use client";
import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      if (triggerRect.top - tooltipHeight - 8 < 0) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [isVisible]);

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <svg className="w-3.5 h-3.5 ml-1 text-text-dim cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {isVisible && (
        /* The popover is a small readout: navy deep in both themes, so the
           semantic text classes in its content resolve to the dark values */
        <div
          ref={tooltipRef}
          className={`readout absolute z-50 w-64 p-3 text-xs rounded-lg shadow-lg border border-border text-text-body ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0`}
        >
          {content}
          <div className={`absolute w-2 h-2 rotate-45 bg-surface-readout border-border ${position === 'top' ? 'bottom-[-5px] border-b border-r' : 'top-[-5px] border-t border-l'} left-4`} />
        </div>
      )}
    </span>
  );
}
