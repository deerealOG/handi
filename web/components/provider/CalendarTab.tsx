"use client";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";
import { useState } from "react";
import { MOCK_CALENDAR_EVENTS } from "./data";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [view, setView] = useState<"month" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (dateStr: string) =>
    MOCK_CALENDAR_EVENTS.filter((e) => e.date === dateStr);

  const formatDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const dayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-500";
      case "pending": return "bg-orange-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Calendar</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              view === "month" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              view === "day" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Day
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <h3 className="text-lg font-bold text-gray-900">
              {MONTHS[month]} {year}
            </h3>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDateStr(day);
              const events = getEventsForDate(dateStr);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    if (events.length > 0) setView("day");
                  }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-md"
                      : isToday
                        ? "bg-emerald-50 text-emerald-700 font-bold ring-2 ring-emerald-200"
                        : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className={`${isSelected ? "font-bold" : ""}`}>{day}</span>
                  {events.length > 0 && (
                    <div className="flex gap-0.5">
                      {events.slice(0, 3).map((e, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : statusColor(e.status)}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day View / Event Details */}
        <div className="w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">
              {selectedDate
                ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a date"}
            </h3>
            {dayEvents.length > 0 ? (
              <div className="space-y-3">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors cursor-pointer border border-transparent hover:border-emerald-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${statusColor(event.status)}`} />
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> {event.client}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 inline-block">
                      Duration: {event.duration}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No bookings scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400">Service</p>
                <p className="text-sm font-semibold text-gray-900">{selectedEvent.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Client</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEvent.client}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Status</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                    selectedEvent.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {selectedEvent.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEvent.time}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEvent.duration}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2.5 mt-4 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
