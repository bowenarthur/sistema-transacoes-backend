"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
async function getUser(req, res) {
    const { id, accountId } = req.body;
    try {
        if (!id || !accountId) {
            return res.status(400).send("Missing parameters");
        }
        const user = await prisma_1.default.users.findUnique({ where: { id: id } });
        if (!user)
            return res.status(400).send("User not found");
        const account = await prisma_1.default.accounts.findUnique({ where: { id: accountId } });
        if (!account)
            return res.status(400).send("Account not found");
        return res.status(200).send({
            id: user.id,
            accountId: user.accountId,
            balance: account.balance,
            username: user.username,
        });
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
}
exports.default = (0, authenticate_1.default)(getUser, 'GET');
//# sourceMappingURL=get-user.js.map