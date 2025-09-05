"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate Access Token
const generateToken = (payload, secret, options) => {
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateToken = generateToken;
