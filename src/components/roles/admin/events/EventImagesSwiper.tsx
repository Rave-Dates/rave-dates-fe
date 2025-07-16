"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import AddSvg from "@/components/svg/AddSvg"
import ArrowDownSvg from "@/components/svg/ArrowDown"
import FileSvg from "@/components/svg/FileSvg"
import SpinnerSvg from "@/components/svg/SpinnerSvg"
import Image from "next/image"
import { notifyError } from "@/components/ui/toast-notifications"
import { UseFormSetValue } from "react-hook-form"

interface ImageData {
  id: string
  url: string
  file?: File
}

export default function EventImageSwiper({ setImages, images, isLoading, isError, isErrorEventImages }: { setImages: UseFormSetValue<IEventFormData>, images: any[], isLoading?: boolean, isError?: boolean, isErrorEventImages?: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (isErrorEventImages || isError) {
      notifyError("Error cargando imágenes")
    }
  }, [isErrorEventImages, isError])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newImages: ImageData[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        newImages.push({
          id: Math.random().toString(36).slice(2, 9),
          url,
          file,
        })
      }
    })

    setImages("images", [...images, ...newImages])
  }

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id)
    if (imageToRemove?.file) {
      URL.revokeObjectURL(imageToRemove.url)
    }
    const filteredImages = images.filter((img) => img.id !== id)

    setImages("images",  [...filteredImages])
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full flex flex-col gap-x-4">
      <h1 className="mb-2 text-xs">
        Imagenes
      </h1>
      <div className="w-full flex gap-x-4">
        <div className="h-40 rounded-lg w-20 text-center text-text-inactive bg-main-container">
          {/* Upload Button */}
          <button
            onClick={triggerFileInput}
            type="button"
            className="w-full h-full flex items-center justify-center"
          >
            <AddSvg className="text-3xl" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {images?.length > 0 ? (
          <div>
            {/* Main Swiper */}
            <div className="relative max-w-40 text-xl max-h-40">
              <div className="absolute top-1/2 -translate-y-1/2 left-1 z-10">
                <button type="button" ref={prevRef} className="bg-black/40 text-primary-white/80 px-1 py-2 rounded-xl">
                  <ArrowDownSvg className="rotate-[90deg]" />
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-1 z-10">
                <button type="button" ref={nextRef} className="bg-black/40 text-primary-white/80 px-1 py-2 rounded-xl">
                  <ArrowDownSvg className="rotate-[270deg]" />
                </button>
              </div>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
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
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="rounded-lg overflow-hidden"
              >
                {images.map((image) => (
                  <SwiperSlide key={image.id} className="relative">
                    <div className="relative  aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        width={1000}
                        height={1000}
                        src={image.url}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                        aria-label="Remove image"
                      >
                        <AddSvg className="rotate-45 text-xl" />
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ) : (
          <div className="text-center min-w-40 flex flex-col items-center justify-center h-40 border-2 border-dashed border-inactive text-text-inactive rounded-lg">
            {
              isLoading ? <SpinnerSvg className="p-14 text-inactive fill-primary" /> : <FileSvg className={`${(isError || isErrorEventImages) && "text-system-error"}`} />
            }
          </div>
        )}
      </div>
    </div>
  )
}
