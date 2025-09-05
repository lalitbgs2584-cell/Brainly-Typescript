import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema({
  link: { type: String, required: true },
  title: { type: String, required: true },
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
