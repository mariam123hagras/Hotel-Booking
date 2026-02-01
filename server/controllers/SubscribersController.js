

import OffersSubscriber from "../models/offersSubscribers.js";


 export const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;
    const existingSubscriber = await OffersSubscriber.findOne({ email });
    // console.log('Existing Subscriber:', existingSubscriber);
    if (existingSubscriber) {
      return res.json({ error: "Email is already subscribed." });
    }
    const subscriber = await OffersSubscriber.create({ email });
    res.json({ success: true, subscriber ,message: "Subscribed successfully."});
  } catch (error) {
    
    console.error("Error adding subscriber:", error);
  }
};



