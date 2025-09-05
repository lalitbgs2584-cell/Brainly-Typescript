"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.userLogin = exports.userRegistration = void 0;
const user_models_1 = __importDefault(require("../models/user.models"));
const generateAccessToken_1 = require("../utils/generateAccessToken");
const config_1 = require("../config");
const userRegistration = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email)
            return res.status(401).json({ message: "All fields required." });
        const existingUser = await user_models_1.default.findOne({ email: email });
        if (existingUser)
            return res.status(401).json({ message: "User already Exist" });
        const newUser = await user_models_1.default.create({
            username,
            password,
            email,
        });
        newUser.save();
        return res.status(200).json({ message: "User registered successfully." });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error registring user.",
            error: error.message
        });
    }
};
exports.userRegistration = userRegistration;
const userLogin = async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!password || !email)
            return res.status(401).json({ message: "All fields required." });
        const existingUser = await user_models_1.default.findOne({ email: email });
        if (!existingUser)
            return res.status(401).json({ message: "User doesn't Exist" });
        const isMatch = existingUser.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong email or password."
            });
        }
        const payload = {
            id: existingUser._id,
            email,
        };
        const accessToken = (0, generateAccessToken_1.generateToken)(payload, config_1.config.accessTokenSecret, { expiresIn: config_1.config.accessTokenExpiry });
        const refreshToken = (0, generateAccessToken_1.generateToken)(payload, config_1.config.refreshTokenSecret, { expiresIn: config_1.config.refreshTokenExpiry });
        const cookieToken = (0, generateAccessToken_1.generateToken)(payload, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiry });
        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        };
        existingUser.refreshTokens = refreshToken;
        existingUser.accessToken = accessToken;
        res.cookie("cookieToken", cookieToken, cookieOption);
        existingUser.isVerified = true;
        await existingUser.save();
        return res.status(200).json({ message: "User Login successfully." });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error registring user.",
            error: error.message
        });
    }
};
exports.userLogin = userLogin;
const me = async (req, res) => {
    return res.json({
        message: "me page"
    });
};
exports.me = me;
