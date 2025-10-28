import User from "../models/User.js";
import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    // Get the userId from Clerk's authentication
    const { userId } = getAuth(req);
    console.log("Authenticated Clerk userId:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // Find user by clerkUserId (not the MongoDB _id)
    // This assumes you've stored the Clerk userId in your User model as clerkUserId
    const user = await User.findOne({ _id: userId });
    
    console.log("Fetched user:", user);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};