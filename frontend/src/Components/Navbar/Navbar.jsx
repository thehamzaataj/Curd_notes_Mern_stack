import React from 'react';
import Profileinfo from '../Card/Profileinfo';
import SearchBar from '../SearchBar/SearchBar';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='bg-black flex items-center justify-between px-6 py-2 shadow-xl'>
      <h2 className='text-2xl font-bold text-white py-2'>Hamza Taj</h2>
      <SearchBar />
      <Profileinfo />
    </div>
  );
}

export default Navbar;
