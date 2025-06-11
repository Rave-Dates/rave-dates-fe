"use client"

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavbarWeb: React.FC = () => {
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <nav 
      className={`
        bg-main-container fixed z-50 w-full text-white px-5 sm:px-10 lg:px-20 h-[180px] sm:h-[96px]
        ${isHome ? 'block' : 'hidden'} sm:block
      `}>
      <div className="h-full flex items-center justify-center gap-8 xl:gap-40">
        <div className="flex flex-col sm:flex-row items-center justify-start gap-6 xl:gap-12 w-full md:w-[70%]">
          <Link href="/">
            <Image src="/icons/logo.svg" width={56} height={56} alt="logo" />
          </Link>
          <div className='flex w-full md:w-[54%]'>
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
            <button className="bg-primary hover:bg-primary/70 transition-colors px-3.5 content-center mx-2 rounded-2xl">
              <Image src="/icons/filter.svg" width={24} height={24} alt="filter icon" />
            </button>
          </div>
          <a href="#" className="text-text-inactive md:block hidden min-w-[81px] hover:text-primary-white transition-colors">
            Mis tickets
          </a>
          <a href="#" className="text-text-inactive md:block hidden min-w-[75px] hover:text-primary-white transition-colors">
            Mis datos
          </a>
        </div>

        {/* Navigation Links and Icons */}
        <div className="items-center space-x-6 md:flex hidden">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <button className="hover:brightness-150 transition-all">
              <Image src="/icons/whatsapp.svg" width={32} height={32} alt="whatsapp icon" />
            </button>
            <button className="hover:brightness-150 transition-all">
              <Image src="/icons/instagram.svg" width={32} height={32} alt="twitter icon" />
            </button>
            <button className="hover:brightness-150 transition-all">
              <Image src="/icons/facebook.svg" width={32} height={32} alt="facebook icon" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarWeb;