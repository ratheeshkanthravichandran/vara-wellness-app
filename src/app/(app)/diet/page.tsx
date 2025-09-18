import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const recipes = [
  {
    title: 'Cycle-Syncing Salad',
    phase: 'Follicular',
    description:
      'A light and refreshing salad with flax seeds and avocado to support estrogen production.',
    image: 'https://picsum.photos/seed/recipe1/300/200',
    imageHint: 'healthy salad',
  },
  {
    title: 'Energizing Smoothie',
    phase: 'Ovulation',
    description:
      'Packed with antioxidants and fiber to give you a boost during your most energetic phase.',
    image: 'https://picsum.photos/seed/recipe2/300/200',
    imageHint: 'fruit smoothie',
  },
  {
    title: 'Comforting Oatmeal',
    phase: 'Luteal',
    description:
      'Warm oatmeal with cinnamon and magnesium-rich nuts to help curb cravings and PMS.',
    image: 'https://picsum.photos/seed/recipe3/300/200',
    imageHint: 'oatmeal berries',
  },
  {
    title: 'Iron-Rich Lentil Soup',
    phase: 'Menstrual',
    description:
      'A hearty and grounding soup to replenish iron levels and provide comfort.',
    image: 'https://picsum.photos/seed/recipe4/300/200',
    imageHint: 'lentil soup',
  },
];

export default function DietPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Diet & Nutrition
        </h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-headline tracking-tight">
            Nourish Your Body
          </h2>
          <p className="text-muted-foreground">
            Discover recipes designed to support you through every phase of your
            cycle.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <Card key={recipe.title} className="flex flex-col">
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-t-lg"
                data-ai-hint={recipe.imageHint}
              />
              <div className="flex flex-col flex-grow p-4">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{recipe.title}</CardTitle>
                    <Badge variant="outline">{recipe.phase}</Badge>
                  </div>
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
      </main>
    </div>
  );
}
