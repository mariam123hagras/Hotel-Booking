import Offer from '../models/Offer.js';
import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from 'cloudinary';
import Room from '../models/Room.js';

// API to create an offer
export const createOffer = async(req,res)=>{
    try {
        const {title, description, expiryDate, discountValue, roomType} = req.body;
        
        // FIX: Use req.auth() as a function
        const auth = req.auth();
        const userId = auth.userId;
        
        const hotel = await Hotel.findOne({owner: userId});
        console.log('Hotel found:', hotel?._id);
        
        if(!hotel) {
            return res.status(404).json({success:false, message:"No Hotel found"});
        }
        
        console.log('Looking for ALL rooms with hotel:', hotel._id, 'roomType:', roomType);
        
        // Find ALL available rooms of this room type
        const rooms = await Room.find({
            hotel: hotel._id.toString(),
            isAvailable: true,
            roomType: roomType
        });
        
        console.log(`Found ${rooms.length} rooms of type "${roomType}"`);
        
        if(rooms.length === 0) {
            return res.status(404).json({
                success:false,
                message:`No available ${roomType} rooms found. Please add rooms to create an offer.`
            });
        }
        
        const expiry = new Date(expiryDate);
        const isActive = expiry > new Date();
        
        // Create an offer for EACH room
        const offers = [];
        
        for (const room of rooms) {
            try {
                const offer = await Offer.create({
                    hotel: hotel._id.toString(),
                    title,
                    description,
                    expiryDate: expiry,
                    isActive,
                    discountValue: Number(discountValue),  
                    room: room._id.toString(),
                    currentPricePerNight: room.pricePerNight - ((room.pricePerNight * discountValue) / 100)
                });
                offers.push(offer);
                room.onOffer = true;
                await room.save();
                console.log(`Created offer for room ${room._id}`);
            } catch (createError) {
                console.error(`Failed to create offer for room ${room._id}:`, createError.message);
                // Continue with other rooms even if one fails
            }
        }
        
        if (offers.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Failed to create any offers. Please try again."
            });
        }
        
        res.json({
            success: true,
            message: `Created ${offers.length} offer(s) for ${rooms.length} ${roomType} room(s)`,
            data: {
                count: offers.length,
                roomType: roomType,
                offers: offers.map(offer => ({
                    id: offer._id,
                    title: offer.title,
                    expiryDate: offer.expiryDate,
                    roomId: offer.room
                }))
            }
        });
        
    } catch (error) {
        console.error('ERROR in createOffer:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create offers"
        });
    }
}

// API to get all offers
export const getOffers= async(req,res)=>{
    try {
    const offers =await Offer.find({isActive:true})
            .populate({path:'hotel', select:'name address city'})  
            .populate({
                path: 'room',   
                select: 'images  amenities roomType'  
            }).sort({createdAt: -1})
            
             const filteredOffers = offers.filter(offer => new Date(offer.expiryDate) >= new Date());
            
           
   res.json({success:true,offers:filteredOffers})
    } catch (error) {
            res.json({success:false,message:error.message});
    }
}

// API to get all offers for a specific hotel

export const getOwnerOffers= async(req,res)=>{
    try {
        const hotelData= await Hotel.findOne({owner:req.auth().userId})
        const offers = await Offer.find({hotel: hotelData._id.toString()})
            .populate('hotel')
            .populate('room');
        if(!offers) return res.json({success:false,message:"No offers found"})
        res.json({success:true,offers})
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}
    
// API to toggle an offer
export const toggleOffer= async(req,res)=>{
    try {
        const {offerId}=req.params;
        const hotelData= await Hotel.findOne({owner:req.auth().userId})
        const offerData= await Offer.findById(offerId);
        if(!offerData) return res.json({success:false,message:"Offer not found"})
        if(offerData.hotel.toString() !== hotelData._id.toString()){
            return res.json({success:false,message:"You are not authorized to delete this offer"})
        }
        await Offer.findByIdAndUpdate(offerId,{isActive:!offerData.isActive});
        res.json({success:true,message:"Offer toggled successfully"})
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}