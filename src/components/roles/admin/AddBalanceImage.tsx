"use client"

import type React from "react"

import { useState, useRef } from "react"

import AddSvg from "@/components/svg/AddSvg"
import ImageSvg from "@/components/svg/ImageSvg"

interface ImageData {
  url: string
  file: File | null
}

export default function AddBalanceImage() {
  const [image, setImage] = useState<ImageData>({ url: "", file: null })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files) return

    if (files.length > 1) {
      alert("Solo se puede subir una imagen")
      return
    }

    if (!files[0].type.startsWith("image/")) {
      alert("El archivo no es una imagen")
      return
    }

    const url = URL.createObjectURL(files[0])

    setImage({
      url,
      file: files[0],
    })
  }

  const removeImage = () => {
    if (!image) return
    setImage({ url: "", file: null })
    URL.revokeObjectURL(image.url)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {image.url.length > 0 ? (
          <div>
            {/* Main Swiper */}
            <div className="relative text-xl">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage()}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                  aria-label="Remove image"
                >
                  <AddSvg className="rotate-45 text-xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            type="button"
            onClick={triggerFileInput}
            className="text-center bg-main-container w-full px-5 flex flex-col items-center justify-center h-48 text-text-inactive rounded-lg"
          >
            <ImageSvg className="text-primary text-5xl mb-2" />
            <h2 className="text-primary-white">Presiona para subir imagen</h2>
            <p className="text-sm">Sube una imagen asociada al movimiento de dinero</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>
        )}
      </div>
    </div>
  )
}
