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
import { useReactiveCookiesNext } from 'cookies-next';
import { useCityStore } from '@/store/useCityStore';
import LocationSvg from '@/components/svg/LocationSvg';

const NavbarWeb: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IEvent[]>([]);

  const { data: events} = useClientAllRawEvents();
  const { getCookie } = useReactiveCookiesNext();
  const { selectedCity, setIsModalOpen } = useCityStore();

  const token = getCookie("token");

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
        bg-main-container z-50 w-full text-white px-5 sm:px-5 lg:px-10 h-[160px] sm:h-[96px]
        ${isHome ? 'block' : 'hidden'} lg:block lg:fixed
      `}>
      <div className="h-full flex items-center justify-center gap-8 xl:gap-40">
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 xl:gap-12 w-full md:w-[70%] xl:w-[60%]">
          <Link href="/" className='hidden md:block'>
            <Image className='w-14 h-14' src="/logo.svg" width={1000} height={1000} alt="logo" />
          </Link>
          <div className='flex flex-col sm:flex-row items-center gap-y-3 gap-x-3 w-full sm:w-[85%] lg:w-[70%]'>
            <div className='flex items-center gap-2 w-full'>
              <Link href="/" className='md:hidden block'>
                <Image className='w-14 h-14' src="/logo.svg" width={1000} height={1000} alt="logo" />
              </Link>
              <SearchInput
                placeholder="Busca un evento"
                value={searchTerm}
                handleFunc={handleSearch}
                results={results}
                type="event"
                setSearchTerm={setSearchTerm}
              />
            </div>
            {
              isHome &&
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-cards-container hover:bg-divider text-primary-white transition-all px-4 py-3.5 rounded-2xl border border-divider h-full md:ml-2 flex-1 sm:flex-none justify-center min-w-fit whitespace-nowrap"
                >
                  <LocationSvg className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">
                     Ciudad
                  </span>
                </button>
                <FilterModal />
              </div>
            }
          </div>
          {!token &&
            <>
              <Link href="/tickets" className={`${pathname.includes("/tickets") ? "text-primary" : "text-text-inactive"} lg:block hidden min-w-[81px] hover:text-primary-white transition-colors`}>
                Mis tickets
              </Link>
              <Link href="/auth" className={`${pathname === "/auth" || pathname === "/my-data" ? "text-primary" : "text-text-inactive"} lg:block hidden min-w-[75px] hover:text-primary-white transition-colors`}>
                Mi cuenta
              </Link>
            </>
          }
        </div>

        {/* Navigation Links and Icons */}
        <div className="items-center space-x-6 lg:flex hidden">
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