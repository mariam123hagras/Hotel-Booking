import Offer from '../models/Offer.js';
import Hotel from "../models/Hotel.js";
import Room from '../models/Room.js';
import OffersSubscriber from '../models/offersSubscribers.js';
import transporter from '../configs/nodemailer.js';



// API to create an offer
export const createOffer = async (req, res) => {
  try {
    const { title, description, expiryDate, discountValue, roomType } = req.body;

    const { userId } = req.auth();
    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) {
      return res.status(404).json({ success: false, message: "No Hotel found" });
    }

    const rooms = await Room.find({
      hotel: hotel._id,
      isAvailable: true,
      roomType
    });

    if (!rooms.length) {
      return res.status(404).json({
        success: false,
        message: `No available ${roomType} rooms found`
      });
    }

    const expiry = new Date(expiryDate);
    const isActive = expiry > new Date();

    //  Create offers
    var offer;
    for (const room of rooms) {
       offer = await Offer.create({
        hotel: hotel._id,
        title,
        description,
        expiryDate: expiry,
        isActive,
        discountValue: Number(discountValue),
        room: room._id,
        currentPricePerNight:
          room.pricePerNight - (room.pricePerNight * discountValue) / 100
      });

      room.onOffer = true;
      await room.save();
      
    }

    //  Send ONE email per subscriber
    const subscribers = await OffersSubscriber.find();
    
    const offersHTML = 
      
       `
        <li>
          <strong>${offer.title}</strong><br/>
          Discount: ${offer.discountValue}%<br/>
          Expires: ${offer.expiryDate.toDateString()}
        </li>`
   
      
      

    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: subscriber.email,
        subject: `New Offers from ${hotel.name}`,
        html: `
          <h2>New Offers Available</h2>
          <ul>${offersHTML}</ul>
        `
      });
    }

    res.json({
      success: true,
      message: `Created offer and notified subscribers`,
      data: offer
    });

  } catch (error) {
    console.error("ERROR in createOffer:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create offers"
    });
  }
};

// API to get all offers
export const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true })
            .populate({ path: 'hotel', select: 'name address city' })
            .populate({
                path: 'room',
                select: 'images  amenities roomType'
            }).sort({ createdAt: -1 })

        const filteredOffers = offers.filter(offer => new Date(offer.expiryDate) >= new Date());


        res.json({ success: true, offers: filteredOffers })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get all offers for a specific hotel

export const getOwnerOffers = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth().userId })
        const offers = await Offer.find({ hotel: hotelData._id.toString() })
            .populate('hotel')
            .populate('room');
        if (!offers) return res.json({ success: false, message: "No offers found" })
        res.json({ success: true, offers })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to toggle an offer
export const toggleOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const hotelData = await Hotel.findOne({ owner: req.auth().userId })
        const offerData = await Offer.findById(offerId);
        if (!offerData) return res.json({ success: false, message: "Offer not found" })
        if (offerData.hotel.toString() !== hotelData._id.toString()) {
            return res.json({ success: false, message: "You are not authorized to delete this offer" })
        }
        if (offerData.expiryDate < new Date()) {
            const expired = true;
            return res.json({ success: false, message: "Cannot toggle an expired offer, please renew it first.", expired })
        }
        await Offer.findByIdAndUpdate(offerId, { isActive: !offerData.isActive });
        res.json({ success: true, message: "Offer toggled successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const renewOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const { newExpiryDate } = req.body;
        const hotelData = await Hotel.findOne({ owner: req.auth().userId })
        const offerData = await Offer.findById(offerId);
        if (!offerData) return res.json({ success: false, message: "Offer not found" })
        if (offerData.hotel.toString() !== hotelData._id.toString()) {
            return res.json({ success: false, message: "You are not authorized to renew this offer" })
        }
        const newExpiry = new Date(newExpiryDate);
        await Offer.findByIdAndUpdate
            (offerId, { expiryDate: newExpiry, isActive: true });
        const offerSubcribers = await OffersSubscriber.find();
        for (const subscriber of offerSubcribers) {
            // Send email to each subscriber
            console.log(`Sending offer email to subscriber: ${subscriber.email} for offer: ${offer.title}`);

            const emailOptions = {
                from: process.env.SENDER_EMAIL,
                to: subscriber.email,
                subject: `New Offer: ${offer.title}`,
                html: `<h1>${offer.title}</h1>
                               <p>${offer.description}</p>
                               <p>Hotel: ${offer.hotel}%</p>
                               <p>Discount: ${offer.discountValue}%</p>
                               <p>Expires on: ${offer.expiryDate.toDateString()}</p>
                               <p>Book now at our hotel!</p>`
            };

            transporter.sendMail(emailOptions);
            console.log(`Renewal email sent to subscriber: ${subscriber.email} for offer: ${offer.title}`);
        }
        res.json({ success: true, message: "Offer renewed successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}     