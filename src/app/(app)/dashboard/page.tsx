'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Droplet, Zap, Heart, Brain, CalendarPlus } from 'lucide-react';
import { TodaySuggestions } from './components/today-suggestions';
import { PeriodHistory } from './components/period-history';
import { useCycleStore } from '@/store/cycle-data-store';
import { useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { CyclePhaseInfo } from './components/cycle-phase-info';
import { DailyAffirmation } from './components/daily-affirmation';

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
  
function getCyclePhase(day: number, periodLength: number) {
    if (day <= periodLength) return 'Menstrual Phase';
    if (day <= 13) return 'Follicular Phase';
    if (day <= 16) return 'Ovulation Phase';
    return 'Luteal Phase';
}

function getEnergyLabel(level: number | undefined){
    if (!level || level === 0) return 'Not Logged';
    if (level <= 3) return 'Low';
    if (level <= 7) return 'Medium';
    return 'High';
}

function getMoodLabel(level: number | undefined){
    if (!level || level === 0) return 'Not Logged';
    if (level <= 2) return 'Sensitive';
    if (level <= 4) return 'Stable';
    return 'Happy';
}

export default function DashboardPage() {
  const { logs, cycleData, isInitialized, initialize } = useCycleStore();
  
  useEffect(() => {
      if (!isInitialized) {
        initialize();
      }
  }, [isInitialized, initialize]);

  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const log = logs[todayKey] || null;

  const cycleDay = getCycleDay(cycleData);
  const cyclePhase = getCyclePhase(cycleDay, cycleData.periodLength);

  const energyValue = log?.energy ? `${getEnergyLabel(log.energy)} (${log.energy}/10)`: "Not Logged";
  const moodValue = log?.mood ? `${getMoodLabel(log.mood)} (${log.mood}/5)` : "Not Logged";
  const symptoms = log?.symptoms && log.symptoms.length > 0 ? log.symptoms.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') : "None";

  if (!isInitialized) {
      return (
          <div className="flex flex-1 flex-col items-center justify-center">
              <p>Loading your dashboard...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="hidden lg:block">
              <Logo />
            </div>
            <div className="lg:hidden">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
            </div>
        </div>
        <Link href="/calendar">
          <Button variant="outline">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Log Today's Data
          </Button>
        </Link>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Cycle Day</CardTitle>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Droplet className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Day {cycleDay}</div>
              <p className="text-xs text-muted-foreground">{cyclePhase}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>
                Energy Level
              </CardTitle>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{energyValue}</div>
              <p className="text-xs text-muted-foreground">
                Listen to your body
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Mood</CardTitle>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Heart className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moodValue}</div>
              <p className="text-xs text-muted-foreground">
                Be kind to yourself
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Symptoms</CardTitle>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Brain className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold capitalize">{symptoms}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {symptoms === 'None' ? 'No symptoms logged today' : 'Based on your logs'}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:hidden space-y-4">
          <CyclePhaseInfo />
          <DailyAffirmation />
        </div>
        <TodaySuggestions log={log} cyclePhase={cyclePhase} />
        <PeriodHistory />
      </main>
    </div>
  );
}
