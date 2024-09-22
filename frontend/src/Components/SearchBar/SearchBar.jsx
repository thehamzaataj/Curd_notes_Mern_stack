import React from 'react'
import { RiSearch2Line } from "react-icons/ri";

const SearchBar = () => {
  return (
    <div className='w-80 flex items-center px-4 bg-slate-100 rounded-sm'>
        <input type="text"
        placeholder='Search Notes'
        className='w-full text-xs bg-transparent py-[11px] outline-none'
        />
        <RiSearch2Line className='cursor-pointer ' />
    </div>
  )
}

export default SearchBar