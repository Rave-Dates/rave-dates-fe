"use client"

interface CircularProgressProps {
  current: number
  total: number
  size?: number
}

export function CircularProgress({ current, total, size = 60 }: CircularProgressProps) {
  const percentage = Math.min((current / total) * 100, 100)
  const radius = (size - 8) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgb(64 64 64)" strokeWidth="4" fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#c1ff00"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-primary text-sm font-bold">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}
