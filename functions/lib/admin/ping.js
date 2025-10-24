"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPing = void 0;
const https_1 = require("firebase-functions/v2/https");
exports.adminPing = (0, https_1.onCall)({ region: 'us-central1' }, async (req) => {
    if (!req.auth)
        throw new https_1.HttpsError('unauthenticated', 'Sign in required');
    return { ok: true, uid: req.auth.uid, time: new Date().toISOString() };
});
//# sourceMappingURL=ping.js.map