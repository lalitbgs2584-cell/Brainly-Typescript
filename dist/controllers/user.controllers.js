"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.userLogin = exports.userRegistration = void 0;
const user_models_1 = __importDefault(require("../models/user.models"));
const generateAccessToken_1 = require("../utils/generateAccessToken");
const config_1 = require("../config");
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");
// ----------------------
// Zod Schemas
// ----------------------
const registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be at least 3 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: passwordSchema,
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
// ----------------------
// Registration Controller
// ----------------------
const userRegistration = async (req, res) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: result.error.format(),
            });
        }
        const { username, password, email } = result.data;
        const existingUser = await user_models_1.default.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "User already exists" });
        }
        const newUser = await user_models_1.default.create({ username, password, email });
        // No need for newUser.save() because create() already saves
        return res.status(200).json({ message: "User registered successfully." });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error registering user.",
            error: error.message,
        });
    }
};
exports.userRegistration = userRegistration;
// ----------------------
// Login Controller
// ----------------------
const userLogin = async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: result.error.format(),
            });
        }
        const { email, password } = result.data;
        const existingUser = await user_models_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: "User doesn't exist" });
        }
        const isMatch = await existingUser.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong email or password." });
        }
        const payload = { id: existingUser._id, email };
        const accessToken = (0, generateAccessToken_1.generateToken)(payload, config_1.config.accessTokenSecret, {
            expiresIn: config_1.config.accessTokenExpiry,
        });
        const refreshToken = (0, generateAccessToken_1.generateToken)(payload, config_1.config.refreshTokenSecret, {
            expiresIn: config_1.config.refreshTokenExpiry,
        });
        const cookieToken = (0, generateAccessToken_1.generateToken)(payload, config_1.config.jwtSecret, {
            expiresIn: config_1.config.jwtExpiry,
        });
        const cookieOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };
        // Save tokens to user document
        existingUser.accessToken = accessToken;
        existingUser.refreshTokens = refreshToken;
        existingUser.isVerified = true;
        await existingUser.save();
        // Set cookie
        res.cookie("cookieToken", cookieToken, cookieOption);
        return res.status(200).json({ message: "User login successfully." });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error logging in.",
            error: error.message,
        });
    }
};
exports.userLogin = userLogin;
// ----------------------
// Me Controller (protected route example)
// ----------------------
const me = async (req, res) => {
    return res.json({ message: "This is the me page" });
};
exports.me = me;
