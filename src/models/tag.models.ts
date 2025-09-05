import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  }
}, { timestamps: true });

// Add index for fast lookup
tagSchema.index({ title: 1 });

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
