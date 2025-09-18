'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function RightSidebar() {
  return (
    <aside className="w-1/4 max-w-[350px] p-6 hidden lg:block">
        <div className="sticky top-0">
            <Card>
                <CardHeader>
                    <CardTitle>What's Happening</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">This space is ready for future features like trends, notifications, or other widgets.</p>
                </CardContent>
            </Card>
        </div>
    </aside>
  );
}
