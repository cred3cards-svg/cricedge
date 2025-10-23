
'use client';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Fixture, Market, Team, Trade, User } from './types';

// Helper function to call a callable function
async function callAdmin<T>(name: string, payload?: any): Promise<T> {
    const functions = getFunctions();
    const callable = httpsCallable(functions, name);
    const result = await callable(payload);
    return result.data as T;
}

// Explicit types for what the admin functions will return.
// These might be subsets of the main types.
export type AdminUser = Pick<User, 'id' | 'email' | 'handle' | 'createdAt'>;
export type AdminMarket = Pick<Market, 'id' | 'fixtureId' | 'type' | 'state' | 'feeBps' | 'publishedAt'> & { startTimeUtc?: number };
export type AdminFixture = Pick<Fixture, 'id' | 'homeTeamId' | 'awayTeamId' | 'startTimeUtc' | 'status'>;
export type AdminTrade = Pick<Trade, 'id' | 'uid' | 'marketId' | 'side' | 'amount' | 'shares' | 'createdAt'> & { path: string };

// API functions
export function listUsers(): Promise<AdminUser[]> {
    return callAdmin('admin-listUsers');
}

export function listMarkets(payload?: { state?: Market['state'] }): Promise<AdminMarket[]> {
    return callAdmin('admin-listMarkets', payload);
}

export function listFixtures(payload?: { dateFrom?: string; dateTo?: string }): Promise<AdminFixture[]> {
    return callAdmin('admin-listFixtures', payload);
}

export function listTrades(): Promise<AdminTrade[]> {
    return callAdmin('admin-listTrades');
}

// This is a public data fetch, so it can be called directly or via a callable
// For consistency, we can wrap it, but it doesn't require admin privileges.
// In a real app, this could just be a direct firestore query from the client if rules allow.
export function listTeams(): Promise<Team[]> {
    return callAdmin('admin-listTeams');
}
