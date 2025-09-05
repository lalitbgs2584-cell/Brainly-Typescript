import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import Content from "../models/content.models";
import { z } from "zod";

// ----------------------
// Zod Schema for Adding Content
// ----------------------
const addContentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  link: z.string().url("Link must be a valid URL"),
  type: z.enum(['image', 'video', 'article', 'audio'], "Invalid content type"),
  tags: z.array(z.string()).optional(), // Array of Tag IDs
});

// ----------------------
// Add Content
// ----------------------
const addContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.decodedToken;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const parseResult = addContentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Validation error", errors: parseResult.error.format() });
    }

    const { title, link, type, tags } = parseResult.data;

    const newContent = await Content.create({
      title,
      link,
      type,
      tags,
      publisher: user.id,
    });

    return res.status(201).json({ message: "Content added successfully", content: newContent });
  } catch (error: any) {
    return res.status(500).json({ message: "Error adding content", error: error.message });
  }
};

// ----------------------
// Get Content
// ----------------------
const getContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.decodedToken;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Populate publisher and tags
    const contents = await Content.find({ publisher: user.id })
      .populate("publisher", "username email") // only fetch username and email
      .populate("tags", "title"); // only fetch tag titles

    return res.status(200).json({ contents });
  } catch (error: any) {
    return res.status(500).json({ message: "Error fetching content", error: error.message });
  }
};

// ----------------------
// Delete Content
// ----------------------
const deleteContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.decodedToken;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const content = await Content.findById(id);

    if (!content || !content.publisher) return res.status(404).json({ message: "Content not found" });
    if (content.publisher.toString() !== user.id)
      return res.status(403).json({ message: "You can only delete your own content" });

    await content.deleteOne();
    return res.status(200).json({ message: "Content deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Error deleting content", error: error.message });
  }
};

export { addContent, getContent, deleteContent };
