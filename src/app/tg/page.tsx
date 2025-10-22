'use client';
import Script from 'next/script';
import { useTelegramAuth } from '@/firebase/auth/use-telegram-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TelegramMiniAppPage() {
  const { authStatus, user, error } = useTelegramAuth();

  const renderStatus = () => {
    switch (authStatus) {
      case 'loading':
      case 'authenticating':
        return (
          <>
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Authenticating your session...</p>
            <Skeleton className="h-10 w-48" />
          </>
        );
      case 'authenticated':
        if (!user) return null;
        return (
          <>
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className="text-muted-foreground">Successfully logged in!</p>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{user.displayName || user.uid}</span>
            </div>
            <Button asChild>
                <Link href="/markets">Browse Markets</Link>
            </Button>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-destructive">Authentication Failed</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </>
        );
      case 'unauthenticated':
         return (
          <>
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Not a Telegram Session</p>
            <p className="text-xs text-muted-foreground">This app is intended to be used within Telegram.</p>
             <Button asChild variant="outline">
                <Link href="/">Go to Main Site</Link>
            </Button>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <>
      {/* This script is required to initialize the Telegram Web App */}
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center font-headline">OnlyWin</CardTitle>
            <CardDescription className="text-center">Telegram Mini App</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              {renderStatus()}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
