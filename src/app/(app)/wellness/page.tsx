import { WellnessJournal } from './components/wellness-journal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WellnessPage() {
  return (
    <div className="flex flex-1 flex-col">
       <header className="flex h-14 lg:h-[60px] items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            Wellness Journey
        </h1>
        <Link href="/suggestions">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Get Suggestions
          </Button>
        </Link>
      </header>
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                 <WellnessJournal />
            </div>
             <div className="lg:col-span-2 space-y-6">
                <Card>
                    <Image 
                        src="https://picsum.photos/seed/wellness-hero/600/400" 
                        alt="Calm natural scene"
                        width={600}
                        height={400}
                        className="rounded-t-lg object-cover w-full h-48"
                        data-ai-hint="calm nature"
                    />
                    <CardHeader>
                        <CardTitle>Nurture Your Mind</CardTitle>
                        <CardDescription>Mental wellness is a journey, not a destination. Be patient and kind to yourself.</CardDescription>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Quick Tips for a Better Day</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p><strong>Deep Breaths:</strong> Inhale for 4, hold for 4, exhale for 6. Repeat 5 times.</p>
                        <p><strong>Mindful Moment:</strong> Notice 3 things you can see and 2 things you can hear right now.</p>
                        <p><strong>Stretch:</strong> Gently stretch your neck and shoulders to release tension.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
