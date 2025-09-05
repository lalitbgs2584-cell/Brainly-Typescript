"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.getContent = exports.addContent = void 0;
const content_models_1 = __importDefault(require("../models/content.models"));
const zod_1 = require("zod");
// ----------------------
// Zod Schema for Adding Content
// ----------------------
const addContentSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    link: zod_1.z.string().url("Link must be a valid URL"),
    type: zod_1.z.enum(['image', 'video', 'article', 'audio'], "Invalid content type"),
    tags: zod_1.z.array(zod_1.z.string()).optional(), // Array of Tag IDs
});
// ----------------------
// Add Content
// ----------------------
const addContent = async (req, res) => {
    try {
        const user = req.decodedToken;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        const parseResult = addContentSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ message: "Validation error", errors: parseResult.error.format() });
        }
        const { title, link, type, tags } = parseResult.data;
        const newContent = await content_models_1.default.create({
            title,
            link,
            type,
            tags,
            publisher: user.id,
        });
        return res.status(201).json({ message: "Content added successfully", content: newContent });
    }
    catch (error) {
        return res.status(500).json({ message: "Error adding content", error: error.message });
    }
};
exports.addContent = addContent;
// ----------------------
// Get Content
// ----------------------
const getContent = async (req, res) => {
    try {
        const user = req.decodedToken;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        // Populate publisher and tags
        const contents = await content_models_1.default.find({ publisher: user.id })
            .populate("publisher", "username email") // only fetch username and email
            .populate("tags", "title"); // only fetch tag titles
        return res.status(200).json({ contents });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching content", error: error.message });
    }
};
exports.getContent = getContent;
// ----------------------
// Delete Content
// ----------------------
const deleteContent = async (req, res) => {
    try {
        const user = req.decodedToken;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;
        const content = await content_models_1.default.findById(id);
        if (!content || !content.publisher)
            return res.status(404).json({ message: "Content not found" });
        if (content.publisher.toString() !== user.id)
            return res.status(403).json({ message: "You can only delete your own content" });
        await content.deleteOne();
        return res.status(200).json({ message: "Content deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting content", error: error.message });
    }
};
exports.deleteContent = deleteContent;
