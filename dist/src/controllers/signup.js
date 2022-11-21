"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function signup(req, res) {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).send("Missing signup parameters");
        }
        if (username.length < 3) {
            return res
                .status(400)
                .send("Username must be at least 3 characters long");
        }
        if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            return res.status(400).send("Password does not meet the requirements");
        }
        if (await prisma_1.default.users.findUnique({ where: { username: username } })) {
            return res.status(400).send("User already exists");
        }
        bcryptjs_1.default.hash(password, 12, async function (err, hash) {
            const account = await prisma_1.default.accounts.create({
                data: {
                    balance: 100,
                },
            });
            await prisma_1.default.users.create({
                data: {
                    username: username,
                    password: hash,
                    accountId: account.id,
                },
            });
            return res.status(200).send("Success");
        });
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
}
exports.signup = signup;
//# sourceMappingURL=signup.js.map