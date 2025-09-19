'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const affirmations = [
    "I am in tune with my body's needs.",
    "I honor the cycles of rest and activity in my life.",
    "I am resilient, and I embrace my flow.",
    "I listen to my body with kindness and compassion.",
    "My body is wise, and I trust its signals.",
    "I am worthy of rest and self-care.",
    "I release what no longer serves me.",
    "I am creating a life filled with balance and peace."
];

export function DailyAffirmation() {
    const [affirmation, setAffirmation] = useState('');

    useEffect(() => {
        // Get a new affirmation based on the day of the year
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24);
        setAffirmation(affirmations[dayOfYear % affirmations.length]);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="w-5 h-5" />
                    <span>Daily Affirmation</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground italic">"{affirmation}"</p>
            </CardContent>
        </Card>
    );
}
