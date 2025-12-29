import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { createOffer, getOffers, getOwnerOffers, toggleOffer } from '../controllers/offerController.js';

const offerRouter= express.Router();

offerRouter.post('/',upload.array('images',4),protect,createOffer);
offerRouter.get('/',getOffers);
offerRouter.get('/owner',protect,getOwnerOffers);
offerRouter.post('/toggle/:offerId',protect,toggleOffer);
export default offerRouter;
      