'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCycleStore } from '@/store/cycle-data-store';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useEffect } from 'react';

const settingsSchema = z.object({
  cycleLength: z
    .number({ coerce: true })
    .min(10, 'Cycle length must be at least 10 days.')
    .max(60, 'Cycle length cannot exceed 60 days.'),
  periodLength: z
    .number({ coerce: true })
    .min(1, 'Period length must be at least 1 day.')
    .max(15, 'Period length cannot exceed 15 days.'),
});

export default function SettingsPage() {
  const { cycleData, setCycleData, isInitialized } = useCycleStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      cycleLength: cycleData.cycleLength,
      periodLength: cycleData.periodLength,
    },
  });

  useEffect(() => {
    if (isInitialized) {
      form.reset({
        cycleLength: cycleData.cycleLength,
        periodLength: cycleData.periodLength,
      });
    }
  }, [isInitialized, cycleData, form]);

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    setCycleData({
      ...cycleData,
      cycleLength: values.cycleLength,
      periodLength: values.periodLength,
    });
    toast({
      title: 'Settings Saved',
      description: 'Your cycle information has been updated.',
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary" />
          Settings
        </h1>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Cycle Configuration</CardTitle>
              <CardDescription>
                Adjust your average cycle and period lengths for more accurate
                predictions. These values are automatically recalculated when you log
                new periods.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cycleLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Cycle Length (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          The typical time from the start of one period to the
                          start of the next.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periodLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Period Length (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          The typical number of days your period lasts.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </div>
  );
}
