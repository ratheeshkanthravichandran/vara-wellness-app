'use client';
import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';

export function Logo() {
  let state: 'expanded' | 'collapsed' = 'expanded';
  try {
    const { state: sidebarState } = useSidebar();
    state = sidebarState;
  } catch (error) {
    // SidebarProvider is not in the tree, so we can't use the hook.
    // We'll just default to the expanded state.
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary"
      >
        <path d="M12 2a10 10 0 0 0-10 10c0 3.31 1.68 6.26 4.2 8.05" />
        <path d="M12 22a10 10 0 0 0 10-10c0-3.31-1.68-6.26-4.2-8.05" />
        <path d="M12 12a5 5 0 0 0-5 5c0 1.66 1.34 3 3 3s3-1.34 3-3a5 5 0 0 0-5-5" />
        <path d="M12 12a5 5 0 0 1 5-5c0-1.66-1.34-3-3-3s-3 1.34-3 3a5 5 0 0 1 5-5" />
      </svg>
      {state === 'expanded' && (
        <h1 className="text-xl font-bold font-headline text-foreground">
          Vara
        </h1>
      )}
    </div>
  );
}
