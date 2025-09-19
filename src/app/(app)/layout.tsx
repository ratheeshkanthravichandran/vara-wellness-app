import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';
import { RightSidebar } from './components/right-sidebar';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar variant="floating" collapsible="icon" className="w-1/4 max-w-[280px] hidden md:flex">
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
            <SidebarFooter>
              <UserNav />
            </SidebarFooter>
        </Sidebar>

        <div className="flex-1 w-full flex flex-col items-center">
            <div className="flex-1 w-full max-w-[600px] border-x pb-20 md:pb-0">
              {children}
            </div>
            <BottomNavBar />
        </div>
        
        <RightSidebar />
      </div>
    </SidebarProvider>
  );
}
