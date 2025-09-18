'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  HeartPulse,
  Leaf,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/health-monitor', label: 'Monitor', icon: HeartPulse },
  { href: '/assistant', label: 'Ask Tiara', icon: MessageCircle },
  { href: '/diet', label: 'Diet', icon: Leaf },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground w-full h-full">
              <item.icon
                className={cn(
                  'w-6 h-6',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span className={cn(isActive && 'text-primary')}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
