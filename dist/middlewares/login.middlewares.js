"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies["cookieToken"];
        if (!token)
            return res.status(401).json({ message: "Token not found" });
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.decodedToken = decoded; // ✅ TS knows this property exists
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.isLoggedIn = isLoggedIn;
