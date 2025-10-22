'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase/provider';
import { signInWithCustomToken } from 'firebase/auth';

export function useTelegramAuth() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticating' | 'authenticated' | 'unauthenticated' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase is still checking its own auth state, wait.
    if (isUserLoading) {
      setAuthStatus('loading');
      return;
    }
    
    // If a user is already logged in (e.g., from a previous session), we're done.
    if (user) {
      setAuthStatus('authenticated');
      return;
    }

    // Only attempt Telegram auth if no user is logged in.
    const performTelegramAuth = async () => {
      // Ensure we are in a Telegram Web App environment.
      if (typeof window === 'undefined' || !window.Telegram?.WebApp?.initData) {
        setAuthStatus('unauthenticated');
        setError('Not in a Telegram Web App environment.');
        return;
      }

      try {
        setAuthStatus('authenticating');
        const initData = window.Telegram.WebApp.initData;

        // Call our backend to verify the initData and get a Firebase custom token.
        const response = await fetch('/api/auth/telegram/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        const { firebaseCustomToken } = data;

        if (!firebaseCustomToken) {
          throw new Error('No custom token received from backend.');
        }

        // Use the custom token to sign into Firebase.
        await signInWithCustomToken(auth, firebaseCustomToken);
        
        // onAuthStateChanged in FirebaseProvider will handle the rest.
        // We set status to authenticated here for immediate feedback.
        setAuthStatus('authenticated');
        setError(null);

      } catch (err: any) {
        console.error('Telegram auth error:', err);
        setError(err.message || 'An unknown error occurred during Telegram authentication.');
        setAuthStatus('error');
      }
    };

    performTelegramAuth();
  }, [user, isUserLoading, auth]);

  return { authStatus, user, error };
}
