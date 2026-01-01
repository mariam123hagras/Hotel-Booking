import React, { use } from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const ExclusiveOffers = () => {
    const {offers,navigate}=useAppContext()
 console.log('Offers in ExclusiveOffers Component:', offers);
    if (!offers || offers.length === 0) {
        return null; // Or you can return a loading/empty state
        // return <div className="py-20 text-center">No offers available at the moment</div>
    }
  return (
   
    <div 
     className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30'>
        <div className='flex flex-col md:flex-row items-center justify-between w-full'>
            <Title align='left' title= 'Exclusive Offers' subTitle='Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.'/>
            <button onClick={() => {navigate('/offers') ;scrollTo(0,0)}} className='group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12'>View All Offers
                <img src={assets.arrowIcon} alt="arrow-icon"  className='group-hover:translate-x-1 transition-all'/>
            </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12' >
            {offers.map((item)=>(
                <div onClick={() => {navigate(`/offers/${item._id}`) ;scrollTo(0,0)}}
                key={item._id} className='group aspect-video relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center cursor-pointer' style={{backgroundImage:`url(${item.room.images[0]})`}}
                >
                    <p className='px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full'>{item.discountValue}% OFF</p>
                    <div>
                       <p className='text-2xl font-medium font-playfair'>{item.title}</p> 
                        <p>{item.description}</p> 
                         <p className='text-xs bg-black/20 mt-3 rounded w-35 text-center'> <span>Expires {new Date(item.expiryDate).toDateString()}</span></p> 
                    </div>
                    <button   className='flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5' >
                        View Offers
                        <img src={assets.arrowIcon} alt="arrow-Icon" className='invert group-hover:translate-x-1 transition-all' />
                    </button>
                </div>


            ))}
        </div>
      
    </div>
  )
}

export default ExclusiveOffers
