'use client';
import { useState, useRef, useEffect } from 'react';
import { askPcosAssistant } from '@/ai/flows/pcos-assistant-flow';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, HeartPulse } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function PcosPcodPage() {
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 100);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentMessage.trim() || loading) return;

    setLoading(true);
    const userMessage: Message = { role: 'user', content: currentMessage };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
    setCurrentMessage('');

    setConversation((prev) => [
      ...prev,
      { role: 'model', content: '' },
    ]);

    try {
      const result = await askPcosAssistant({
        history: newConversation.slice(0, -1),
        message: userMessage.content,
      });

      setConversation((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1
            ? { ...msg, content: result.response }
            : msg,
        ),
      );
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-primary" />
          PCOS/PCOD Care
        </h1>
      </header>
      <main className="flex-1 flex flex-col p-4 md:p-6">
        <Card className="flex flex-1 flex-col w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">
              PCOS/PCOD Assistant
            </CardTitle>
            <CardDescription className="text-center">
              Ask questions and get information about managing PCOS and PCOD.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <ScrollArea className="flex-1 space-y-4 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {conversation.length === 0 && (
                   <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>
                      I am an AI assistant and not a medical professional. The information I provide is for educational purposes only. Please consult with a qualified healthcare provider for diagnosis and treatment.
                    </AlertDescription>
                  </Alert>
                )}
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      msg.role === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {msg.role === 'model' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          T
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content === '' && msg.role === 'model' && loading ? (
                        <p className="text-sm text-muted-foreground animate-pulse">
                          Tiara is thinking...
                        </p>
                      ) : (
                        <p className="text-sm">
                          {msg.content}
                        </p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-auto pt-4 border-t">
              <form onSubmit={handleSubmit} className="flex items-start gap-2">
                <Textarea
                  placeholder="Ask about PCOS symptoms, diet, etc."
                  className="min-h-[40px] resize-none"
                  rows={1}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  disabled={loading}
                />
                <Button type="submit" disabled={loading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
