
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import {toast} from 'react-hot-toast'

const ReviewForm = () => {
  const {setShowReviewForm,axios,getToken,review,setReview}=useAppContext()
 

  const onSubmitHandler= async(event)=>{
    try {
      event.preventDefault()
       const token=await getToken();
      const {data}= await axios.post(`/api/reviews/`,{review},{headers:{Authorization:`Bearer ${token}`}});
      if(data.success){
        toast.success(data.message)
        setShowReviewForm(false)
      }
      
    
    } catch (error) {
      toast.error(error.message)
      
    }

  }

  return (
    <div onClick={()=>setShowReviewForm(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
      <form  onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
        <img src={assets.reviewImg} alt="regImg" className='w-1/2 rounded-l-xl hidden md:block'  />
        <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
            <img src={assets.closeIcon} alt="closeIcon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
           onClick={()=>setShowReviewForm(false)}  />
            <p className='text-2xl font-semibold mt-6'>Leave your review</p>
           {/* Comment */}
            <div className='w-full mt-4'>
                <label htmlFor='comment' className='font-medium text-gray-500'>
                    Comment
                </label>

                <input id='comment' onChange={(e)=>setReview({...review,comment:e.target.value})} value={review.comment} type="text"  placeholder='Type here'  className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required/>
            </div>
            {/* Stars */}

               <div className='w-full mt-4'>
                <label htmlFor='stars' className='font-medium text-gray-500'>
                   Stars
                </label>

                <input  id='stars' onChange={(e)=>setReview({...review,stars:e.target.value})} value={review.stars} type="number" placeholder='Type here'  className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required/>
            </div>
            <button className='bg-indigo-500 hover:bg-indigo-600 transition-all
            text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'>
                Submit Review
            </button>

        </div>
      </form>
    </div>
  )
}

export default ReviewForm
