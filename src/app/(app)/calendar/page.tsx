'use client';

import React, { useState } from 'react';
import { addDays, format } from 'date-fns';
import { Brain, PlusCircle, Droplet, Calendar as CalendarIcon } from 'lucide-react';
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

// Mock data
const today = new Date();
const periodStart = new Date(today.getFullYear(), today.getMonth(), 5);
const periodDays = Array.from({ length: 5 }, (_, i) => addDays(periodStart, i));
const predictedPeriod = Array.from({ length: 5 }, (_, i) => addDays(new Date(today.getFullYear(), today.getMonth() + 1, 3), i));
const fertileWindow = Array.from({ length: 6 }, (_, i) => addDays(new Date(today.getFullYear(), today.getMonth(), 15), i));

const symptomsList = [
    { id: 'cramps', label: 'Cramps' },
    { id: 'headache', label: 'Headache' },
    { id: 'mood-swings', label: 'Mood Swings' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'bloating', label: 'Bloating' },
    { id: 'acne', label: 'Acne' },
];

type LogData = {
    flow: 'none' | 'light' | 'medium' | 'heavy';
    symptoms: string[];
};

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(today);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logs, setLogs] = useState<Record<string, LogData>>({
    [format(new Date(), 'yyyy-MM-dd')]: {
      flow: 'medium',
      symptoms: ['cramps', 'fatigue'],
    },
  });
  const [selectedFlow, setSelectedFlow] = useState<'none' | 'light' | 'medium' | 'heavy'>('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

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

  const selectedDateKey = date ? format(date, 'yyyy-MM-dd') : '';
  const currentLog = logs[selectedDateKey] || { flow: 'none', symptoms: [] };

  const handleOpenLog = () => {
    setSelectedFlow(currentLog.flow);
    setSelectedSymptoms(currentLog.symptoms);
    setIsLogOpen(true);
  }

  const handleSaveLog = () => {
    if (selectedDateKey) {
      setLogs({
        ...logs,
        [selectedDateKey]: {
          flow: selectedFlow,
          symptoms: selectedSymptoms,
        },
      });
    }
    setIsLogOpen(false);
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
            <CardContent className="p-2">
               <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-primary/20"></div>
                    <span>Period</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md border border-dashed border-primary/50"></div>
                    <span>Predicted Period</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-accent"></div>
                    <span>Fertile Window</span>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{format(date || new Date(), 'MMMM d, yyyy')}</span>
                         <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={handleOpenLog}>
                                    <PlusCircle className="w-5 h-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Log for {format(date || new Date(), 'MMMM d, yyyy')}</DialogTitle>
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
                                            {symptomsList.map(symptom => (
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
                    </div>
                </CardContent>
            </Card>
        </div>
       </main>
    </div>
  );
}
