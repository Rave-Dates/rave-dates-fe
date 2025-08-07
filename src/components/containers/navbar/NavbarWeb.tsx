"use client"

import FacebookSvg from '@/components/svg/FacebookSvg';
import InstagramSvg from '@/components/svg/InstagramSvg';
import WhatsappSvg from '@/components/svg/WhatsappSvg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import FilterModal from '../../ui/modals/FilterModal';
import SearchInput from '@/components/ui/inputs/search-input/SearchInput';
import Image from 'next/image';
import { useClientAllRawEvents } from '@/hooks/client/queries/useClientData';

const NavbarWeb: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IEvent[]>([]);

  const { data: events} = useClientAllRawEvents();

  console.log("data", events)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length === 0) {
      setResults([]);
      return;
    }

    const filtered = events?.filter((event) =>
      event.title.toLowerCase().includes(term.toLowerCase())
    ) || [];

    setResults(filtered);
  };

  const contactItems = [
    {
      id: 'whatsapp',
      href: "https://api.whatsapp.com/",
      label: 'WhatsApp',
      icon: <WhatsappSvg className='w-8 h-8' />,
    },
    {
      id: 'instagram',
      href: "https://www.instagram.com",
      label: 'Instagram',
      icon: <InstagramSvg className='w-8 h-8' />,
    },
    {
      id: 'facebook',
      href: "https://www.facebook.com",
      label: 'Facebook',
      icon: <FacebookSvg className='w-8 h-8' />,
    }
  ]

  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <nav 
      className={`
        bg-main-container z-50 w-full text-white px-5 sm:px-10 lg:px-20 h-[180px] sm:h-[96px]
        ${isHome ? 'block' : 'hidden'} md:block md:fixed
      `}>
      <div className="h-full flex items-center justify-center gap-8 xl:gap-40">
        <div className="flex flex-col sm:flex-row items-center justify-start gap-6 xl:gap-12 w-full md:w-[70%]">
          <Link href="/">
            <Image className='w-14 h-14' src="/logo.svg" width={1000} height={1000} alt="logo" />
          </Link>
          <div className='flex w-full md:w-[54%]'>
            <SearchInput
              placeholder="Busca un evento"
              value={searchTerm}
              handleFunc={handleSearch}
              results={results}
              setSearchTerm={setSearchTerm}
            />
            {
              isHome &&
              <FilterModal />
            }
          </div>
          <Link href="/tickets" className={`${pathname.includes("/tickets") ? "text-primary" : "text-text-inactive"} md:block hidden min-w-[81px] hover:text-primary-white transition-colors`}>
            Mis tickets
          </Link>
          <Link href="/auth" className={`${pathname === "/auth" || pathname === "/my-data" ? "text-primary" : "text-text-inactive"} md:block hidden min-w-[75px] hover:text-primary-white transition-colors`}>
            Mis datos
          </Link>
        </div>

        {/* Navigation Links and Icons */}
        <div className="items-center space-x-6 md:flex hidden">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {
              contactItems.map((item) => {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary text-text-inactive transition-all"
                  >
                    {item.icon}
                  </a>
                );
              })
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarWeb;