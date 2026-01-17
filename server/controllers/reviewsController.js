import Bookings from "../models/Bookings.js";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const {_id}=req.user;
    console.log('User ID from auth:', _id);
    const userBooking= await Bookings.findOne({user:_id,status:"confirmed"}).populate('hotel');
    
    console.log("Query reached");

    console.log('User Booking:', userBooking);

    if(!userBooking){
      return res.json({success:false,message:"You can only leave a review after completing a booking."})
    }
    const {  review } = req.body;
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
            .populate('user', 'username email');
            
           
        res.json({ success: true, reviews });
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.error("Error fetching reviews:", error);
    }                   

};