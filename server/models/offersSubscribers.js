import mongoose from "mongoose";
const subscriberSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
},{timestamps:true});
const OffersSubscriber= mongoose.model('OffersSubscriber',subscriberSchema);
export default OffersSubscriber;