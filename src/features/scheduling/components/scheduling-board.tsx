"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { getCourseAvailableSlots, bookAppointment } from "../actions/scheduling.action";
import { ITimeSlotGroup, ITimeSlot } from "../interfaces/scheduling.types";
import { CalendarMonth, localDateKey } from "./calendar-month";
import { TimeSlotList } from "./time-slot-list";
import { BookingModal } from "./booking-modal";

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function SchedulingBoard({ courseId }: { courseId: string }) {
  const [slots, setSlots] = useState<ITimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [viewDate, setViewDate] = useState<Date>(() => startOfMonth(new Date()));

  // Selection & Modal State
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const loadSlots = useCallback(() => {
    setIsLoading(true);
    return getCourseAvailableSlots(courseId)
      .then((data) => setSlots(data))
      .catch((err) => console.error("Failed to load slots:", err))
      .finally(() => setIsLoading(false));
  }, [courseId]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // Local date keys (YYYY-MM-DD) that have at least one available slot.
  const daysWithSlots = useMemo(
    () => new Set(slots.map((s) => localDateKey(new Date(s.startTime)))),
    [slots]
  );

  // Slots for the selected day, grouped by their start–end time label.
  const groups = useMemo<ITimeSlotGroup[]>(() => {
    const key = localDateKey(selectedDate);
    const daySlots = slots.filter((s) => localDateKey(new Date(s.startTime)) === key);

    const timeMap = new Map<string, ITimeSlot[]>();
    for (const s of daySlots) {
      const start = new Date(s.startTime);
      const end = new Date(s.endTime);
      const label = `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      if (!timeMap.has(label)) timeMap.set(label, []);
      timeMap.get(label)!.push(s);
    }

    return Array.from(timeMap.entries()).map(([timeLabel, slotList]) => ({
      timeLabel,
      startTime: slotList[0].startTime,
      slots: slotList,
    }));
  }, [slots, selectedDate]);

  const currentMonthStart = startOfMonth(new Date());
  const canGoPrev = viewDate > currentMonthStart;

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: ITimeSlot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      const result = await bookAppointment(selectedSlot.id, courseId);
      if (result.success) {
        setIsModalOpen(false);
        setSelectedSlot(null);
        toast.success(result.message);
        // Refetch so the now-booked slot drops out of the available list.
        await loadSlots();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  };

  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full flex flex-col">
      <CalendarMonth
        viewDate={viewDate}
        selectedDate={selectedDate}
        daysWithSlots={daysWithSlots}
        onSelectDate={handleSelectDate}
        onPrevMonth={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
        onNextMonth={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
        canGoPrev={canGoPrev}
      />

      <div className="w-full mt-8 border-t-2 border-gray-100 pt-6">
        <h3
          className="font-family-papernotes text-2xl text-[#32a569] mb-4"
        >
          {selectedDateLabel}
        </h3>
        <TimeSlotList
          groups={groups}
          selectedSlotId={selectedSlot?.id || null}
          onSelectSlot={handleSelectSlot}
          isLoading={isLoading}
        />
      </div>

      <BookingModal
        isOpen={isModalOpen}
        slot={selectedSlot}
        onConfirm={handleConfirmBooking}
        onCancel={() => {
          setIsModalOpen(false);
          // Clear the pending selection so the slot button reverts to "Select"
          // instead of staying on "Selected ✓" for an unbooked slot.
          setSelectedSlot(null);
        }}
        isBooking={isBooking}
      />
    </div>
  );
}
