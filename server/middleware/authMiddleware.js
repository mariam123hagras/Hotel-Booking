import User from "../models/User.js";
import { getAuth } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
   
    if (!userId) {
      return res..json({ success: false, message: "Not authorized" });
    }

    // Find user by the Clerk userId (this should match the _id in your database)
    const user = await User.findById(userId);
    
   
    if (!user) {
      console.log("User not found in database, might be webhook issue");
      return res.status(404).json({ 
        success: false, 
        message: "User not found in database" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Authentication failed" 
    });
  }
};