"use client"

interface StageItemProps {
  title: string
  value: string
  amount: string
  items: {
    label: string
    value: string
    amount?: string
  }[]
}

export function StageItem({ title, value, amount, items }: StageItemProps) {
  return (
    <div className="p-4 space-y-3 bg-cards-container rounded-lg">
      <div className="flex justify-between items-center border-b pb-4 border-divider">
        <span className="text-main-white font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-primary font-medium">{value}</span>
          <span className="text-primary text-sm">({amount})</span>
        </div>
      </div>

      <div className="space-y-2 ml-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-text-inactive text-sm">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-primary text-sm">{item.value}</span>
              {item.amount && <span className="text-primary text-xs">({item.amount})</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
