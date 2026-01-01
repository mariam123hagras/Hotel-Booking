import React, { useState } from 'react'
import Title from '../../components/Title'
import {assets} from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import {toast} from 'react-hot-toast'

const AddOffer = () => {
  const {axios,getToken}= useAppContext()

  
  const [inputs,setInputs]=useState({
    roomType:'',
    title:'',
    description:'',
    discountValue:0,
    expiryDate:'',
   

  })

  const[loading,setLoading]=useState(false)

  const onSubmitHandler = async (e) => {
  e.preventDefault()
  // Check if all inputs are filled
  if (!inputs.roomType ||!inputs.title || !inputs.description || !inputs.expiryDate || !inputs.discountValue ) {
    toast.error('Please fill all the fields ')
    return;
  }
  setLoading(true)
  try {

     const token = await getToken();
  
    
    if (!token) {
      toast.error("Authentication missing. Please log in again.")
      setLoading(false)
      return;
    }
    const formData = new FormData()
    formData.append('roomType', inputs.roomType)
    formData.append('title', inputs.title)
    formData.append('description', inputs.description)
    formData.append('discountValue', inputs.discountValue)
    formData.append('expiryDate', inputs.expiryDate)
   

    
    
  const formDataObject = Object.fromEntries(formData.entries());
console.log('Form Data Object:', formDataObject);
    
    const response = await axios.post('/api/offers', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // console.log('Full response:', response);
    
    // If we get a successful HTTP status (200-299), consider it a success
    if (response.status >= 200 && response.status < 300) {
      toast.success('Offer created successfully!')
      setInputs({
        title:'',
        description:'',
        discountValue:0,
        expiryDate:'',
        roomType: '',
        
      })
     
    } else {
      toast.error("Offer not created")
    }
  } catch (error) {
    console.error('Error details:', error.response);
    toast.error(error.message)
  }
  finally {
    setLoading(false)
  }
}

  return (
    <form onSubmit={onSubmitHandler}> 
      <Title align='left' font='font-outfit' title='Add Offer' subTitle='Fill in the details carefully and accurate room details,pricing,and amenities,priceOff to enhance the user booking experience' />
      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Room Type</p>
          <select value={inputs.roomType} onChange={e=>setInputs({...inputs,roomType:e.target.value})}
          className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        
        <div>
          <p className='mt-4 text-gray-800'>
            Discount  <span className='text-xs'>%</span>  
          </p>
          <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' value={inputs.priceOff} 
          onChange={e=>setInputs({...inputs,discountValue:e.target.value})} />
        </div>
        <div>
          <p className='mt-4 text-gray-800'>
            Expiry Date  
          </p>
          <input type="date" placeholder='00-00-00' className=' text-gray-700 border border-gray-300 mt-1 rounded p-2 w-40' value={inputs.expiryDate} 
          onChange={e=>setInputs({...inputs,expiryDate:e.target.value})} />
        </div>
        <div >
          <p className='mt-4 text-gray-800'>
           Title 
          </p>
          <input type="text" placeholder='write down your title' className='border border-gray-300 mt-1 rounded p-2 w-50 outline-0' value={inputs.title} 
          onChange={e=>setInputs({...inputs,title:e.target.value})} />
        </div>
      </div>
     
      
        <div>
          <p className='mt-4 text-gray-800'>
              Description 
          </p>
          <textarea id="description" name="description" rows="4" cols="50" placeholder="Enter description" className='border border-gray-300 mt-1 rounded p-2  outline-0' value={inputs.description} 
          onChange={e=>setInputs({...inputs,description:e.target.value})}/>
           
        
        </div>
    
      
      <button className='bg-blue-500 text-white px-8 py-2 rounded mt-4 cursor-pointer' disabled={loading}>
        {loading ? 'Adding...':'Add Offer'}
      </button>
    </form>
  )
}

export default AddOffer