import { Request, Response } from "express"
import jwt from "jsonwebtoken"

const authenticate = (fn: any, method: any) => {
    return async (req: Request, res: Response) => {

        if (req.method !== method) {
            return res.status(405).send('Request method not supported')
        }

        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).send('Authorization token not provided')
        }

        const parts = authHeader.split(' ')

        if (parts.length != 2) {
            return res.status(401).send('Malformatted token')
        }

        const [scheme, token] = parts

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).send('Invalid token')
        }

        await jwt.verify(token, process.env.JWT_HASH as string, (error, decoded: any) => {
            if (error) {
                return res.status(401).send('invalid token')
            }

            req.body = {
                ...req.body,
                id: decoded.id,
                accountId: decoded.accountId
            }
        })

        return fn(req, res)

    }

}

export default authenticate