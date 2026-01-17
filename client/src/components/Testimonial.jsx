import React from 'react'
import Title from './Title'

import StarRating from './StarRating'
import { useAppContext } from '../context/AppContext'
import { UserButton } from '@clerk/clerk-react'

const Testimonial = () => {
    const {testimonials}=useAppContext()
return (
        <div className='flex flex-col items-center  justify-center px-6  md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30' >
                        <Title title="What Our Guests Say" subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world"/>
                
                                        <div className="flex flex-wrap items-center justify-center gap-6 mt-20  ">
                                                        {  testimonials.slice(-3).map((testimonial) => (
                                                                        <div key={testimonial._id} className="bg-white p-6 rounded-xl shadow w-80 h-64 flex flex-col">
                                                                                        <div className="flex items-center gap-3">
                                                                                                        <UserButton />
                                                                                                        <div>
                                                                                                                        <p className="font-playfair text-xl">{testimonial.user.username}</p>
                                                                                                                        <p className="text-gray-500">{testimonial.user.email}</p>
                                                                                                        </div>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1 mt-4">
                                                                                         <StarRating rating={testimonial.rating} />
                                                                                        </div>
                                                                                        <p className="text-gray-500 max-w-90 mt-4 flex-1 overflow-hidden">"{testimonial.comment}"</p>
                                                                        </div>
                                                        ))}
                                        </div>
        </div>
)
}

export default Testimonial
