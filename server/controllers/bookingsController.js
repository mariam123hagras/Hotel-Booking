import Room from "../models/Room.js";

//Function to Check Availability of Room


import Bookings from "../models/Bookings.js";
import Hotel from "../models/Hotel.js";
import Offer from "../models/Offer.js";
import transporter from "../configs/nodemailer.js";
import stripe from "stripe";


const checkAvailability= async({checkInDate,checkOutDate,room})=>{
    try {
        const bookings= await Bookings.find({
            room,
            checkInDate:{$lte:checkOutDate},
            checkOutDate:{$gte:checkInDate},
        })
      const isAvailable=  bookings.length===0;
      
        return isAvailable;

    } catch (error) {
        console.error(error.message);
    }
}


// API to check availability of room
// POST /api/bookings/check-availability

  export const checkAvailabilityAPI= async(req,res)=>{
    try {
        const {room,checkInDate,checkOutDate}=req.body;
        if (!room || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "room, checkInDate, and checkOutDate are required"
            });}
            
        const isAvailable=await checkAvailability({checkInDate,checkOutDate,room});
        res.json({success:true,isAvailable})
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

export const createBooking = async (req, res) => {
  let booking;
  try {
    const { room,offer, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    // console.log("Booking attempt:", { room, checkInDate, checkOutDate, guests, user });

    // Convert dates to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    // Validate dates
    if (checkIn >= checkOut) {
      return res.status(400).json({ 
        success: false, 
        message: "Check-out date must be after check-in date" 
      });
    }
    let roomId=room;
    let pricePerNight;
    if(offer){
      const offerData= await Offer.findById(offer);
      if(!offerData){
        return res.status(404).json({
          success:false,
          message:"Offer not found"
        })
      }
      if(new Date(offerData.expiryDate)<new Date()){
        offerData.isActive=false;
        return res.status(400).json({
          success:false,
          message:"Offer has expired"
        })
      }
      roomId=offerData.room;
      pricePerNight=offerData.currentPricePerNight;
      
    }

    // Check availability
    const isAvailable = await checkAvailability({ 
      checkInDate: checkIn, 
      checkOutDate: checkOut, 
      room : roomId
    });
    
    if (!isAvailable) {
      return res.status(400).json({ 
        success: false, 
        message: "Room is not available for the selected dates" 
      });
    }
   

    // Get room data
    const roomData = await Room.findById(roomId).populate("hotel");
    if (!roomData) {
      return res.status(404).json({ 
        success: false, 
        message: "Room not found" 
      });
    }
    if(!pricePerNight)pricePerNight=roomData.pricePerNight;

    // Calculate total price
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = pricePerNight * nights;
    

    // Create booking
    booking = await Bookings.create({
      user,
      room: roomId,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: 'pending'
    });

    // console.log("Booking created successfully:", booking._id);

    // Try to send email (but don't fail the booking if email fails)
    try {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: req.user.email,
        subject: "Hotel Booking Confirmation",
        html: `
        <h2>Your Booking Confirmation</h2>
        <p>Dear ${req.user.username},</p>
        <p>Thank you for booking with us! Here are your booking details:</p>
        <ul>
            <li><strong>Booking ID:</strong> ${booking._id}</li>   
            <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>   
            <li><strong>Room Type:</strong> ${roomData.roomType}</li>   
            <li><strong>Location:</strong> ${roomData.hotel.address}</li>   
            <li><strong>Check-in Date:</strong> ${checkIn.toDateString()}</li>   
            <li><strong>Check-out Date:</strong> ${checkOut.toDateString()}</li>   
            <li><strong>Number of Nights:</strong> ${nights}</li>   
            <li><strong>Guests:</strong> ${guests}</li>   
            <li><strong>Total Amount:</strong> ${process.env.CURRENCY || '$'} ${totalPrice}</li>   
        </ul>
        <p>We look forward to welcoming you!</p>
        <p>If you need to make any changes, feel free to contact us</p>
        `
      };

      await transporter.sendMail(mailOptions);
      // console.log("Confirmation email sent successfully to:", req.user.email);
      
    } catch (emailError) {
      console.error("Failed to send email, but booking was created:", emailError);
      // Don't throw error here - booking was successful
    }

    res.json({ 
      success: true, 
      message: "Booking created successfully",
      bookingId: booking._id 
    });

  } catch (error) {
    console.log("Booking creation failed:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Booking creation failed" 
    });}
};

//API to get all bookings for a user
//GET /api/bookings/user



export const getUserBookings = async (req, res) => {
  try {
    // console.log("req.user:", req.user);
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const bookings = await Bookings.find({ user: req.user._id })
      .populate("room")
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("getUserBookings error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch bookings" });
  }
};




export const getHotelBookings = async (req, res) => {
  try {
    // console.log("User in getHotelBookings:", req.user);
    
    // Find hotel by owner ID (using req.user._id from your protect middleware)
    const hotel = await Hotel.findOne({ owner: req.user._id });
    
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found for this user" });
    }
    
    // console.log("Found hotel:", hotel);
    
    // Find bookings for this hotel
    const bookings = await Bookings.find({ hotel: hotel._id })
      .populate("room")
      .populate("hotel")
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    
    // console.log("Found bookings:", bookings.length);
    
    // Total Bookings
    const totalBookings = bookings.length;
    
    // Total Revenue (only from paid bookings)
    const totalRevenue = bookings
      .filter(booking => booking.isPaid)
      .reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings
      }
    });
  } catch (error) {
    console.error("getHotelBookings error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings: ' + error.message
    });
  }
};

export const stripePayment=async(req,res)=>{
try {
  // console.log('Stripe payment initiated with body:', req.body);
  const {bookingId}=req.body;
  // console.log('Initiating payment for booking ID:', bookingId);

  const booking = await Bookings.findById(bookingId);

  const roomData=await Room.findById(booking.room).populate('hotel');
  
  const totalPrice=booking.totalPrice;
  const {origin}=req.headers;

  const stripeInstance= new stripe(process.env.STRIPE_SECRET_KEY);
  const line_items=[{price_data:{
    currency:'usd',
    product_data:{name:roomData.hotel.name},
    unit_amount:totalPrice*100
  },
   quantity: 1 },
 
  ]
  //Create Checkout Session
  const session=await stripeInstance.checkout.sessions.create({
    line_items,
    mode:'payment',
    success_url:`${origin}/loader/my-bookings`,
    cancel_url:`${origin}/my-bookings`,
    metadata:{bookingId: bookingId.toString()}
  });
    // console.log(' Stripe session created with metadata:', session.metadata);
  res.json({success:true,url:session.url})
} catch (error) {
  res.json({success:false,message:"Payment failed"})
  console.error("Stripe Payment Error:", error.message);

}
}
   

