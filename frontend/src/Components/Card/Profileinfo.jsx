import React from 'react'
import { RiLogoutBoxLine } from "react-icons/ri";
const Profileinfo = ({onLogout}) => {
  return (
    <div className="flex items-center gap-3"> 
    <div className=" w-12 h-12 flex items-center justify-center rounded-full text-black font-medium bg-white">
        HT
    </div>
    <div className=""><div>
    <p className="text-white">Hamza Taj</p>
    </div>
    <div className='flex items-center'>
    <RiLogoutBoxLine  className='text-white'/>
    <button className='  text-sm text-white underline' onClick={onLogout}>
       Logout 
    </button>
    </div>  
    </div>
    </div>
  )
}

export default Profileinfo