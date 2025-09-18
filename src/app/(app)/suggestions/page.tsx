import { ReliefSuggestionsForm } from './components/relief-suggestions-form';
import { ActivityRecommendationsForm } from './components/activity-recommendations-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Lightbulb } from 'lucide-react';

export default function SuggestionsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
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
