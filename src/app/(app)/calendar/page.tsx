'use client';

import React, { useState } from 'react';
import { addDays, format, eachDayOfInterval, differenceInDays, startOfDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Brain, PlusCircle, Droplet, Calendar as CalendarIcon, Heart, Zap, Repeat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// --- Data Management ---

const SYMPTOMS_LIST = [
    { id: 'cramps', label: 'Cramps' },
    { id: 'headache', label: 'Headache' },
    { id: 'mood-swings', label: 'Mood Swings' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'bloating', label: 'Bloating' },
    { id: 'acne', label: 'Acne' },
];

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;


export type LogData = {
    flow: 'none' | 'light' | 'medium' | 'heavy';
    symptoms: string[];
    mood: number; // Scale 1-5
    energy: number; // Scale 1-10
};

export type CycleData = {
    periods: { from: string; to: string }[];
    cycleLength: number;
    periodLength: number;
};

export function getLogs(): Record<string, LogData> {
  if (typeof window === 'undefined') return {};
  const savedLogs = window.localStorage.getItem('vara-cycle-logs');
  return savedLogs ? JSON.parse(savedLogs) : {};
}

export function saveLogs(logs: Record<string, LogData>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('vara-cycle-logs', JSON.stringify(logs));
}

export function getCycleData(): CycleData {
    if (typeof window === 'undefined') {
        const today = new Date();
        const defaultStart = addDays(today, -10);
        const defaultEnd = addDays(defaultStart, DEFAULT_PERIOD_LENGTH - 1);
        return {
            periods: [{ from: format(defaultStart, 'yyyy-MM-dd'), to: format(defaultEnd, 'yyyy-MM-dd') }],
            cycleLength: DEFAULT_CYCLE_LENGTH,
            periodLength: DEFAULT_PERIOD_LENGTH,
        };
    }

    const savedData = window.localStorage.getItem('vara-cycle-data');
    if (savedData) {
        return JSON.parse(savedData);
    }
    // Create default data if none exists
    const today = new Date();
    const defaultStart = addDays(today, -10);
    const defaultEnd = addDays(defaultStart, DEFAULT_PERIOD_LENGTH - 1);
    const defaultCycleData = {
        periods: [{ from: format(defaultStart, 'yyyy-MM-dd'), to: format(defaultEnd, 'yyyy-MM-dd') }],
        cycleLength: DEFAULT_CYCLE_LENGTH,
        periodLength: DEFAULT_PERIOD_LENGTH,
    };
    window.localStorage.setItem('vara-cycle-data', JSON.stringify(defaultCycleData));
    return defaultCycleData;
}

export function saveCycleData(data: CycleData) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('vara-cycle-data', JSON.stringify(data));
}

// --- Main Component ---

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [isLogOpen, setIsLogOpen] = useState(false);

  const [logs, setLogs] = useState<Record<string, LogData>>(() => getLogs());
  const [cycleData, setCycleData] = useState<CycleData>(() => getCycleData());
  
  const [selectedFlow, setSelectedFlow] = useState<'none' | 'light' | 'medium' | 'heavy'>('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<number>(0);
  const [selectedEnergy, setSelectedEnergy] = useState<number>(0);

  // --- Modifiers for Calendar Highlighting ---
  const periodDays = cycleData.periods.flatMap(p => 
    eachDayOfInterval({ start: new Date(p.from), end: new Date(p.to) })
  );

  const lastPeriodStart = cycleData.periods.length > 0
    ? new Date(cycleData.periods[cycleData.periods.length - 1].from)
    : new Date();

  const predictedPeriodStart = addDays(lastPeriodStart, cycleData.cycleLength);
  const predictedPeriod = eachDayOfInterval({
      start: predictedPeriodStart,
      end: addDays(predictedPeriodStart, cycleData.periodLength - 1),
  });

  const ovulationDay = addDays(predictedPeriodStart, -14);
  const fertileWindow = eachDayOfInterval({
      start: addDays(ovulationDay, -5),
      end: ovulationDay,
  });

  const modifiers = {
    period: periodDays,
    predicted: predictedPeriod,
    fertile: fertileWindow,
  };

  const modifiersClassNames = {
    period: 'period',
    predicted: 'predicted',
    fertile: 'fertile',
  };

  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const currentLog = logs[selectedDateKey] || { flow: 'none', symptoms: [], mood: 0, energy: 0 };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleOpenLog = (date: Date) => {
    setSelectedDate(date);
    const logKey = format(date, 'yyyy-MM-dd');
    const log = logs[logKey] || { flow: 'none', symptoms: [], mood: 0, energy: 0 };
    setSelectedFlow(log.flow);
    setSelectedSymptoms(log.symptoms);
    setSelectedMood(log.mood);
    setSelectedEnergy(log.energy);
    setIsLogOpen(true);
  };

  const handleSaveLog = () => {
    if (selectedDateKey) {
      const updatedLogs = {
        ...logs,
        [selectedDateKey]: {
          flow: selectedFlow,
          symptoms: selectedSymptoms,
          mood: selectedMood,
          energy: selectedEnergy,
        },
      };
      setLogs(updatedLogs);
      saveLogs(updatedLogs);
    }
    setIsLogOpen(false);
  };

  const handleLogPeriod = () => {
    if (selectedRange?.from && selectedRange?.to) {
        const newPeriod = {
            from: format(startOfDay(selectedRange.from), 'yyyy-MM-dd'),
            to: format(startOfDay(selectedRange.to), 'yyyy-MM-dd'),
        };

        // Basic logic to update cycle and period length based on last two cycles
        let newCycleLength = cycleData.cycleLength;
        let newPeriodLength = cycleData.periodLength;

        if (cycleData.periods.length > 0) {
            const lastPeriod = cycleData.periods[cycleData.periods.length - 1];
            const lastCycleLength = differenceInDays(new Date(newPeriod.from), new Date(lastPeriod.from));
            if (lastCycleLength > 10 && lastCycleLength < 60) {
                newCycleLength = Math.round((cycleData.cycleLength + lastCycleLength) / 2);
            }
        }
        
        const currentPeriodLength = differenceInDays(new Date(newPeriod.to), new Date(newPeriod.from)) + 1;
        if(currentPeriodLength > 0 && currentPeriodLength < 15) {
            newPeriodLength = Math.round((cycleData.periodLength + currentPeriodLength) / 2);
        }

        const updatedCycleData: CycleData = {
            periods: [...cycleData.periods, newPeriod].sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()),
            cycleLength: newCycleLength,
            periodLength: newPeriodLength,
        };
        
        setCycleData(updatedCycleData);
        saveCycleData(updatedCycleData);
        setSelectedRange(undefined);
    }
  };


  return (
    <div className="flex flex-1 flex-col">
       <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Cycle Calendar
        </h1>
      </header>
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:grid lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-2 flex flex-col items-center">
               <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={setSelectedRange}
                defaultMonth={selectedDate}
                onDayClick={handleDayClick}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
               <div className="w-full p-4 pt-0 space-y-2 text-center">
                {!selectedRange?.from && (
                  <p className="text-sm text-muted-foreground">To log your period, please select the start and end dates on the calendar above.</p>
                )}
                {selectedRange?.from && (
                  <Button onClick={handleLogPeriod} className="w-full" size="lg">
                    <Repeat className="w-4 h-4 mr-2" /> Log Period Dates
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary/80"></div>
                    <span>Period</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md border-2 border-dashed border-primary/50"></div>
                    <span>Predicted Period</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-accent/80"></div>
                    <span>Fertile Window</span>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{format(selectedDate || new Date(), 'MMMM d, yyyy')}</span>
                         <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenLog(selectedDate || new Date())}>
                                    <PlusCircle className="w-5 h-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Log for {format(selectedDate || new Date(), 'MMMM d, yyyy')}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                     <div className="space-y-2">
                                        <Label>Flow Intensity</Label>
                                        <RadioGroup value={selectedFlow} onValueChange={(val) => setSelectedFlow(val as any)} className="flex flex-wrap gap-4">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="f-none" /><Label htmlFor="f-none">None</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="light" id="f-light" /><Label htmlFor="f-light">Light</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="medium" id="f-medium" /><Label htmlFor="f-medium">Medium</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="heavy" id="f-heavy" /><Label htmlFor="f-heavy">Heavy</Label></div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Symptoms</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {SYMPTOMS_LIST.map(symptom => (
                                                 <div key={symptom.id} className="flex items-center space-x-2">
                                                    <Checkbox 
                                                        id={symptom.id}
                                                        checked={selectedSymptoms.includes(symptom.id)}
                                                        onCheckedChange={(checked) => {
                                                            const newSymptoms = checked
                                                                ? [...selectedSymptoms, symptom.id]
                                                                : selectedSymptoms.filter((s) => s !== symptom.id);
                                                            setSelectedSymptoms(newSymptoms);
                                                        }}
                                                    />
                                                    <Label htmlFor={symptom.id}>{symptom.label}</Label>
                                                 </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mood (1 = Low, 5 = Great)</Label>
                                        <Select value={String(selectedMood)} onValueChange={(val) => setSelectedMood(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Rate your mood" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1,2,3,4,5].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-2">
                                        <Label>Energy (1 = Low, 10 = High)</Label>
                                         <Select value={String(selectedEnergy)} onValueChange={(val) => setSelectedEnergy(Number(val))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Rate your energy" />
                                            </Trigger>
                                            <SelectContent>
                                                {Array.from({length: 10}, (_,i) => i+1).map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full" onClick={handleSaveLog}>Save Log</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Droplet className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Flow</p>
                                <p className="text-muted-foreground text-sm capitalize">{currentLog.flow}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Brain className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Symptoms</p>
                                <p className="text-muted-foreground text-sm capitalize">
                                    {currentLog.symptoms.length > 0 ? currentLog.symptoms.join(', ') : 'None'}
                                </p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Heart className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Mood</p>
                                <p className="text-muted-foreground text-sm">{currentLog.mood > 0 ? `${currentLog.mood}/5` : 'Not logged'}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Zap className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Energy</p>
                                <p className="text-muted-foreground text-sm">{currentLog.energy > 0 ? `${currentLog.energy}/10` : 'Not logged'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
       </main>
    </div>
  );
}
