import Bookings from "../models/Bookings.js";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";
import Joi from "joi";
import xss from "xss";



const schema = Joi.object({
    review: Joi.object({
        comment: Joi.string().min(10).max(500).required(),
        stars: Joi.number().min(1).max(5).required()
    }).required()
});




export const createReview = async (req, res) => {
  try {
    
    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({ success: false, message: "Enter a number between 1 and 5 for stars." });
    }

    const {_id}=req.user;
    console.log('User ID from auth:', _id);
    const userBooking= await Bookings.findOne({user:_id,status:"confirmed"}).populate('hotel');
    
    console.log("Query reached");

    console.log('User Booking:', userBooking);

    if(!userBooking){
      return res.json({success:false,message:"You can only leave a review after completing a booking."})
    }
    const {  review } = req.body;
    review.comment = xss(review.comment);
    const newReview = new Review({
        user: _id,
        hotel: userBooking.hotel.name,
        rating: review.stars,
        comment: review.comment
    });
    await newReview.save();
    res.json({ success: true, message: "Review created successfully", review: newReview });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPlatformReviews = async (req, res) => {
    try {   
        const reviews = await Review.find()
            .populate('user', 'username email image');
            
           
        res.json({ success: true, reviews });
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.error("Error fetching reviews:", error);
    }                   

};