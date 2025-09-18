import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, Zap, Heart, Brain } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const suggestions = [
  {
    title: 'Gentle Yoga',
    description: 'Ease cramps and boost your mood with a gentle yoga flow.',
    image: 'https://picsum.photos/seed/yoga/300/200',
    imageHint: 'yoga meditation',
    link: '#',
  },
  {
    title: 'Nourishing Tea',
    description: 'Sip on some raspberry leaf tea to help with uterine health.',
    image: 'https://picsum.photos/seed/tea/300/200',
    imageHint: 'tea cup',
    link: '#',
  },
  {
    title: 'Mindful Moment',
    description: 'Take 5 minutes for a guided meditation to reduce stress.',
    image: 'https://picsum.photos/seed/mindful/300/200',
    imageHint: 'calm nature',
    link: '#',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cycle Day</CardTitle>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Droplet className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Day 5</div>
              <p className="text-xs text-muted-foreground">Menstrual Phase</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Level</CardTitle>
               <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Low</div>
              <p className="text-xs text-muted-foreground">Listen to your body</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mood</CardTitle>
               <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Heart className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Sensitive</div>
              <p className="text-xs text-muted-foreground">Be kind to yourself</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Symptoms</CardTitle>
               <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Brain className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Cramps</div>
              <p className="text-xs text-muted-foreground">Mild discomfort</p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight font-headline">Today's Suggestions</h2>
            <Link href="/suggestions">
              <Button variant="outline">View More</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="overflow-hidden flex flex-col">
                <Image
                  src={suggestion.image}
                  alt={suggestion.title}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                  data-ai-hint={suggestion.imageHint}
                />
                <div className="flex flex-col flex-grow">
                  <CardHeader>
                    <CardTitle>{suggestion.title}</CardTitle>
                    <CardDescription>{suggestion.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Button asChild>
                      <Link href={suggestion.link}>Learn More</Link>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
