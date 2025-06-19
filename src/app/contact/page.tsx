"use client";

import FacebookSvg from "@/components/svg/FacebookSvg";
import InstagramSvg from "@/components/svg/InstagramSvg";
import WhatsappSvg from "@/components/svg/WhatsappSvg";

export default function Contact() {
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


  return (
    <div className="bg-primary-black pt-20 sm:pt-52 gap-y-3 flex flex-col w-full items-center justify-start text-primary min-h-screen p-4 sm:p-20">
      {contactItems?.map((item) => {
          return (
            <a
              target="_blank" 
              rel="noopener noreferrer"
              key={item.id}
              href={item.href}
              className="flex w-full border border-primary gap-x-10 items-center justify-center px-3 py-5 rounded-lg transition-all duration-200 active:opacity-60 hover:text-primary-white"
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
