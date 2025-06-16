"use client"

import HomeSvg from '@/components/svg/HomeSvg';
import TicketSvg from '@/components/svg/TicketSvg';
import UserSvg from '@/components/svg/UserSvg';
import WhatsappMobileSvg from '@/components/svg/WhatsappMobileSvg';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CalendarSvg from '@/components/svg/CalendarSvg';
import GraphSvg from '@/components/svg/GraphSvg';
import FileSvg from '@/components/svg/FileSvg';
import DollarSvg from '@/components/svg/DollarSvg';

const NavbarMobile: React.FC = () => {
  const pathname = usePathname();

  const navItems = {
    "/": [
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
        id: 'auth',
        href: "/auth",
        label: 'Mis datos',
        icon: <UserSvg className='w-6 h-6' />,
      },
      {
        id: 'contact',
        href: "/contact",
        label: 'Contacto',
        icon: <WhatsappMobileSvg className='w-6 h-6' />,
      },
    ],
    "admin": [
      {
        id: '/',
        href: "/admin/users",
        label: 'Usuarios',
        icon: <UserSvg className='w-6 h-6' />,
      },
      {
        id: 'tickets',
        href: "/tickets",
        label: 'Eventos',
        icon: <CalendarSvg type='thin' className='w-6 h-6' />,
      },
      {
        id: 'auth',
        href: "/auth",
        label: 'Parámetros',
        icon: <GraphSvg className='w-6 h-6' />,
      },
      {
        id: 'contact',
        href: "/contact",
        label: 'Informes',
        icon: <FileSvg className='w-6 h-6' />,
      },
    ],
    "organizer": [
      {
        id: '/',
        href: "/organizer/promoters",
        label: 'Promotores',
        icon: <UserSvg className='w-6 h-6' />,
      },
      {
        id: 'events',
        href: "/organizer/events",
        label: 'Eventos',
        icon: <CalendarSvg type='thin' className='w-6 h-6' />,
      },
      {
        id: 'balance',
        href: "/organizer/balance",
        label: 'Saldo',
        icon: <DollarSvg className='w-6 h-6' />,
      },
    ]
  };

  function getNavItems(pathname: string) {
    if (pathname.startsWith("/admin")) {
      return navItems["admin"];
    } else if (pathname.startsWith("/organizer")) {
      return navItems["organizer"];
    } else {
      return navItems["/"];
    }
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 rounded-t-[35px] bg-main-container px-2 py-2 pb-7 z-20">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {getNavItems(pathname)?.map((item) => {
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${pathname === item.href ? "text-primary" : "text-text-inactive"} flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 active:scale-95`}
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