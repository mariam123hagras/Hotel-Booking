import Offer from '../models/Offer.js';
import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from 'cloudinary';

// API to create an offer
export const createOffer= async(req,res)=>{
    try {
        const {title,description,priceOff,expiryDate}=req.body;
        const hotel= await Hotel.findOne({owner:req.auth().userId})
        if(!hotel)  return res.json({success:false,message:"No Hotel found"})
        //upload images to cloudinary
    const uploadImages= req.files.map(async(file)=>{
   const response  = await cloudinary.uploader.upload(file.path);
   return response.secure_url;
    })
    // Wait for all uploads to complete 
    const images =   await Promise.all(uploadImages)
    await Offer.create({
        hotel:hotel._id,
        title,
        description,
        images,
        priceOff:+priceOff,
        expiryDate,
    })
    res.json({success:true ,message:"Offer created successfully"})
        } catch (error) {
       res.json({success:false,message:error.message})  
    }       
}

// API to get all offers
export const getOffers= async(req,res)=>{
    try {
   const offers=await Offer.find().populate('hotel').sort({createdAt:-1})
   res.json({success:true,offers})
    } catch (error) {
            res.json({success:false,message:error.message});
    }
}

// API to get all offers for a specific hotel

export const getOwnerOffers= async(req,res)=>{
    try {
        const hotelData= await Hotel.findOne({owner:req.auth().userId})
        const offers=await Offer.find({hotel:hotelData._id.toString()}).populate('hotel');
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