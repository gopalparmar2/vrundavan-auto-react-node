import * as React from "react";
import { Popover } from "radix-ui";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

// Safe local date parsing to prevent time-zone offsets
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
};

const formatLocalDateYYYYMMDD = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (dateStr) => {
  const date = parseLocalDate(dateStr);
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const DatePicker = React.forwardRef(({ className, value, onChange, placeholder, disabled, name, id, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const selectedDate = React.useMemo(() => parseLocalDate(value), [value]);

  const [currentMonth, setCurrentMonth] = React.useState(() => selectedDate || new Date());

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  const handlePrevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDay = (date, e) => {
    e.preventDefault();
    e.stopPropagation();
    const formatted = formatLocalDateYYYYMMDD(date);
    if (onChange) {
      onChange({
        target: {
          name: name || id,
          id: id,
          value: formatted,
        }
      });
    }
    setOpen(false);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const cells = React.useMemo(() => {
    const grid = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthTotalDays - i;
      grid.push({
        date: new Date(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, day),
        isCurrentMonth: false,
        label: day,
      });
    }

    for (let day = 1; day <= totalDays; day++) {
      grid.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
        label: day,
      });
    }

    const remaining = 42 - grid.length;
    for (let day = 1; day <= remaining; day++) {
      grid.push({
        date: new Date(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, day),
        isCurrentMonth: false,
        label: day,
      });
    }

    return grid;
  }, [year, month, firstDayIndex, totalDays, prevMonthTotalDays]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const todayStr = formatLocalDateYYYYMMDD(new Date());

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          ref={ref}
          disabled={disabled}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 shadow-sm text-left font-normal",
            !value && "text-slate-400 dark:text-slate-500",
            className
          )}
          {...props}
        >
          <span className="flex items-center truncate">
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            {value ? formatDisplayDate(value) : (placeholder || "Pick a date")}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="relative z-50 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-slate-800 dark:text-slate-100 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
          sideOffset={4}
          align="start"
        >
          <div className="w-64 space-y-3">
            {/* Calendar Header */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 px-1">
                {monthNames[month]} {year}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <span key={d} className="w-8 h-6 flex items-center justify-center">{d}</span>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, idx) => {
                const isSelected = selectedDate && formatLocalDateYYYYMMDD(cell.date) === formatLocalDateYYYYMMDD(selectedDate);
                const isToday = formatLocalDateYYYYMMDD(cell.date) === todayStr;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleSelectDay(cell.date, e)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none",
                      !cell.isCurrentMonth && "text-slate-300 dark:text-slate-600",
                      isToday && "border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-bold",
                      isSelected && "bg-indigo-600 text-white hover:bg-indigo-500 font-bold shadow-sm"
                    )}
                  >
                    {cell.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});
DatePicker.displayName = "DatePicker";

export { DatePicker };
