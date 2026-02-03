import { messageInRaw } from "svix";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";


export const registerHotel= async (req,res)=>{
    try {
  const {name,address,contact,city}=req.body

  const owner=req.user._id

  //Check if User Already Registered
  const hotel= await Hotel.findOne({owner})
  if(hotel){
    return res.json({success:false,message:"Hotel Already Registered"})
  }

  await Hotel.create({name,address,contact,city,owner});
  await User.findByIdAndUpdate(owner,{role:"hotelOwner"});
  res.json({success:true,message:"Hotel Registered Successfully"})
    }
    catch(error){
         res.json({success:false,message:error.message});

    }
}
 export const gitHotelsCities=async(req,res)=>{
   try{
  const hotels=await Hotel.find()
  console.log(hotels)
 const cities = [...new Set(hotels.map(hotel => hotel.city.toLowerCase()))];
  console.log(cities)
  res.json({success:true,cities})
}
  catch(err){
    res.json({success:false,err})
  }
  

}