"use client"

import { Button } from "@/components/ui/date-picker/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/date-picker/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/date-picker/calendar"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale/es"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

interface DatePickerProps {
  value?: string; // yyyy-MM-dd
  onChange?: (value: string) => void;
  title?: string;
  className?: string;
}

export default function DatePicker({ value, onChange, title = "Fecha*", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the string value into a Date object for the Calendar
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    try {
      return parse(value, "yyyy-MM-dd", new Date());
    } catch {
      return undefined;
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange?.(formattedDate);
      setOpen(false); // Close the popover on selection
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-2">
      <label className="text-primary-white text-xs font-medium">
        {title}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-main-container border-none h-[56px] rounded-lg text-primary-white hover:bg-input hover:text-primary-white focus:ring-1 focus:ring-primary",
              className,
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
