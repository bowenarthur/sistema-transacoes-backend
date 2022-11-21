import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export async function signup(req: Request, res: Response) {
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

    if (await prisma.users.findUnique({ where: { username: username } })) {
      return res.status(400).send("User already exists");
    }

    bcrypt.hash(password, 12, async function (err: any, hash: any) {
      const account = await prisma.accounts.create({
        data: {
          balance: 100,
        },
      });

      await prisma.users.create({
        data: {
          username: username,
          password: hash,
          accountId: account.id,
        },
      });

      return res.status(200).send("Success");
    });
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }
}
