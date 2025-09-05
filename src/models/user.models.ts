import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

// Define an interface for TypeScript
export interface IUser extends Document {
  username: string;
  email: string;
  fullName?: string;
  accessToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  password: string;
  isVerified: boolean;
  refreshTokens: string;

  isPasswordCorrect(password: string): Promise<boolean>;
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
      default: false,
    },
    fullName: {
      type: String,
      trim: true,
    },
    accessToken: {
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
    this.password = await bcryptjs.hash(this.password, 10); // 10 = salt rounds
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

const User = mongoose.model<IUser>("User", userSchema);
export default User;
