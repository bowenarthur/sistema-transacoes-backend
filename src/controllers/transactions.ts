import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import authenticate from "../middleware/authenticate";

interface Transaction {
  id: string;
  creditedAccountId: string;
  debitedAccountId: string;
  value: number;
  creditedUser?: string;
  debitedUser?: string;
}

async function transactions(req: Request, res: Response) {
  const { accountId } = req.body;

  try {
    if (!accountId) {
      return res.status(400).send("Missing data");
    }

    const transactions: Transaction[] = await prisma.transactions.findMany({
      where: {
        OR: [{ debitedAccountId: accountId }, { creditedAccountId: accountId }],
      },
    });

    if (!transactions) return res.status(400).send("Transactions not found");

    for(let i=0;i<transactions.length;i++){
      const debited = await prisma.users.findUnique({
        where: { accountId: transactions[i].debitedAccountId },
      });

      const credited = await prisma.users.findUnique({
        where: { accountId: transactions[i].creditedAccountId },
      });

      if(!debited || !credited) return res.status(400).send("Transaction user not found");

      transactions[i] = {
        ...transactions[i],
        debitedUser: debited.username,
        creditedUser: credited.username
      }
    }

    return res.status(200).send(transactions);
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }
}

export default authenticate(transactions, "GET");
