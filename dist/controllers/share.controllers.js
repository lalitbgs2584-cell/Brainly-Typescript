"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShareLink = exports.shareLink = void 0;
const link_models_1 = __importDefault(require("../models/link.models")); // your Link schema
const nanoid_1 = require("nanoid"); // for generating short hash links
// ----------------------
// Create / Share a link
// ----------------------
const shareLink = async (req, res) => {
    try {
        const user = req.decodedToken;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        const { originalUrl } = req.body;
        if (!originalUrl)
            return res.status(400).json({ message: "originalUrl is required" });
        // Generate a short unique hash
        const hash = (0, nanoid_1.nanoid)(8);
        const newLink = await link_models_1.default.create({
            hash,
            userLink: user.id,
            originalUrl,
        });
        return res.status(201).json({ message: "Link created successfully", link: newLink });
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating link", error: error.message });
    }
};
exports.shareLink = shareLink;
// ----------------------
// Get all links of logged-in user
// ----------------------
const getShareLink = async (req, res) => {
    try {
        const user = req.decodedToken;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        const links = await link_models_1.default.find({ userLink: user.id });
        return res.status(200).json({ links });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching links", error: error.message });
    }
};
exports.getShareLink = getShareLink;
