import express from 'express'
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';
import offerRouter from './routes/offerRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import helmet from "helmet";
import rateLimit from "express-rate-limit";





connectDB();
connectCloudinary();

const app=express()
// Set security HTTP headers
app.use(helmet());
//Enable Cross-Origin Resource Sharing

const allowedOrigins = process.env.CORS_ORIGINS.split(',');


app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true,
}));


// API to listen to Stripe Webhooks
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks);
// Middle ware
app.use(express.json())
app.use(clerkMiddleware())

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)  
});
app.use(limiter);

// API to listen to Clerk Webhooks
app.use('/api/clerk',clerkWebhooks);
app.get('/',(req,res)=>res.send('API is working'))
app.use('/api/user',userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings',bookingRouter)
app.use('/api/offers',offerRouter);
app.use('/api/reviews',reviewRouter);

const PORT=process.env.PORT ||3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));