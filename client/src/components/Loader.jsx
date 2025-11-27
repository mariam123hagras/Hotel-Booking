import React, { useEffect } from 'react'
import {useParams} from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const loader = () => {
    const {navigate} = useAppContext();
    const {nextUrl}=useParams();
    useEffect(()=>{
        if(nextUrl){
            setTimeout(()=>{
                navigate(`/${nextUrl}`);
            },8000);
        }
        },[nextUrl])
  return (
    <div className='flex justify-center items-center h-screen' >
<div className='animate-spin  rounded-full h-24 w-24 border-4  border-t-transparent border-blue-600'></div>
    </div>
  )
}

export default loader
