"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (fn, method) => {
    return async (req, res) => {
        if (req.method !== method) {
            return res.status(405).send('Request method not supported');
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send('Authorization token not provided');
        }
        const parts = authHeader.split(' ');
        if (parts.length != 2) {
            return res.status(401).send('Malformatted token');
        }
        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).send('Invalid token');
        }
        await jsonwebtoken_1.default.verify(token, process.env.JWT_HASH, (error, decoded) => {
            if (error) {
                return res.status(401).send('invalid token');
            }
            req.body = Object.assign(Object.assign({}, req.body), { id: decoded.id, accountId: decoded.accountId });
        });
        return fn(req, res);
    };
};
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map