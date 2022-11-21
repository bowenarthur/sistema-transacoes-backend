import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import authenticate from "../middleware/authenticate";

async function getUser(req: Request, res: Response) {
  const { id, accountId } = req.body;

  try {
    if (!id || !accountId) {
      return res.status(400).send("Missing parameters");
    }

    const user = await prisma.users.findUnique({ where: { id: id } });
    
    if(!user) return res.status(400).send("User not found");

    const account = await prisma.accounts.findUnique({ where: { id: accountId } });

    if(!account) return res.status(400).send("Account not found");

    return res.status(200).send({
        id: user.id,
        accountId: user.accountId,
        balance: account.balance,
        username: user.username,
    });

  } catch (err) {
    return res.status(400).send((err as Error).message);
  }
}

export default authenticate(getUser, 'GET');