'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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
  { href: '/pcos-pcod', label: 'PCOS/PCOD', icon: HeartPulse },
  { href: '/assistant', label: 'Ask Tiara', icon: MessageCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} onClick={handleLinkClick}>
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
