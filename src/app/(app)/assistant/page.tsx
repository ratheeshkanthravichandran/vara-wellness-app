'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { askTiaraStream } from '@/ai/flows/tiara-assistant-flow';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type Message = {
  id: string;
  sender: 'user' | 'tiara';
  text: string;
};

export default function AssistantPage() {
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        // Find the viewport element within the ScrollArea
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [conversation]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: values.message,
    };
    const tiaraMessageId = `tiara-${Date.now()}`;
    const initialTiaraMessage: Message = {
      id: tiaraMessageId,
      sender: 'tiara',
      text: '',
    };
    setConversation((prev) => [...prev, userMessage, initialTiaraMessage]);
    form.reset();

    try {
      const stream = await askTiaraStream(values);
      let fullResponse = '';

      for await (const chunk of stream) {
        if (chunk.content) {
            fullResponse = chunk.content.map((c: any) => c.text || '').join('');
        }
        setConversation((prev) =>
          prev.map((msg) =>
            msg.id === tiaraMessageId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
      // Remove both user's and tiara's placeholder message on error
      setConversation((prev) => prev.slice(0, -2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          Ask Tiara
        </h1>
      </header>
      <main className="flex-1 flex flex-col p-4 md:p-6">
        <Card className="flex flex-1 flex-col w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">
              Your Personal AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <ScrollArea className="flex-1 space-y-4 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {conversation.length === 0 && (
                  <div className="text-center text-muted-foreground p-8">
                    <Sparkles className="mx-auto h-12 w-12 text-primary/50" />
                    <p>Ask anything, or start a discussion on any topic.</p>
                  </div>
                )}
                {conversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {msg.sender === 'tiara' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          T
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.text ? (
                         <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground animate-pulse">Tiara is thinking...</p>
                      )}
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-auto pt-4 border-t">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-start gap-2"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea
                            placeholder="Ask Tiara anything..."
                            className="min-h-[40px] resize-none"
                            rows={1}
                            {...field}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
