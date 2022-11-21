"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function login(req, res) {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).send("Missing login parameters");
        }
        const user = await prisma_1.default.users.findUnique({ where: { username: username } });
        if (!user)
            return res.status(400).send("User not found");
        bcryptjs_1.default.compare(password, user.password, async function (err, result) {
            if (!err && result) {
                //params to be forwarded through token
                const params = {
                    id: user.id,
                    accountId: user.accountId
                };
                return res.status(200).send({
                    token: generateToken(params),
                    username: user.username,
                    accountId: user.accountId,
                });
            }
            else {
                return res.status(405).send('Wrong email or password');
            }
        });
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
}
exports.login = login;
function generateToken(params) {
    return jsonwebtoken_1.default.sign(params, process.env.JWT_HASH, {
        expiresIn: "24h"
    });
}
//# sourceMappingURL=login.js.map