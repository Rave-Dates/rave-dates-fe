"use client"

import HomeSvg from '@/components/svg/HomeSvg';
import TicketSvg from '@/components/svg/TicketSvg';
import UserSvg from '@/components/svg/UserSvg';
import WhatsappMobileSvg from '@/components/svg/WhatsappMobileSvg';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavbarMobile: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      id: '/',
      href: "/",
      label: 'Inicio',
      icon: <HomeSvg className='w-6 h-6' />,
    },
    {
      id: 'tickets',
      href: "/tickets",
      label: 'Mis tickets',
      icon: <TicketSvg className='w-6 h-6' />,
    },
    {
      id: 'personal-data',
      href: "/personal-data",
      label: 'Mis datos',
      icon: <UserSvg className='w-6 h-6' />,
    },
    {
      id: 'contacto',
      href: "/contacto",
      label: 'Contacto',
      icon: <WhatsappMobileSvg className='w-6 h-6' />,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 rounded-t-[35px] bg-main-container px-2 py-2 z-20">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${pathname === item.href ? "text-primary" : "text-text-inactive"} flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-800 active:scale-95`}
            >
              {item.icon}
              <span className="text-xs">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavbarMobile;