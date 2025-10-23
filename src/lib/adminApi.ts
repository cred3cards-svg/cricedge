
'use client';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Fixture, Market, Team, Trade, User } from './types';
import { getApp } from 'firebase/app';

const fx = getFunctions(getApp(), 'us-central1');

async function callAdmin<T = any>(name: string, data: any = {}) {
    try {
        const fn = httpsCallable(fx, name);
        const res: any = await fn(data);
        return res.data as T;
    } catch (e: any) {
        console.error(`[callAdmin:${name}] error:`, e?.code, e?.message, e?.details);
        throw new Error(`${e?.code ?? 'unknown'}: ${e?.message ?? String(e)}`);
    }
}

// Explicit types for what the admin functions will return.
export type AdminUser = { id: string; email?: string; handle?: string; createdAt?: number };
export type AdminMarket = Pick<Market, 'id' | 'fixtureId' | 'type' | 'state' | 'feeBps' | 'publishedAt'> & { startTimeUtc?: number };
export type AdminFixture = Pick<Fixture, 'id' | 'homeTeamId' | 'awayTeamId' | 'startTimeUtc' | 'status'>;
export type AdminTrade = Pick<Trade, 'id' | 'uid' | 'marketId' | 'side' | 'amount' | 'shares' | 'createdAt'> & { path: string };

// API functions (names MUST match exports)
export const listUsers         = () => callAdmin<{rows:AdminUser[]}>('listUsers');
export const adminListMarkets  = (p?:{state?:string}) => callAdmin<{rows:AdminMarket[]}>('adminListMarkets', p);
export const adminListTeams    = () => callAdmin<{rows:Team[]}>('adminListTeams');
export const adminListFixtures = (p?:{dateFrom?:string; dateTo?:string}) => callAdmin<AdminFixture[]>('adminListFixtures', p);
export const adminListTrades   = (p?:{limit?:number}) => callAdmin<AdminTrade[]>('adminListTrades', p);
export const adminPing         = () => callAdmin<{ok: boolean; uid: string}>('adminPing');
