import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    hotel:{type:String,ref:"Hotel",required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    images:[{type:String}],
    priceOff:{type:Number,required:true},
    expiryDate:{type:Date,required:true},
    amenities:{type:Array,required:true},
    pricePerNight:{type:Number,required:true},
    roomType:{type:String,required:true},
},{timestamps:true});

const Offer= mongoose.model('Offer',offerSchema);
export default Offer;