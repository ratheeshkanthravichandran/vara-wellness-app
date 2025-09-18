import { RecipeSuggestions } from './components/recipe-suggestions';
import { Leaf } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DietPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          Diet &amp; Nutrition
        </h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="space-y-2 max-w-2xl mx-auto w-full">
          <h2 className="text-2xl font-bold font-headline tracking-tight text-center">
            Nourish Your Body
          </h2>
          <p className="text-muted-foreground text-center">
            Discover recipes designed to support you through every phase of your
            cycle. Select a phase below to get started.
          </p>
        </div>
        <div className="w-full max-w-2xl mx-auto">
          <RecipeSuggestions />
        </div>
      </main>
    </div>
  );
}
