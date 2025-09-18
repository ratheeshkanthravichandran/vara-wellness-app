'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getPersonalizedReliefSuggestions,
  type PersonalizedReliefSuggestionsOutput,
} from '@/ai/flows/personalized-relief-suggestions';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';

const symptomsList = [
  { id: 'cramps', label: 'Cramps' },
  { id: 'headaches', label: 'Headaches' },
  { id: 'mood swings', label: 'Mood Swings' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'bloating', label: 'Bloating' },
  { id: 'acne', label: 'Acne' },
];

const formSchema = z.object({
  symptoms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one symptom.',
  }),
  cyclePhase: z.string().min(1, 'Please select your cycle phase.'),
  flowIntensity: z.string().min(1, 'Please select your flow intensity.'),
  lifestyleHabits: z.string().optional(),
});

export function ReliefSuggestionsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<PersonalizedReliefSuggestionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: [],
      cyclePhase: '',
      flowIntensity: '',
      lifestyleHabits: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await getPersonalizedReliefSuggestions(values);
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
        <CardTitle>Symptom Relief Suggestions</CardTitle>
        <CardDescription>
          Tell us how you're feeling, and we'll generate some personalized ideas
          to help you find relief.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Symptoms</FormLabel>
                    <FormDescription>
                      Select all symptoms you are currently experiencing.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {symptomsList.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                name="flowIntensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flow Intensity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="lifestyleHabits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lifestyle Habits (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'I exercise 3 times a week', 'I have trouble sleeping'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any extra details can help us give better suggestions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Get Suggestions'}
              <Wand2 className="ml-2" />
            </Button>
          </form>
        </Form>
        {result && (
          <Card className="mt-8 bg-muted">
            <CardHeader>
              <CardTitle>Here are your suggestions!</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
