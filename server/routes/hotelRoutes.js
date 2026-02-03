import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { gitHotelsCities, registerHotel } from "../controllers/hotelController.js";

const hotelRouter=express.Router();


hotelRouter.post('/',protect,registerHotel)
hotelRouter.get('/',gitHotelsCities)


export default hotelRouter;