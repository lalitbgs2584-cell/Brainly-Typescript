import mongoose, { Schema } from "mongoose";
import "./tag.models"
import User from "./user.models";

const contentTypes = ['image','video','article','audio']

const contentSchema = new Schema({
  link: { type: String, required: true },
  title: { type: String, required: true },
  type: {
    type: String, enum: contentTypes, required: true
  },
  tags: [{
    type: mongoose.Types.ObjectId,
    ref: "Tag"
  }],
  publisher: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Content = mongoose.model("Content", contentSchema);
export default Content;
