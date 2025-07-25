"use client"

interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100)

  return (
    <div className="space-y-2">
      {label && <div className="text-text-inactive text-sm">{label}</div>}
      <div className="text-primary-white text-lg font-medium">
        {current}/{total}
      </div>
      <div className="w-full bg-inactive rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
