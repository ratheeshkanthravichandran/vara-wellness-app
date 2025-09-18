'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Droplet, Zap, Heart, Brain } from 'lucide-react';
import { TodaySuggestions } from './components/today-suggestions';
import { getLogs, getCycleData, type LogData } from '@/app/(app)/calendar/page';
import { useState, useEffect } from 'react';
import { format, differenceInDays, addDays } from 'date-fns';

function getCycleDay(cycleData: any) {
  if (!cycleData || cycleData.periods.length === 0) {
    return 1;
  }
  const lastPeriodStart = new Date(cycleData.periods[cycleData.periods.length - 1].from);
  const today = new Date();
  const diffDays = differenceInDays(today, lastPeriodStart);
  return (diffDays % cycleData.cycleLength) + 1;
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
  const [log, setLog] = useState<LogData | null>(null);
  const [cycleDay, setCycleDay] = useState(0);
  const [cyclePhase, setCyclePhase] = useState('');

  useEffect(() => {
    const logs = getLogs();
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    const todayLog = logs[todayKey];
    setLog(todayLog);

    const cycleData = getCycleData();
    const day = getCycleDay(cycleData);
    setCycleDay(day);
    setCyclePhase(getCyclePhase(day, cycleData.periodLength));

  }, []);

  const energyValue = log?.energy ? `${getEnergyLabel(log.energy)} (${log.energy}/10)`: "Not Logged";
  const moodValue = log?.mood ? `${getMoodLabel(log.mood)} (${log.mood}/5)` : "Not Logged";
  const symptoms = log?.symptoms && log.symptoms.length > 0 ? log.symptoms.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') : "None";


  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Dashboard
        </h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cycle Day</CardTitle>
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
              <CardTitle className="text-sm font-medium">
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
              <CardTitle className="text-sm font-medium">Mood</CardTitle>
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
              <CardTitle className="text-sm font-medium">Symptoms</CardTitle>
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
        {log && <TodaySuggestions log={log} cyclePhase={cyclePhase} />}
      </main>
    </div>
  );
}

    