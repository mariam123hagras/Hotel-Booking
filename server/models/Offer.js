import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    room:{type:String,ref:"Room",required:true},
    hotel:{type:String,ref:"Hotel",required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    expiryDate:{type:Date,required:true},
    isActive:{type:Boolean,default:true},
    discountValue:{type:Number,required:true},
    currentPricePerNight:{type:Number},
    

   
},{timestamps:true});

const Offer= mongoose.model('Offer',offerSchema);
export default Offer;