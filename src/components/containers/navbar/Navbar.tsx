import Image from 'next/image';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-main-container fixed z-50 w-full text-white px-20 h-[96px]">
      <div className="h-full flex items-center gap-40">
        <div className="flex items-center justify-start space-x-10 w-[70%] ms-28">
          <Image src="/icons/logo.svg" width={56} height={56} alt="logo" />
          <div className='flex w-[54%]'>
            <div className="relative w-full">
              <i className='absolute right-4 content-center h-full'>
                <Image src="/icons/search.svg" width={24} height={24} alt="search icon" />
              </i>
              <input
                type="text"
                placeholder="Busca un evento"
                className="w-full bg-input placeholder:text-inactive outline-none text-body pl-4 pr-4 py-3.5 rounded-2xl"
              />
            </div>
            <div className="bg-primary px-3.5 content-center mx-2 rounded-2xl">
              <Image src="/icons/filter.svg" width={24} height={24} alt="filter icon" />
            </div>
          </div>
          <a href="#" className="text-text-inactive ms-2 hover:text-primary-white transition-colors">
            Mis tickets
          </a>
          <a href="#" className="text-text-inactive ms-8 hover:text-primary-white transition-colors">
            Mis datos
          </a>
        </div>

        {/* Navigation Links and Icons */}
        <div className="flex items-center space-x-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Image src="/icons/whatsapp.svg" width={32} height={32} alt="whatsapp icon" />
            <Image src="/icons/instagram.svg" width={32} height={32} alt="twitter icon" />
            <Image src="/icons/facebook.svg" width={32} height={32} alt="facebook icon" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;