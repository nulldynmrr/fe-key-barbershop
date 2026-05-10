import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export function MinimalDatePicker({ name, value, onChange, placeholder = "Pilih Tanggal", minDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentMonth(d);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectDate = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    const formattedVal = `${yyyy}-${mm}-${dd}`;
    
    onChange({ target: { name, value: formattedVal } });
    setIsOpen(false);
  };

  const isSelected = (day) => {
    if (!value) return false;
    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) return false;
    return dateValue.getDate() === day && dateValue.getMonth() === currentMonth.getMonth() && dateValue.getFullYear() === currentMonth.getFullYear();
  };

  const isDisabled = (day) => {
    if (!minDate) return false;
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const minD = new Date(minDate);
    minD.setHours(0,0,0,0);
    return dateToCheck < minD;
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return placeholder;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Mg", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-all text-sm ${isOpen ? "border-[#4a1a1a] ring-2 ring-[#4a1a1a]/20" : "border-gray-200 hover:border-gray-300"} ${!value ? "text-gray-400" : "text-[#2b1d19]"}`}
      >
        <span>{formatDateDisplay(value)}</span>
        <CalendarIcon className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-[calc(100%+8px)] left-0 w-[280px] bg-white rounded-xl shadow-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-bold text-sm text-[#2b1d19]">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const disabled = isDisabled(day);
              
              // Cek apakah hari ini
              const today = new Date();
              const isToday = today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDate(day)}
                  className={`h-8 w-full rounded-md text-xs font-semibold transition-all flex items-center justify-center 
                    ${selected 
                      ? "bg-[#4a1a1a] text-white shadow-sm" 
                      : disabled 
                        ? "text-gray-300 cursor-not-allowed bg-gray-50/50" 
                        : isToday 
                          ? "text-[#4a1a1a] bg-gray-100 hover:bg-gray-200"
                          : "text-[#2b1d19] hover:bg-gray-100"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
