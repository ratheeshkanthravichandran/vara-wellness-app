'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  tailoredActivityRecommendations,
  type TailoredActivityRecommendationsOutput,
} from '@/ai/flows/tailored-activity-recommendations';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

const formSchema = z.object({
  cyclePhase: z.string().min(1, 'Please select your cycle phase.'),
  energyLevels: z.string().min(1, 'Please select your energy level.'),
  symptomDescription: z.string().optional(),
});

export function ActivityRecommendationsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<TailoredActivityRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cyclePhase: '',
      energyLevels: '',
      symptomDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await tailoredActivityRecommendations(values);
      setResult(res);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Recommendations</CardTitle>
        <CardDescription>
          Find exercises and activities perfectly suited for your current cycle
          phase and energy levels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cyclePhase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cycle Phase</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="menstruation">
                          Menstruation
                        </SelectItem>
                        <SelectItem value="follicular">Follicular</SelectItem>
                        <SelectItem value="ovulation">Ovulation</SelectItem>
                        <SelectItem value="luteal">Luteal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="energyLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select energy level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="symptomDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'mild cramps', 'feeling tired'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describing your symptoms can help refine recommendations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Get Recommendations'}
              <Sparkles className="ml-2" />
            </Button>
          </form>
        </Form>
        {result && (
          <Card className="mt-8 bg-muted">
            <CardHeader>
              <CardTitle>Activity Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: result.activityRecommendations.replace(
                    /\n/g,
                    '<br />',
                  ),
                }}
              />
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
