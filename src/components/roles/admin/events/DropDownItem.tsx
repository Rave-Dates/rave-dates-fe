"use client"

import ArrowDownSvg from "@/components/svg/ArrowDown"
import type React from "react"
import { useEffect, useRef, useState } from "react"


interface DropdownItemProps {
  title: string
  isExpanded?: boolean
  onToggle?: () => void
  children?: React.ReactNode
}

export function DropdownItem({ title, isExpanded = false, onToggle, children }: DropdownItemProps) {
  const [height, setHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  // If its expanded, set height (for animation)
  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0)
    }
  }, [isExpanded, children])
  
  return (
    <>
      <button
        onClick={onToggle}
        className={`${isExpanded ? "rounded-t-lg" : "rounded-lg"} w-full mt-3 flex items-center justify-between py-3 px-4 text-left bg-main-container transition-colors`}
      >
        <div className="flex items-center gap-2">
          <span className="text-primary-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {onToggle &&
            (isExpanded ? (
              <ArrowDownSvg className="rotate-180" />
            ) : (
              <ArrowDownSvg />
            ))}
        </div>
      </button>

      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out" 
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </>
  )
}
