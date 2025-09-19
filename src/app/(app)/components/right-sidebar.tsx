'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCycleStore } from '@/store/cycle-data-store';
import { differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { Sparkles, Info } from 'lucide-react';

function getCycleDay(cycleData: ReturnType<typeof useCycleStore>['cycleData']): number {
    if (!cycleData || cycleData.periods.length === 0) {
      return 1;
    }
    const lastPeriodStart = new Date(cycleData.periods[cycleData.periods.length - 1].from);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const diffDays = differenceInDays(today, lastPeriodStart);
  
    if (diffDays < 0) {
        return 1;
    }
    
    const cycleDay = (diffDays % cycleData.cycleLength) + 1;
    return cycleDay;
}

function getCyclePhase(day: number, periodLength: number): { name: string, description: string } {
    if (day <= periodLength) return { name: 'Menstrual Phase', description: 'Your body is shedding its uterine lining. It\'s a time for rest and gentle care.' };
    if (day <= 13) return { name: 'Follicular Phase', description: 'Estrogen is rising, and your energy may be increasing. A great time for new beginnings.' };
    if (day <= 16) return { name: 'Ovulation Phase', description: 'Peak fertility. You might feel more social and energetic. Your body is ready to release an egg.' };
    return { name: 'Luteal Phase', description: 'Progesterone rises. You might feel more inward and notice PMS symptoms as your body prepares for the next cycle.' };
}

const affirmations = [
    "I am in tune with my body's needs.",
    "I honor the cycles of rest and activity in my life.",
    "I am resilient, and I embrace my flow.",
    "I listen to my body with kindness and compassion.",
    "My body is wise, and I trust its signals.",
    "I am worthy of rest and self-care.",
    "I release what no longer serves me.",
    "I am creating a life filled with balance and peace."
];

function CyclePhaseInfo() {
    const { cycleData, isInitialized } = useCycleStore();
    
    if (!isInitialized || !cycleData) return null;

    const cycleDay = getCycleDay(cycleData);
    const phase = getCyclePhase(cycleDay, cycleData.periodLength);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Info className="w-5 h-5" />
                    <span>Current Phase: {phase.name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{phase.description}</p>
            </CardContent>
        </Card>
    );
}

function DailyAffirmation() {
    const [affirmation, setAffirmation] = useState('');

    useEffect(() => {
        // Get a new affirmation based on the day of the year
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24);
        setAffirmation(affirmations[dayOfYear % affirmations.length]);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="w-5 h-5" />
                    <span>Daily Affirmation</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground italic">"{affirmation}"</p>
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
        </div>
    </aside>
  );
}
