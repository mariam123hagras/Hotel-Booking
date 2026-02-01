import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bestSellerRooms, setBestSellerRooms] = useState([]);
  const [review, setReview] = useState({
    comment: "",
    stars: 0,
  });
  const [testimonials, setTestimonials] = useState([]);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [offers, setOffers] = useState([]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");

      if (data?.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchOffers = async () => {
    try {
      const { data } = await axios.get("/api/offers");
      if (data?.success) {
        setOffers(data.offers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities);
      } else {
        // Retry Fetching User Details after 5 seconds
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchBookings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/bookings/allBookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get("/api/reviews");

      if (data?.success) {
        setTestimonials(data.reviews);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  // Function to calculate average rating for a room
  const averageRating = (testimonials, room) => {
    const hotelRates = testimonials.filter(
      (testimonial) => testimonial.hotel === room.hotel.name,
    );

    if (hotelRates.length === 0) return 0;
    const totalStars = hotelRates.reduce((acc, curr) => acc + curr.rating, 0);
    return {
      stars: (totalStars / hotelRates.length).toFixed(1),
      count: hotelRates.length,
    };
  };

  // Best seller function
  const bestSellerRoomsFunc = (rooms, bookings) => {
    const bookedRooms = rooms.filter((room) => {
      return bookings.some(
        (booking) => booking.room.toString() === room._id.toString(),
      );
    });

    // Count bookings for each room
    const bookingCounts = {};
    bookings.forEach((booking) => {
      // checks if the key (room id) exists, if not initializes it to 0 and adds 1 and for existing keys adds 1
      // thus counting total bookings per room
      bookingCounts[booking.room] = (bookingCounts[booking.room] || 0) + 1;
    });
    // Sort rooms based on booking counts
    const bestRooms = [...bookedRooms]
      .sort((a, b) => (bookingCounts[b._id] || 0) - (bookingCounts[a._id] || 0))
      
    // Return top 4 best-seller rooms
    setBestSellerRooms(bestRooms);
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);
  useEffect(() => {
    fetchRooms();
    fetchOffers();
    fetchReviews();
    fetchBookings();
  }, []);
  useEffect(() => {
    if (rooms.length && bookings.length) {
      bestSellerRoomsFunc(rooms, bookings);
    }
  }, [rooms, bookings]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    showReviewForm,
    setShowReviewForm,
    axios,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
    offers,
    setOffers,
    review,
    setReview,
    testimonials,
    averageRating,
    bestSellerRooms,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
