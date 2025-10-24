"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminListMarkets = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
// This check prevents the app from being initialized multiple times.
if (!admin.apps.length) {
    admin.initializeApp();
}
exports.adminListMarkets = (0, https_1.onCall)({ region: 'us-central1' }, async (req) => {
    try {
        if (!req.auth) {
            throw new https_1.HttpsError('unauthenticated', 'Sign in required');
        }
        const uid = req.auth.uid;
        const adminDoc = await admin.firestore().doc(`roles_admin/${uid}`).get();
        if (!adminDoc.exists) {
            throw new https_1.HttpsError('permission-denied', 'Admins only');
        }
        const { state } = (req.data ?? {});
        let q = admin.firestore().collection('markets');
        // only add filter if provided (avoid composite index surprises)
        if (state) {
            q = q.where('state', '==', state);
        }
        // Avoid orderBy on possibly-missing fields; safest for mixed data
        const snap = await q.limit(200).get();
        const rows = snap.docs.map(d => {
            const x = d.data() || {};
            return {
                id: d.id,
                fixtureId: x.fixtureId ?? null,
                type: x.type ?? null,
                state: x.state ?? null,
                feeBps: x.feeBps ?? null,
                startTimeUtc: x.startTimeUtc ?? null,
                publishedAt: x.publishedAt?.toMillis?.() ?? x.publishedAt ?? null,
            };
        });
        return { rows };
    }
    catch (e) {
        console.error('adminListMarkets failed:', e);
        if (e instanceof https_1.HttpsError)
            throw e;
        throw new https_1.HttpsError('internal', e?.message ?? 'listMarkets error');
    }
});
//# sourceMappingURL=listMarkets.js.map