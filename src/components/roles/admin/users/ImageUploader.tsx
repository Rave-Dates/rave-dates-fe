"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import AddSvg from "@/components/svg/AddSvg"
import FileSvg from "@/components/svg/FileSvg"
import SpinnerSvg from "@/components/svg/SpinnerSvg"
import { notifyError } from "@/components/ui/toast-notifications"
import { UseFormSetValue } from "react-hook-form"

export default function ImageUploader({
  setImages,
  image,
  isLoading,
  isError,
  isErrorEventImages
}: {
  setImages: UseFormSetValue<IPaymentForm>,
  image?: File,
  isLoading?: boolean,
  isError?: boolean,
  isErrorEventImages?: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const MAX_IMAGE_SIZE_MB = 3

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)

      return () => URL.revokeObjectURL(url) // cleanup
    } else {
      setPreviewUrl(null)
    }
  }, [image])

  useEffect(() => {
    if (isErrorEventImages || isError) {
      notifyError("Error cargando imagen")
    }
  }, [isErrorEventImages, isError])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const fileSizeMB = file.size / (1024 * 1024)

    if (!file.type.startsWith("image/")) {
      notifyError(`El archivo "${file.name}" no es una imagen válida.`)
      return
    }

    if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
      notifyError(`"${file.name}" excede el límite de ${MAX_IMAGE_SIZE_MB}MB.`)
      return
    }

    setImages("image", file)
  }

  const removeImage = () => {
    setImages("image", undefined)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <h1 className="mb-2 text-xs">Imagen</h1>
      <div className="w-full flex gap-x-4">
        <div className="h-40 w-20 rounded-lg text-center text-text-inactive bg-main-container">
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
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {previewUrl ? (
          <div className="relative w-40 h-40 rounded-lg overflow-hidden">
            <Image
              width={1000}
              height={1000}
              src={previewUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
              aria-label="Remove image"
            >
              <AddSvg className="rotate-45 text-xl" />
            </button>
          </div>
        ) : (
          <div className="text-center min-w-40 flex flex-col items-center justify-center h-40 border-2 border-dashed border-inactive text-text-inactive rounded-lg">
            {isLoading ? (
              <SpinnerSvg className="p-14 text-inactive fill-primary" />
            ) : (
              <FileSvg className={`${(isError || isErrorEventImages) && "text-system-error"}`} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
