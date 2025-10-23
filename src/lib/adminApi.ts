
'use client';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Fixture, Market, Team, Trade, User } from './types';

// Helper function to call a callable function in the correct region
async function callAdmin<T>(name: string, payload?: any): Promise<T> {
    try {
        const functions = getFunctions(undefined, 'us-central1');
        const callable = httpsCallable(functions, name);
        const result = await callable(payload);
        return result.data as T;
    } catch(e: any) {
        console.error(`[callAdmin:${name}] error:`, e?.code, e?.message, e?.details);
        throw new Error(`${e?.code ?? 'unknown'}: ${e?.message ?? String(e)}`);
    }
}

// Explicit types for what the admin functions will return.
export type AdminUser = { id: string; email?: string; handle?: string; createdAt?: number };
export type AdminMarket = Pick<Market, 'id' | 'fixtureId' | 'type' | 'state' | 'feeBps' | 'publishedAt'> & { startTimeUtc?: number };
export type AdminFixture = Pick<Fixture, 'id' | 'homeTeamId' | 'awayTeamId' | 'startTimeUtc' | 'status'>;
export type AdminTrade = Pick<Trade, 'id' | 'uid' | 'marketId' | 'side' | 'amount' | 'shares' | 'createdAt'> & { path: string };

// API functions
export function adminListUsers(): Promise<{ rows: AdminUser[] }> {
    return callAdmin('listUsers');
}

export function adminListMarkets(params?: { state?: string }): Promise<{rows: AdminMarket[]}> {
    return callAdmin('adminListMarkets', params);
}

export function adminListFixtures(payload?: { dateFrom?: string; dateTo?: string }): Promise<AdminFixture[]> {
    return callAdmin('adminListFixtures', payload);
}

export function adminListTrades(): Promise<AdminTrade[]> {
    return callAdmin('adminListTrades');
}

export function adminListTeams(): Promise<{rows: Team[]}> {
    return callAdmin('adminListTeams');
}
