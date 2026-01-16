import React, { useState ,useEffect} from 'react'

import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext.jsx'
import {toast} from 'react-hot-toast'



const ListRoom = () => {

  const [rooms,setRooms]=useState([])
  const [offers,setOffers]=useState([])
  const [listRooms,setListRooms]=useState(true)
  const [newExpiryDate,setNewExpiryDate]=useState()
  const {axios,getToken,user,currency}= useAppContext()


  // Fetch Rooms for the Hotel Owner

  const fetchRooms=async()=>{
    try {
      const token= await getToken()
      const {data}=await axios.get('/api/rooms/owner',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(data?.success){
        setRooms(data.rooms)
      }
      else{
        toast.error(data.message)
      }

  }
    catch (error) {
      toast.error(error.message)
    }
  }
  const fetchOffers=async()=>{
    try {
      const token= await getToken()
      const {data}=await axios.get('/api/offers/owner',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(data?.success){
        setOffers(data.offers)
      }
      else{
        toast.error(data.message)
      }
  }
    catch (error) {
      toast.error(error.message)
    }
  }

//Toggle Availability of the room

const toggleAvailability=async(roomId)=>{
  try {
    const token=await getToken();
    const {data}=await axios.post('/api/rooms/toggle-availability',{roomId},{
    headers:{
      Authorization:`Bearer ${ token}`
    }
  })
  if(data?.success){
    toast.success(data.message)
    fetchRooms()
}
  else{
    toast.error(data.message)
  }
    
  } catch (error) {
    toast.error(error.message)
  }
  
}

const toggleOfferAvailability=async(offerId)=>{
  try {
    const token=await getToken(); 
    const {data}=await axios.post(`/api/offers/toggle/${offerId}`,{},{
    headers:{
      Authorization:`Bearer ${ token}`
    }
  })
  if(data.expired){
    toast.error("Cannot toggle an expired offer, please renew it first.")
    return
  }
  if(data?.success){
    toast.success(data.message)
    fetchOffers()
}
  else{
    toast.error(data.message)
  }
    
  } catch (error) {
    toast.error(error.message)
  }
  
}

// new expiry date
const renewOffer=async(offerId,newExpiryDate)=>{
  try {
    const token=await getToken();
    const {data}=await axios.post(`/api/offers/renew/${offerId}`,{newExpiryDate},{
    headers:{
      Authorization:`Bearer ${ token}`
    }
  })
  if(data?.success){
    toast.success(data.message)
    fetchOffers()
    setNewExpiryDate('')
}
  else{
    toast.error(data.message)
  }
    
  } catch (error) {
    toast.error(error.message)
  }
  
}


  useEffect(()=>{
    if(user){
      fetchRooms()
      fetchOffers()
    }
  },[user])
  return (
    <div>
      <Title align='left' font='font-outfit' title='Rooms & Offers Listings' subTitle='View, edit,
      or manage all listed rooms & offers. keep the information up-to-date to provide the best experience for users'/>
      <div className="flex gap-6">
        <p className={`mt-8 cursor-pointer ${listRooms ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => setListRooms(true)}>All Rooms</p>
        <p className={`mt-8 cursor-pointer ${!listRooms ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => setListRooms(false)}>All Offers</p>
      </div>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
        {listRooms && <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
              <th className='py-3 px-2 text-gray-800 font-medium '>Price / night</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
            </tr>
          </thead>

          <tbody className='text-sm'>
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                  {item.roomType}
                </td>

                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                  {item.amenities.join(', ')}
                </td>

                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                  {currency} {item.pricePerNight}
                </td>
                <td className='py-3 px-4 border-t border-gray-300 text-sm text-center'>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input onChange={() => toggleAvailability(item._id)} type="checkbox" className='sr-only peer' 
                    checked={item.isAvailable} />
                    <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200'></div>
                    <span className='absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5'></span>
                  </label>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>}

        {/* Offers Table */}
        {!listRooms && <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
              <th className='py-3 px-2 text-gray-800 font-medium '>Price / night</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Availability</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>New Expiration Date</th>
            </tr>
          </thead>

<tbody className='text-sm'>

    {offers.length>0&&offers.map((item, index) => (
              <tr key={index}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                  {item.room.roomType}
                </td>

                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                  {item.room.amenities.join(', ')}
                  
                </td>

                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                  {currency} {item.currentPricePerNight}
                </td>
                <td className='py-3 px-4 border-t border-gray-300 text-sm text-center'>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input onChange={() => toggleOfferAvailability(item._id)} type="checkbox" className='sr-only peer' 
                    checked={item.isActive} />
                    <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200'></div>
                    <span className='absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5'></span>
                  </label>
                </td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                  <input type="date" value={newExpiryDate} onChange={(e) => renewOffer(item._id, e.target.value)} />
                </td>
              </tr>
            ))}
  
        </tbody>
        </table>}

      </div>
    </div>
  )
}

export default ListRoom
