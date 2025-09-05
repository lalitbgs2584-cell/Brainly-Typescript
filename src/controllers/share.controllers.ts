import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import Link from "../models/link.models"; // your Link schema
import { nanoid } from "nanoid"; // for generating short hash links

// ----------------------
// Create / Share a link
// ----------------------
const shareLink = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.decodedToken;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ message: "originalUrl is required" });

    // Generate a short unique hash
    const hash = nanoid(8);

    const newLink = await Link.create({
      hash,
      userLink: user.id,
      originalUrl,
    });

    return res.status(201).json({ message: "Link created successfully", link: newLink });
  } catch (error: any) {
    return res.status(500).json({ message: "Error creating link", error: error.message });
  }
};

// ----------------------
// Get all links of logged-in user
// ----------------------
const getShareLink = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.decodedToken;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const links = await Link.find({ userLink: user.id });

    return res.status(200).json({ links });
  } catch (error: any) {
    return res.status(500).json({ message: "Error fetching links", error: error.message });
  }
};

export { shareLink, getShareLink };
