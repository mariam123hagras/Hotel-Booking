import React from 'react'
import Navbar from './components/Navbar'
import { useLocation,Routes,Route } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBooking from './pages/MyBooking';
import HotelReg from './components/HotelReg';
import LayOut from './pages/HotelOwner/LayOut';
import AddRoom from './pages/HotelOwner/AddRoom';
import Dashboard from './pages/HotelOwner/Dashboard';
import ListRoom from './pages/HotelOwner/ListRoom';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext';
import TokenLogger from './components/TokenLogger';
import Loader from './components/Loader';
const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");
  const {showHotelReg}=useAppContext();
 
  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
    { showHotelReg && <HotelReg/>}
     <TokenLogger/>
      <div className='min-h-[70vh]'>
        <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/rooms' element={<AllRooms/>}/>
         <Route path='/rooms/:id' element={<RoomDetails/>} />
         <Route path='/my-bookings' element={<MyBooking/>} />
         
         <Route path='/loader/:nextUrl' element={<Loader/>} />
         
         <Route path='/owner' element={<LayOut/>}>
         <Route index element={<Dashboard/>}/>
         <Route path='add-room' element={<AddRoom/>} />
         <Route path='list-room' element={<ListRoom/>} />

         </Route>

        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App

