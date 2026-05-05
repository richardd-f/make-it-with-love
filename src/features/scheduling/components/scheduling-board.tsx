"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getAvailableSlots, bookAppointment } from "../actions/scheduling.action";
import { ITimeSlotGroup, ITimeSlot } from "../interfaces/scheduling.types";
import { DateCarousel } from "./date-carousel";
import { TimeSlotList } from "./time-slot-list";
import { BookingModal } from "./booking-modal";

export function SchedulingBoard({ courseId }: { courseId: string }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [groups, setGroups] = useState<ITimeSlotGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Selection & Modal State
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookedSlotId, setBookedSlotId] = useState<string | null>(null);

  // Generate the next 30 days for the carousel
  const carouselDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Fetch slots whenever the selected date changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getAvailableSlots(courseId, selectedDate.toISOString())
      .then((data) => {
        if (isMounted) {
          setGroups(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load slots:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [courseId, selectedDate]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    // Don't reset booked slot if they are just browsing dates, 
    // but maybe we want to visual clear selectedSlot if it's not booked yet
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: ITimeSlot) => {
    // If it's already booked, maybe prevent re-booking or show warning
    if (bookedSlotId === slot.id) return;
    
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      const result = await bookAppointment(selectedSlot.id, courseId);
      if (result.success) {
        setBookedSlotId(selectedSlot.id);
        setIsModalOpen(false);
        // Optionally show a toast notification here
      }
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <DateCarousel 
        dates={carouselDates} 
        selectedDate={selectedDate} 
        onSelectDate={handleSelectDate} 
      />

      <div className="w-full mt-4">
        <TimeSlotList 
          groups={groups} 
          selectedSlotId={bookedSlotId || selectedSlot?.id || null} 
          onSelectSlot={handleSelectSlot} 
          isLoading={isLoading} 
        />
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        slot={selectedSlot}
        onConfirm={handleConfirmBooking}
        onCancel={() => setIsModalOpen(false)}
        isBooking={isBooking}
      />
    </div>
  );
}
