import mongoose, { Schema } from "mongoose";

const linkSchema = new Schema({
  hash: { type: String, required: true, unique: true },
  userLink: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Index for faster lookup
linkSchema.index({ hash: 1 });

const Link = mongoose.model("Link", linkSchema);
export default Link;