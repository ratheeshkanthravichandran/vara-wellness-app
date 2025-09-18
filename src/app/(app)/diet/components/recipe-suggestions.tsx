'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getRecipeSuggestions,
  type RecipeSuggestionsOutput,
} from '@/ai/flows/recipe-suggestions-flow';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Utensils } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  cyclePhase: z.string().min(1, 'Please select a cycle phase.'),
});

export function RecipeSuggestions() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecipeSuggestionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cyclePhase: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await getRecipeSuggestions(values);
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
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cyclePhase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cycle Phase</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Automatically submit form on change
                        form.handleSubmit(onSubmit)();
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a phase to get recipe ideas" />
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
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center text-muted-foreground animate-pulse">
          <Utensils className="mx-auto h-8 w-8" />
          <p>Generating delicious ideas...</p>
        </div>
      )}

      {result && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.recipes.map((recipe, index) => (
            <Card key={index} className="flex flex-col">
              <Image
                src={`https://picsum.photos/seed/recipe${index}/300/200`}
                alt={recipe.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-t-lg"
                data-ai-hint={recipe.imageHint}
              />
              <div className="flex flex-col flex-grow p-4">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <CardDescription className="pt-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-0 pt-4 mt-auto">
                  <Button variant="outline" className="w-full">
                    View Recipe
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
