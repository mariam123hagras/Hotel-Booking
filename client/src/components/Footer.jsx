import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'


const Footer = () => {
      const {axios}=useAppContext()
      const [offerEmail,setOfferEmail]=useState('')
        const handleSubmit=async(email)=>{
try {
    if(!email){
      toast.error('Please enter a valid email')
      return
    }
     const {data}= await axios.post('/api/user/subscribeOffers',{email})
     if(data?.success){
      toast.success('Subscribed successfully')
      setOfferEmail('')
     }
    if(data?.error){
      toast.error(data.error)
      return
    }}
  catch (error) {
    toast.error(error.message)

  }

  }
    return (
        <div className=' bg-[#F6F9FC] text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
                       <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                                <div className='max-w-80'>
                                        <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-9 invert opacity-80' />
                                      <p className='text-sm'>
                        Discover the world's most extraordinary places to stay,from boutique hotels to luxury villas and private islands
                                            </p>
                                        <div className='flex items-center gap-3 mt-4'>
                                                {/* Instagram */}
                             <img src={assets.instagramIcon} alt=" instagramIcon" className='w-6' />
                                              {/* Facebook */}
                                                    <img src={assets.facebookIcon} alt=" FacebookmIcon" className='w-6' />
                                                {/* Twitter */}
                                                     <img src={assets.twitterIcon} alt=" TwitterIcon" className='w-6' />
                        
                                                {/* LinkedIn */}
                                                      <img src={assets.linkendinIcon} alt=" LinkedInIcon" className='w-6' />
                                        </div>
                                   </div>
                
                               <div>
                                        <p className='text-lg font-playfair text-gray-800'>COMPANY</p>
                                        <ul className='mt-3 flex flex-col gap-2 text-sm'>
                                              <li><a href="#">About</a></li>
                                               <li><a href="#">Careers</a></li>
                                             <li><a href="#">Press</a></li>
                                              <li><a href="#">Blog</a></li>
                                               <li><a href="#">Partners</a></li>
                                         </ul>
                                   </div>
                
                                <div>
                                      <p className='text-lg  font-playfair text-gray-800'>SUPPORT</p>
                                       <ul className='mt-3 flex flex-col gap-2 text-sm'>
                                             <li><a href="#">Help Center</a></li>
                                               <li><a href="#">Safety Information</a></li>
                                               <li><a href="#">Cancellation Options</a></li>
                                               <li><a href="#">Contact Us</a></li>
                                              <li><a href="#">Accessibility</a></li>
                                            </ul>
                                   </div>
                
                               <div className='max-w-80'>
                                      <p className='text-lg  font-playfair text-gray-800'>STAY UPDATED</p>
                                       <p className='mt-3 text-sm'>
                                             Subscribe to our newsletter for inspiration and special offers.
                                         </p>
                                       <form onSubmit={(e) => {  e.preventDefault()
                                             handleSubmit(offerEmail)
                                          }}
                                       className='flex items-center mt-4'>
                                             <input type="email" value={offerEmail} onChange={(e)=>setOfferEmail(e.target.value)} className='bg-white rounded-l border border-gray-300 h-9 px-3 outline-none' placeholder='Your email' />
                                              <button type="submit" className='flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r'>
                                                     {/* Arrow icon */}
                                              <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert'/>
                                                   </button>
                                           </form>
                                    </div>
                            </div>
                        <hr className='border-gray-300 mt-8' />
                      <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                              <p>© {new Date().getFullYear()} <a href="https://prebuiltui.com">QuickStay</a>. All rights reserved.</p>
                              <ul className='flex items-center gap-4'>
                                      <li><a href="#">Privacy</a></li>
                                      <li><a href="#">Terms</a></li>
                                       <li><a href="#">Sitemap</a></li>
                                 </ul>
                           </div>
                   </div>
    )
}

export default  Footer
