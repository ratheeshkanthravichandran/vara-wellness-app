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
  type LucideIcon,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const mainNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/health-monitor', label: 'Health Monitor', icon: HeartPulse },
];

const featuresNavItems: NavItem[] = [
    { href: '/wellness', label: 'Wellness', icon: BrainCircuit },
    { href: '/diet', label: 'Diet', icon: Leaf },
    { href: '/suggestions', label: 'Suggestions', icon: Sparkles },
    { href: '/pcos-pcod', label: 'PCOS/PCOD', icon: HeartPulse },
];

const assistantNavItems: NavItem[] = [
    { href: '/assistant', label: 'Ask Tiara', icon: MessageCircle },
];

const settingsNavItems: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: Settings },
];


function NavSection({ items }: { items: NavItem[] }) {
    const pathname = usePathname();
    const { setOpenMobile, isMobile } = useSidebar();
  
    const handleLinkClick = () => {
      if (isMobile) {
        setOpenMobile(false);
      }
    };
  
    return (
      <>
        {items.map((item) => (
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
      </>
    );
}

export function MainNav() {
  return (
    <SidebarMenu>
        <NavSection items={mainNavItems} />
        <NavSection items={featuresNavItems} />
        <NavSection items={assistantNavItems} />
        <NavSection items={settingsNavItems} />
    </SidebarMenu>
  );
}
