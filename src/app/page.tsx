import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center justify-between px-6 border-b">
        <Logo />
        <div className="space-x-2">
          <Button asChild variant="ghost">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] w-full flex items-center justify-center text-center text-white bg-primary">
             <Image
                src="https://picsum.photos/seed/landing-hero/1200/800"
                alt="Empowered woman"
                layout="fill"
                objectFit="cover"
                className="opacity-20"
                data-ai-hint="empowered woman"
            />
            <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline">
                    Embrace Your Cycle. Empower Your Life.
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    Vara is your personal wellness companion, helping you understand your body and live in harmony with your natural rhythms.
                </p>
                <Button asChild size="lg" className="mt-8">
                    <Link href="/register">Get Started for Free</Link>
                </Button>
            </div>
        </section>
        <section className="py-16 md:py-24 px-4">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold font-headline">Features</h2>
                <p className="mt-2 text-muted-foreground">Everything you need for a more mindful wellness journey.</p>
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                    <div className="p-6 rounded-lg border">
                        <h3 className="text-xl font-semibold">Cycle Tracking</h3>
                        <p className="mt-2 text-muted-foreground">Log your period, symptoms, and moods to discover patterns and predict your cycle with greater accuracy.</p>
                    </div>
                    <div className="p-6 rounded-lg border">
                        <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
                        <p className="mt-2 text-muted-foreground">Get personalized suggestions for diet, exercise, and self-care tailored to your unique cycle phase and symptoms.</p>
                    </div>
                     <div className="p-6 rounded-lg border">
                        <h3 className="text-xl font-semibold">Wellness Journal</h3>
                        <p className="mt-2 text-muted-foreground">Reflect on your emotional well-being and receive gentle, insightful feedback from our AI companion, Tiara.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Vara. All Rights Reserved.
      </footer>
    </div>
  );
}
