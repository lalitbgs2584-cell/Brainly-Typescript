import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
// Define an interface for TypeScript (optional but recommended)
export interface IUser extends Document {
  username: string;
  email: string;
  fullName?: string;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  password: string;
  isVerified:boolean;
  refreshTokens: string[];

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    fullName: {
      type: String,
      trim: true,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: 6,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcryptjs.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as any);
  }
});

// Compare passwords
userSchema.methods.isPasswordCorrect = async function (password: string) {
  try {
    return await bcryptjs.compare(password, this.password);
  } catch (err) {
    return false;
  }
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    config.accessTokenSecret as string,
    { expiresIn: config.accessTokenExpiry || "15m" }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
