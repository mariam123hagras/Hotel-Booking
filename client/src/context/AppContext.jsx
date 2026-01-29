import axios from 'axios';
import { createContext, useContext, useEffect,useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser,useAuth} from "@clerk/clerk-react";
import {toast} from 'react-hot-toast';


axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;

const AppContext=createContext();

export const AppProvider=({children})=>{
   const currency= import.meta.env.VITE_CURRENCY || "$"
   const navigate=useNavigate();
   const {user}= useUser();
   const {getToken} = useAuth();
   const [isOwner,setIsOwner]=useState(false)
   const [showHotelReg,setShowHotelReg]=useState(false)
   const [showReviewForm,setShowReviewForm]=useState(false)
   const [review,setReview]=useState({
    comment:'', stars:0
   })
   const [testimonials,setTestimonials]=useState([])
   const [searchedCities,setSearchedCities]= useState([])
   const [rooms,setRooms]= useState([])
   const [offers,setOffers]= useState([])

   const fetchRooms=async(city)=>{
    try {
      
      const {data}=await axios.get('/api/rooms')
   
      if(data?.success){setRooms(data.rooms)}
      else{toast.error(data.message)}
    } catch (error) {
      toast.error(error.message)
    }
   }

   const fetchOffers=async()=>{
    try {
      const {data}=await axios.get('/api/offers')
       if (data?.success) {
      setOffers(data.offers);
      
    }
     
      else{toast.error(data.message)}

    } catch (error) {
      toast.error(error.message)
    }
   }

   const fetchUser=async()=>{
  try {
    
    const token =await getToken()
   const {data}= await axios.get('/api/user',{headers:{
        Authorization:`Bearer ${token}`
    }})
  


    
    if(data.success){
        setIsOwner(data.role==='hotelOwner')
        setSearchedCities(data.recentSearchedCities)   
    }
    else{
        // Retry Fetching User Details after 5 seconds
        setTimeout(()=>{
            fetchUser()
        },5000)
    }
  } catch (error) {
    toast.error(error.message)
  }

   }
   const fetchReviews=async()=>{
    try {
      const {data}=await axios.get('/api/reviews')

      if(data?.success){
        setTestimonials(data.reviews)
       
      }else{toast.error(data.message)} 

      
      
    } catch (error) {
      toast.error(error.message)
    }
    }
      // Function to calculate average rating for a room
    const averageRating = (testimonials,room) => {

    const hotelRates = testimonials.filter(testimonial => testimonial.hotel === room.hotel.name)
    
    if(hotelRates.length === 0) return 0
    const totalStars = hotelRates.reduce((acc, curr) => acc + curr.rating, 0)
    return {
      stars: (totalStars / hotelRates.length).toFixed(1),
      count: hotelRates.length}
  }

   useEffect(()=>{
  if(user){
    fetchUser();
  }
   },[user])
   useEffect(()=>{
    fetchRooms()
    fetchOffers()
    fetchReviews()
   },[])
   const value={
    currency,navigate,user,getToken,isOwner,setIsOwner,showHotelReg,setShowHotelReg,showReviewForm,setShowReviewForm,axios,
     searchedCities,setSearchedCities,rooms,setRooms,offers,setOffers,review,setReview,testimonials,averageRating
   }
return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
)
}

export const useAppContext = ()=>useContext(AppContext);