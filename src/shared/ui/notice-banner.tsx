'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function NoticeBanner({ 
  active, 
  text 
}: { 
  active?: boolean; 
  text?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Basic check to see if it was dismissed this session
    const dismissed = sessionStorage.getItem('notice_dismissed');
    if (active && text && !dismissed && !pathname?.startsWith('/admin')) {
      setIsVisible(true);
    }
  }, [active, text, pathname]);

  if (!isVisible || !text || pathname?.startsWith('/admin')) return null;

  return (
    <div className="relative z-[100] bg-primary-600 text-white shadow-lg animate-in fade-in slide-in-from-top-full duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 animate-pulse text-primary-200" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm md:text-base font-bold text-center">
            {text}
          </p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            sessionStorage.setItem('notice_dismissed', 'true');
          }}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Sluiten"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
