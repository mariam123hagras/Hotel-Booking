import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: "string",
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  hotel: {
    type: "string",
    ref: "Hotel",
    required: true
  },
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);