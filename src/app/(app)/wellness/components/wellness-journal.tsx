'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateWellnessJournalEntry,
  type WellnessJournalOutput,
} from '@/ai/flows/wellness-journal-flow';
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
import { BookHeart, Feather } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  mood: z.string().min(1, 'Please select your current mood.'),
  journalEntry: z
    .string()
    .min(10, 'Please write at least 10 characters.')
    .max(500, 'Journal entry cannot exceed 500 characters.'),
});

export function WellnessJournal() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WellnessJournalOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      journalEntry: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await generateWellnessJournalEntry(values);
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
        <CardTitle className="flex items-center gap-2">
          <BookHeart />
          My Wellness Journal
        </CardTitle>
        <CardDescription>
          Take a moment to reflect on your thoughts and feelings. Our AI will
          provide a gentle reflection to accompany your entry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How are you feeling today?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your mood" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="calm">Calm</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                      <SelectItem value="anxious">Anxious</SelectItem>
                      <SelectItem value="stressed">Stressed</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="journalEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's on your mind?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Let your thoughts flow freely here..."
                      className="resize-none"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is a safe space for your thoughts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                'Generating Reflection...'
              ) : (
                <>
                  <Feather className="mr-2" />
                  Get a Reflection
                </>
              )}
            </Button>
          </form>
        </Form>
        {result && (
          <Card className="mt-6 bg-muted/50 border-dashed">
            <CardHeader>
              <CardTitle className="font-headline">{result.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground italic leading-relaxed">
                {result.content}
              </p>
              <Alert className="bg-background">
                <AlertTitle>Today's Affirmation</AlertTitle>
                <AlertDescription>{result.affirmation}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
