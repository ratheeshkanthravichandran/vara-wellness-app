'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Lightbulb } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ReliefSuggestionsForm = dynamic(
  () => import('./components/relief-suggestions-form').then(mod => mod.ReliefSuggestionsForm),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Symptom Relief Suggestions</CardTitle>
          <CardDescription>
            Tell us how you're feeling, and we'll generate some personalized ideas
            to help you find relief.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

const ActivityRecommendationsForm = dynamic(
  () => import('./components/activity-recommendations-form').then(mod => mod.ActivityRecommendationsForm),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Activity Recommendations</CardTitle>
          <CardDescription>
            Find exercises and activities perfectly suited for your current cycle
            phase and energy levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

export default function SuggestionsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Personalized Suggestions
        </h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs defaultValue="relief" className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="relief">
              <Lightbulb className="mr-2" />
              Symptom Relief
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Sparkles className="mr-2" />
              Activity Ideas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="relief">
            <ReliefSuggestionsForm />
          </TabsContent>
          <TabsContent value="activity">
            <ActivityRecommendationsForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
