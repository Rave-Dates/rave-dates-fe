"use client"

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ImagesSwiper({ images, className }: { images: IEventCard['images'], className: string }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative w-full">
      {/* Botones custom */}
      <button ref={prevRef} className="absolute z-10 top-1/2 left-3 sm:left-6 -translate-y-1/2 bg-primary-white hover:opacity-75 active:scale-95 p-3 rounded-xl shadow transition-all">
        <Image src="/icons/arrow.svg" width={24} height={24} alt="arrow icon" />
      </button>
      <button ref={nextRef} className="absolute z-10 top-1/2 right-3 sm:right-6 -translate-y-1/2 bg-primary-white hover:opacity-75 active:scale-95 p-3 rounded-xl shadow transition-all rotate-180">
        <Image src="/icons/arrow.svg" width={24} height={24} alt="arrow icon" />
      </button>

      <Swiper
        loop={true}
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{ clickable: true }}
        onBeforeInit={(swiper) => {
          if (
            swiper &&
            typeof swiper.params.navigation === 'object' &&
            swiper.params.navigation !== null
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        spaceBetween={20}
        slidesPerView={1}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image}>
            <Image
              width={1000}
              height={1000}
              src={image}
              alt={`event ${index + 1}`}
              className={`${className}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
