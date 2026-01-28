import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSearchedCities } from '../controllers/userController.js';
import { addSubscriber } from '../controllers/SubscribersController.js';

const userRouter=express.Router();

userRouter.get('/',protect,getUserData);
userRouter.post('/store-recent-search',protect,storeRecentSearchedCities);
userRouter.post('/subscribe',addSubscriber);




export default userRouter;