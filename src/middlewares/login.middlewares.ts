import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthenticatedRequest } from "../types";

export const isLoggedIn = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["cookieToken"];
    if (!token) return res.status(401).json({ message: "Token not found" });

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.decodedToken = decoded; // ✅ TS knows this property exists

    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
