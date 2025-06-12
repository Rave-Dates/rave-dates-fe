"use client"

import FacebookSvg from '@/components/svg/FacebookSvg';
import InstagramSvg from '@/components/svg/InstagramSvg';
import WhatsappSvg from '@/components/svg/WhatsappSvg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import FilterModal from './FilterModal';
import SearchInput from '@/components/inputs/SearchInput';

const NavbarWeb: React.FC = () => {
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <nav 
      className={`
        bg-main-container z-50 w-full text-white px-5 sm:px-10 lg:px-20 h-[180px] sm:h-[96px]
        ${isHome ? 'block' : 'hidden'} sm:block sm:fixed
      `}>
      <div className="h-full flex items-center justify-center gap-8 xl:gap-40">
        <div className="flex flex-col sm:flex-row items-center justify-start gap-6 xl:gap-12 w-full md:w-[70%]">
          <Link href="/">
            <img className='w-14 h-14' src="/logo.svg" alt="logo" />
          </Link>
          <div className='flex w-full md:w-[54%]'>
            <SearchInput placeholder="Busca un evento" />
            <FilterModal />
          </div>
          <Link href="/" className="text-text-inactive md:block hidden min-w-[81px] hover:text-primary-white transition-colors">
            Mis tickets
          </Link>
          <Link href="/auth" className="text-text-inactive md:block hidden min-w-[75px] hover:text-primary-white transition-colors">
            Mis datos
          </Link>
        </div>

        {/* Navigation Links and Icons */}
        <div className="items-center space-x-6 md:flex hidden">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <button className="hover:brightness-150 transition-all">
              <WhatsappSvg className='w-8 h-8 text-text-inactive' />
            </button>
            <button className="hover:brightness-150 transition-all">
              <InstagramSvg className='w-8 h-8 text-text-inactive' />
            </button>
            <button className="hover:brightness-150 transition-all">
              <FacebookSvg className='w-8 h-8 text-text-inactive' />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarWeb;