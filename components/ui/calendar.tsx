"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerSingleProps, CaptionProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = Omit<DayPickerSingleProps, "mode">;

// ✅ Custom Caption Component
function CustomCaption({ displayMonth, onMonthChange }: CaptionProps & { onMonthChange: (month: Date) => void }) {
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const years = Array.from({ length: 200 }, (_, i) => 1900 + i); // Years from 1900 to 2099

  return (
    <div className="flex items-center justify-center space-x-2">
      <select
        className="border rounded-md p-1 bg-white cursor-pointer"
        value={displayMonth.getMonth()}
        onChange={(e) => onMonthChange(new Date(displayMonth.getFullYear(), Number(e.target.value)))}
      >
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>

      <select
        className="border rounded-md p-1 bg-white cursor-pointer"
        value={displayMonth.getFullYear()}
        onChange={(e) => onMonthChange(new Date(Number(e.target.value), displayMonth.getMonth()))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

// ✅ Main Calendar Component
function Calendar({ className, classNames = {}, showOutsideDays = true, ...props }: CalendarProps) {
  const [month, setMonth] = React.useState(new Date()); // Control the displayed month

  return (
    <DayPicker
      mode="single"
      month={month} // ✅ Control displayed month
      onMonthChange={setMonth} // ✅ Update state when month changes
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: (props) => <CustomCaption {...props} onMonthChange={setMonth} />, // ✅ Pass control function
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";
export { Calendar };
