import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import authenticate from "../middleware/authenticate";

async function cashout(req: Request, res: Response) {
  const { accountId, toUsername, value } = req.body;
  console.log(req.body)
  try {
    if (!toUsername || !value) {
      return res.status(400).send("Missing cash-out parameters");
    }

    const debitedUser = await prisma.users.findUnique({
      where: { username: toUsername },
    });

    if (!debitedUser) return res.status(400).send("User not found");

    if(debitedUser.accountId === accountId) {
      return res.status(400).send("You can't cash-out to yourself");
    }

    const creditedAccount = await prisma.accounts.findUnique({
        where: { id: accountId },
    });

    const debitedAccount = await prisma.accounts.findUnique({
        where: { id: debitedUser.accountId },
    });

    if(!creditedAccount || !debitedAccount) return res.status(400).send("Account not found");

    if(creditedAccount.balance < value) {
        return res.status(400).send("Balance is not enough");
    }

    await prisma.accounts.update({
        where: { id: accountId },
        data: {
            balance: creditedAccount.balance - value
        },
    });

    await prisma.accounts.update({
        where: { id: debitedAccount.id },
        data: {
            balance: debitedAccount.balance + value
        },
    });

    await prisma.transactions.create({
      data: {
        creditedAccountId: accountId,
        debitedAccountId: debitedUser.accountId,
        value: value,
      },
    });

    return res.status(200).send("Success");
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }
}

export default authenticate(cashout, 'POST');
