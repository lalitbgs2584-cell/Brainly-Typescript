import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config"
export const isLoggedIn = async (req: Request, res: Response) => {
    try {
        const token = req.cookies["cookieToken"]
        if (!token) {
            return res.status(404).json({
                message: "Token not found"
            })
        }
        console.log(token)
        const decodeToken = jwt.verify(token,config.jwtSecret)
        console.log(decodeToken)
         res.json({ decodeToken });
    } catch (error: any) {
        return res.status(404).json({
            message: error.message
        })
    }
}