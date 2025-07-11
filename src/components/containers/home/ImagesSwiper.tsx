"use client"

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ArrowSvg from '@/components/svg/ArrowSvg';

export default function ImagesSwiper({ images, className }: { images: any, className: string }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative w-full">
      {/* Botones custom */}
      {images.length > 1 && 
        <>
          <button ref={prevRef} className="absolute hidden md:block text-primary-black z-10 top-1/2 left-3 sm:left-6 -translate-y-1/2 bg-primary-white hover:opacity-75 active:scale-95 p-3 rounded-xl shadow transition-all">
            <ArrowSvg />
          </button>
          <button ref={nextRef} className="absolute hidden md:block text-primary-black z-10 top-1/2 right-3 sm:right-6 -translate-y-1/2 bg-primary-white hover:opacity-75 active:scale-95 p-3 rounded-xl shadow transition-all rotate-180">
            <ArrowSvg />
          </button>
        </>
      }

      {images.length > 1 ? (
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
          {
            images.map((image) => (
              <SwiperSlide key={image.id}>
                <Image
                  width={1000}
                  height={1000}
                  src={image.url}
                  alt={`event ${image.id}`}
                  className={className}
                />
              </SwiperSlide>
            ))
          }
        </Swiper>
      ) : (
        <>
          {
            images && images.length === 0 ?
            <Image
              width={1000}
              height={1000}
              src="/images/event-placeholder.png"
              alt="Sin imagen"
              className={className}
            /> 
            :
            <Image
              width={1000}
              height={1000}
              src={images[0].url}
              alt={`event ${images[0].id}`}
              className={className}
            />
          }
        </>
      )}
    </div>
  );
}
