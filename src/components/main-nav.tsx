'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CalendarDays,
  HeartPulse,
  Leaf,
  Sparkles,
  BrainCircuit,
  MessageCircle,
  Settings,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/health-monitor', label: 'Health Monitor', icon: HeartPulse },
  { href: '/wellness', label: 'Wellness', icon: BrainCircuit },
  { href: '/diet', label: 'Diet', icon: Leaf },
  { href: '/suggestions', label: 'Suggestions', icon: Sparkles },
  { href: '/assistant', label: 'Ask Tiara', icon: MessageCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <item.icon />
              <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
