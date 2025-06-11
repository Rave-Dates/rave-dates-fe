
import Image from 'next/image';
import React from 'react';

const NavbarMobile: React.FC = () => {

  const navItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: "/icons/home.svg",
    },
    {
      id: 'tickets',
      label: 'Mis tickets',
      icon: "/icons/ticket.svg",
    },
    {
      id: 'datos',
      label: 'Mis datos',
      icon: "/icons/user.svg",
    },
    {
      id: 'contacto',
      label: 'Contacto',
      icon: "/icons/contact.svg",
    },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-2 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          return (
            <button
              key={item.id}
              className="flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-800 active:scale-95"
            >
              <Image
                src={item.icon}
                width={24}
                height={24}
                alt={item.label}
                className="mb-1 transition-transform duration-200"
              />
              <span className="text-xs font-medium leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavbarMobile;