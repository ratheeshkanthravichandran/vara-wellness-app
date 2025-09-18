'use client';
import { useEffect, useState } from 'react';
import { BarChart, LineChart } from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { getLogs, type LogData } from '@/app/(app)/calendar/page';
import { format, startOfWeek, eachDayOfInterval, parseISO, subDays } from 'date-fns';

const chartConfig = {
  mood: {
    label: 'Mood',
    color: 'hsl(var(--primary))',
  },
  energy: {
    label: 'Energy',
    color: 'hsl(var(--accent-foreground))',
  },
};

export default function HealthMonitorPage() {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [energyData, setEnergyData] = useState<any[]>([]);

  useEffect(() => {
    const logs = getLogs();
    const today = new Date();
    // Get the last 7 days including today
    const weekDays = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    const formattedMoodData = weekDays.map((day) => {
      const dayKey = format(day, 'yyyy-MM-dd');
      const log: LogData | undefined = logs[dayKey];
      return {
        date: format(day, 'EEE'), // Mon, Tue, etc.
        mood: log ? log.mood : null,
      };
    });

    const formattedEnergyData = weekDays.map((day) => {
      const dayKey = format(day, 'yyyy-MM-dd');
      const log: LogData | undefined = logs[dayKey];
      return {
        date: format(day, 'EEE'),
        energy: log ? log.energy : null,
      };
    });

    setMoodData(formattedMoodData);
    setEnergyData(formattedEnergyData);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Health Monitor
        </h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card className="relative overflow-hidden">
          <Image
            src="https://picsum.photos/seed/healthhero/1200/400"
            alt="Woman checking smartwatch"
            width={1200}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint="smartwatch health"
          />
          <div className="absolute inset-0 bg-black/30" />
          <CardHeader className="relative text-primary-foreground">
            <CardTitle className="text-3xl font-headline">
              Your Weekly Summary
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              An overview of your mood and energy levels.
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" /> Mood Tracker (1-5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <RechartsLineChart data={moodData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                  <Line
                    dataKey="mood"
                    type="monotone"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    connectNulls
                  />
                </RechartsLineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" /> Energy Levels (1-10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <RechartsBarChart data={energyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 10]} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Bar
                    dataKey="energy"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
