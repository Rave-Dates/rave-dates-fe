"use client";

import FacebookSvg from "@/components/svg/FacebookSvg";
import InstagramSvg from "@/components/svg/InstagramSvg";
import WhatsappSvg from "@/components/svg/WhatsappSvg";
import Image from "next/image";
import Link from "next/link";

export default function Contact() {
  const contactItems = [
      {
        id: 'whatsapp',
        href: "https://wa.me/573173360170",
        label: 'WhatsApp',
        icon: <WhatsappSvg className='w-8 h-8' />,
      },
      {
        id: 'instagram',
        href: "https://www.instagram.com/ravedates/",
        label: 'Instagram',
        icon: <InstagramSvg className='w-8 h-8' />,
      },
      {
        id: 'facebook',
        href: "https://www.facebook.com/ravedates",
        label: 'Facebook',
        icon: <FacebookSvg className='w-8 h-8' />,
      }
    ]

  return (
    <div className="bg-primary-black pt-44 gap-y-3 flex flex-col w-full items-center justify-start text-primary min-h-screen p-4">
      <nav 
      className={`
        bg-main-container flex items-center justify-center top-0 absolute z-50 w-full text-white px-5 sm:px-10 lg:px-20 h-[96px] md:hidden md:fixed
      `}>
        <Link href="/">
          <Image 
            className="w-14"
            src="/logo.svg"
            width={1000}
            height={1000}
            alt="logo"
          />
        </Link>
      </nav>
      {contactItems?.map((item) => {
          return (
            <a
              target="_blank" 
              rel="noopener noreferrer"
              key={item.id}
              href={item.href}
              className="flex animate-fade-in w-full border border-primary gap-x-10 items-center justify-center px-3 py-5 rounded-lg transition-all duration-200 active:opacity-60 hover:opacity-60"
            >
              <i className="absolute left-10 sm:left-28">
                {item.icon}
              </i>
              <span className="text-lg">
                {item.label}
              </span>
            </a>
          );
        })}
    </div>
  );
}
