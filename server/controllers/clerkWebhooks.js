import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers = {
            "svix-id": req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), headers);

        // Getting data from request body
        const { data, type } = req.body;
       

        // Validate required data
        if (!data || !data.id) {
            throw new Error("Invalid webhook data: missing user ID");
        }

        // Safe data extraction with comprehensive fallbacks
        const getEmail = (userData) => {
            // Check if email_addresses exists and has at least one item
            if (userData.email_addresses && userData.email_addresses.length > 0) {
                return userData.email_addresses[0].email_address;
            }
            
        
        };

        const getUsername = (userData) => {
            // Try first_name + last_name
            if (userData.first_name || userData.last_name) {
                return `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            }
            
            // Try username field
            if (userData.username) {
                return userData.username;
            }
            
    
        };

        const getImage = (userData) => {
            return userData.image_url || userData.profile_image_url || '';
        };

     

        // console.log("Processed user data for DB:", userData);

        // Switch Case for different Events
        switch (type) {
            case "user.created": {
                   const userData = {
            _id: data.id,
            email: getEmail(data),
            username: getUsername(data),
            image: getImage(data),
        };
                // Check if user already exists to avoid duplicates
                const existingUser = await User.findById(data.id);
                if (existingUser) {
                    console.log("User already exists, updating instead:", data.id);
                    await User.findByIdAndUpdate(data.id, userData, { new: true });
                } else {
                    await User.create(userData);
                    console.log("User Created:", data.id);
                }
                break;
            }
            case "user.updated": {
                   const userData = {
            _id: data.id,
            email: getEmail(data),
            username: getUsername(data),
            image: getImage(data),
        };
                await User.findByIdAndUpdate(data.id, userData, { 
                    new: true,
                    runValidators: true 
                });
                console.log("User Updated:", data.id);
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                console.log("User Deleted:", data.id);
                break;
            }
            default:
                console.log("Unhandled webhook type:", type);
                break;
        }

        res.json({ success: true, message: 'Webhook Received' });

    } catch (error) {
        console.error("Webhook error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            success: false, 
            message: error.message,
            details: "Check server logs for more information"
        });
    }
}

export default clerkWebhooks;