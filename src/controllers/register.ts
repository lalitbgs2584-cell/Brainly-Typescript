import { Response, Request, CookieOptions } from "express"
import User from "../models/user.models"
import { generateToken } from "../utils/generateAccessToken"
import { config } from "../config"
const userRegistration = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body
        if (!username || !password || !email) return res.status(401).json({ message: "All fields required." })
        const existingUser = await User.findOne({ email: email })
        if (existingUser) return res.status(401).json({ message: "User already Exist" })
        const newUser = await User.create({
            username,
            password,
            email,
        })
        newUser.save()

        return res.status(200).json({ message: "User registered successfully." })
    } catch (error: any) {
        return res.status(500).json({
            message: "Error registring user.",
            error: error.message
        })
    }
}

const userLogin = async (req: Request, res: Response) => {
    try {
        const { password, email } = req.body
        if (!password || !email) return res.status(401).json({ message: "All fields required." })
        const existingUser = await User.findOne({ email: email })
        if (!existingUser) return res.status(401).json({ message: "User doesn't Exist" })
        const isMatch = existingUser.isPasswordCorrect(password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong email or password."
            });
        }
        const payload = {
            id: existingUser._id,
            email,
        }
        const accessToken = generateToken(
            payload,
            config.accessTokenSecret,
            { expiresIn: config.accessTokenExpiry }
        );

        const refreshToken = generateToken(
            payload,
            config.refreshTokenSecret,
            { expiresIn: config.refreshTokenExpiry }
        );
        const cookieToken = generateToken(
            payload,
            config.jwtSecret,
            { expiresIn: config.jwtExpiry }
        );
        const cookieOption: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000
        };
        existingUser.refreshTokens = refreshToken
        existingUser.accessToken = accessToken
        res.cookie("cookieToken", cookieToken, cookieOption)
        existingUser.isVerified = true
        await existingUser.save()
        return res.status(200).json({ message: "User Login successfully." })
    } catch (error: any) {
        return res.status(500).json({
            message: "Error registring user.",
            error: error.message
        })
    }
}

const me = async (req: Request, res: Response) => {
    return res.json({
        message: "me page"
    })
}
export {
    userRegistration,
    userLogin,
    me
}