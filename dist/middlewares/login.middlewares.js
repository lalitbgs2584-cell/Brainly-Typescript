"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const isLoggedIn = async (req, res) => {
    try {
        const token = req.cookies["cookieToken"];
        if (!token) {
            return res.status(404).json({
                message: "Token not found"
            });
        }
        console.log(token);
        const decodeToken = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        console.log(decodeToken);
        res.json({ decodeToken });
    }
    catch (error) {
        return res.status(404).json({
            message: error.message
        });
    }
};
exports.isLoggedIn = isLoggedIn;
