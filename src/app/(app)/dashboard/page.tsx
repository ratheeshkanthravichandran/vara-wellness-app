'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Droplet, Zap, Heart, Brain, CalendarPlus, Hand } from 'lucide-react';
import { useCycleStore } from '@/store/cycle-data-store';
import { useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const TodaySuggestions = dynamic(
  () => import('./components/today-suggestions').then((mod) => mod.TodaySuggestions),
  { 
    loading: () => (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Today's Suggestions
          </h2>
          <Button variant="outline">View More</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Personalized Activity Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardContent>
        </Card>
      </div>
    ),
    ssr: false 
  }
);

const PeriodHistory = dynamic(
  () => import('./components/period-history').then((mod) => mod.PeriodHistory),
  { 
    loading: () => (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Period History
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Your Logged Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    ),
    ssr: false
  }
);

const CyclePhaseInfo = dynamic(
  () => import('./components/cycle-phase-info').then((mod) => mod.CyclePhaseInfo),
  { ssr: false }
);

const DailyAffirmation = dynamic(
  () => import('./components/daily-affirmation').then((mod) => mod.DailyAffirmation),
  { ssr: false }
);


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

  if (!isInitialized) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center">
            <p>Loading your dashboard...</p>
        </div>
    );
  }

  const isNewUser = cycleData.periods.length === 0;

  if (isNewUser) {
    return (
        <div className="flex flex-1 flex-col">
            <header className="flex h-14 lg:h-[60px] items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="lg:hidden" />
                    <div className="hidden lg:block">
                        <Logo />
                    </div>
                     <div className="lg:hidden">
                        <h1 className="text-lg font-semibold md:text-2xl font-headline">Welcome!</h1>
                    </div>
                </div>
            </header>
            <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
                            <Hand className="h-8 w-8 text-primary" />
                            Welcome to Vara!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                           It looks like you're new here. To get personalized insights, please log your first period.
                        </p>
                         <Link href="/calendar">
                            <Button size="lg">
                                <CalendarPlus className="mr-2 h-5 w-5" />
                                Log Your Period
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
  }

  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const log = logs[todayKey] || null;

  const cycleDay = getCycleDay(cycleData);
  const cyclePhase = getCyclePhase(cycleDay, cycleData.periodLength);

  const energyValue = log?.energy ? `${getEnergyLabel(log.energy)} (${log.energy}/10)`: "Not Logged";
  const moodValue = log?.mood ? `${getMoodLabel(log.mood)} (${log.mood}/5)` : "Not Logged";
  const symptoms = log?.symptoms && log.symptoms.length > 0 ? log.symptoms.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') : "None";

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
