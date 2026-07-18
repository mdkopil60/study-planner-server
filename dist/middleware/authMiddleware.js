"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const auth_1 = require("../config/auth");
// Convert Node's IncomingHttpHeaders into a standard Headers object
const toHeaders = (headers) => {
    const result = new Headers();
    for (const [key, value] of Object.entries(headers)) {
        if (value === undefined)
            continue;
        if (Array.isArray(value)) {
            for (const v of value)
                result.append(key, v);
        }
        else {
            result.append(key, value);
        }
    }
    return result;
};
const requireAuth = async (req, res, next) => {
    try {
        const session = await auth_1.auth.api.getSession({
            headers: toHeaders(req.headers)
        });
        if (!session || !session.user) {
            res.status(401).json({ error: 'Unauthorized. Please log in.' });
            return;
        }
        req.user = session.user;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};
exports.requireAuth = requireAuth;
