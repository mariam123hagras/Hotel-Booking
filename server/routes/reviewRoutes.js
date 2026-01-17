import { protect } from "../middleware/authMiddleware.js";
import express from "express";
import { createReview, getPlatformReviews } from "../controllers/reviewsController.js";
const reviewRouter = express.Router();

reviewRouter.post("/", protect, createReview);
reviewRouter.get("/", getPlatformReviews);
export default reviewRouter;

