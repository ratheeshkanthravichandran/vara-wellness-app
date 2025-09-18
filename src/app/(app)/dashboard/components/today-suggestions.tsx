'use client';

import { useEffect, useState } from 'react';
import {
  tailoredActivityRecommendations,
  type TailoredActivityRecommendationsOutput,
} from '@/ai/flows/tailored-activity-recommendations';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function TodaySuggestions() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] =
    useState<TailoredActivityRecommendationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getSuggestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await tailoredActivityRecommendations({
          cyclePhase: 'menstruation',
          energyLevels: 'low',
          symptomDescription: 'mild cramps',
        });
        setResult(res);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred.',
        );
      } finally {
        setLoading(false);
      }
    }
    getSuggestions();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Today's Suggestions
        </h2>
        <Link href="/suggestions">
          <Button variant="outline">View More</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            <span>Personalized Activity Ideas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
          {error && (
            <p className="text-destructive">
              Error fetching suggestions: {error}
            </p>
          )}
          {result && (
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: result.activityRecommendations.replace(/\n/g, '<br />'),
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
