import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { createOffer, getOffers, getOwnerOffers, renewOffer, toggleOffer } from '../controllers/offerController.js';

const offerRouter= express.Router();

offerRouter.post('/',protect,createOffer);
offerRouter.get('/',getOffers);
offerRouter.get('/owner',protect,getOwnerOffers);
offerRouter.post('/toggle/:offerId',protect,toggleOffer);
offerRouter.post('/renew/:offerId',protect,renewOffer);
export default offerRouter;
      