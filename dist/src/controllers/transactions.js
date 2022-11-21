"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
async function transactions(req, res) {
    const { accountId } = req.body;
    try {
        if (!accountId) {
            return res.status(400).send("Missing data");
        }
        const transactions = await prisma_1.default.transactions.findMany({
            where: {
                OR: [{ debitedAccountId: accountId }, { creditedAccountId: accountId }],
            },
        });
        if (!transactions)
            return res.status(400).send("Transactions not found");
        for (let i = 0; i < transactions.length; i++) {
            const debited = await prisma_1.default.users.findUnique({
                where: { accountId: transactions[i].debitedAccountId },
            });
            const credited = await prisma_1.default.users.findUnique({
                where: { accountId: transactions[i].creditedAccountId },
            });
            if (!debited || !credited)
                return res.status(400).send("Transaction user not found");
            transactions[i] = Object.assign(Object.assign({}, transactions[i]), { debitedUser: debited.username, creditedUser: credited.username });
        }
        return res.status(200).send(transactions);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
}
exports.default = (0, authenticate_1.default)(transactions, "GET");
//# sourceMappingURL=transactions.js.map