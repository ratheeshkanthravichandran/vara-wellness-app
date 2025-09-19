'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarPlus, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CyclePhaseInfo } from '../dashboard/components/cycle-phase-info';
import { DailyAffirmation } from '../dashboard/components/daily-affirmation';

function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/calendar">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Log Today's Data
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/suggestions">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Get Suggestions
                    </Link>
                </Button>
                 <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/assistant">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Ask Tiara
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}


export function RightSidebar() {
  return (
    <aside className="w-1/4 max-w-[350px] p-6 hidden lg:block">
        <div className="sticky top-[75px] space-y-6">
            <CyclePhaseInfo />
            <DailyAffirmation />
            <QuickActions />
        </div>
    </aside>
  );
}
