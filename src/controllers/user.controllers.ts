import { Request, Response, CookieOptions } from "express";
import User from "../models/user.models";
import { generateToken } from "../utils/generateAccessToken";
import { config } from "../config";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

// ----------------------
// Zod Schemas
// ----------------------
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password:passwordSchema,
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ----------------------
// Registration Controller
// ----------------------
const userRegistration = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.format(),
      });
    }

    const { username, password, email } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const newUser = await User.create({ username, password, email });
    // No need for newUser.save() because create() already saves
    return res.status(200).json({ message: "User registered successfully." });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error registering user.",
      error: error.message,
    });
  }
};

// ----------------------
// Login Controller
// ----------------------
const userLogin = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.format(),
      });
    }

    const { email, password } = result.data;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    const isMatch = await existingUser.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong email or password." });
    }

    const payload = { id: existingUser._id, email };

    const accessToken = generateToken(payload, config.accessTokenSecret, {
      expiresIn: config.accessTokenExpiry,
    });

    const refreshToken = generateToken(payload, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiry,
    });

    const cookieToken = generateToken(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiry,
    });

    const cookieOption: CookieOptions = {
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Error logging in.",
      error: error.message,
    });
  }
};

// ----------------------
// Me Controller (protected route example)
// ----------------------
const me = async (req: Request, res: Response) => {
  return res.json({ message: "This is the me page" });
};

// ----------------------
// Export controllers
// ----------------------
export { userRegistration, userLogin, me };
