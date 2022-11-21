"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
async function cashout(req, res) {
    const { accountId, toUsername, value } = req.body;
    console.log(req.body);
    try {
        if (!toUsername || !value) {
            return res.status(400).send("Missing cash-out parameters");
        }
        const debitedUser = await prisma_1.default.users.findUnique({
            where: { username: toUsername },
        });
        if (!debitedUser)
            return res.status(400).send("User not found");
        if (debitedUser.accountId === accountId) {
            return res.status(400).send("You can't cash-out to yourself");
        }
        const creditedAccount = await prisma_1.default.accounts.findUnique({
            where: { id: accountId },
        });
        const debitedAccount = await prisma_1.default.accounts.findUnique({
            where: { id: debitedUser.accountId },
        });
        if (!creditedAccount || !debitedAccount)
            return res.status(400).send("Account not found");
        if (creditedAccount.balance < value) {
            return res.status(400).send("Balance is not enough");
        }
        await prisma_1.default.accounts.update({
            where: { id: accountId },
            data: {
                balance: creditedAccount.balance - value
            },
        });
        await prisma_1.default.accounts.update({
            where: { id: debitedAccount.id },
            data: {
                balance: debitedAccount.balance + value
            },
        });
        await prisma_1.default.transactions.create({
            data: {
                creditedAccountId: accountId,
                debitedAccountId: debitedUser.accountId,
                value: value,
            },
        });
        return res.status(200).send("Success");
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
}
exports.default = (0, authenticate_1.default)(cashout, 'POST');
//# sourceMappingURL=cash-out.js.map