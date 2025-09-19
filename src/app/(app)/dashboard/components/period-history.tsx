'use client';
import { useCycleStore } from '@/store/cycle-data-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, differenceInDays } from 'date-fns';
import { CalendarClock } from 'lucide-react';

export function PeriodHistory() {
  const { cycleData, isInitialized } = useCycleStore();

  if (!isInitialized) {
    return null;
  }
  
  const sortedPeriods = [...cycleData.periods].sort((a, b) => new Date(b.from).getTime() - new Date(a.from).getTime());

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight font-headline">
        Period History
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="text-primary" />
            <span>Your Logged Cycles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedPeriods.length === 0 ? (
            <p className="text-muted-foreground">
              No period history found. Log your period in the calendar to start
              tracking.
            </p>
          ) : (
            <ScrollArea className="h-60">
              <div className="space-y-4 pr-4">
                {sortedPeriods.map((period, index) => {
                  const fromDate = new Date(period.from);
                  const toDate = new Date(period.to);
                  const duration = differenceInDays(toDate, fromDate) + 1;
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-md bg-muted/50"
                    >
                      <div>
                        <p className="font-semibold">
                          {format(fromDate, 'MMMM d, yyyy')} -{' '}
                          {format(toDate, 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{duration} days</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
