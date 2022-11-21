import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send("Missing login parameters");
    }

    const user = await prisma.users.findUnique({ where: { username: username } });

    if(!user) return res.status(400).send("User not found");

    bcrypt.compare(password, user.password, async function (err: any, result: any) {
        if (!err && result) {
            //params to be forwarded through token
            const params = { 
                id: user.id,
                accountId: user.accountId
             }

            return res.status(200).send({
                token: generateToken(params),
                username: user.username,
                accountId: user.accountId,
            })

        } else {
            return res.status(405).send('Wrong email or password')
        }
    });
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }
}

function generateToken(params: Object) {
    return jwt.sign(params, process.env.JWT_HASH as string, {
        expiresIn: "24h"
    })
}
