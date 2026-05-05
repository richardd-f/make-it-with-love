"use server";

import { ITimeSlotGroup, ITimeSlot, IScheduleMentor } from "../interfaces/scheduling.types";

// Mock Mentors
const mentors: IScheduleMentor[] = [
  { id: "m1", name: "Miss Sarah", photo: null },
  { id: "m2", name: "Mr. Alex", photo: null },
  { id: "m3", name: "Miss Chloe", photo: null },
];

// Helper to add days to a date
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Generate deterministic mock slots for a given date
export async function getAvailableSlots(courseId: string, dateStr: string): Promise<ITimeSlotGroup[]> {
  // Add an artificial delay to simulate network
  await new Promise(resolve => setTimeout(resolve, 800));

  const requestedDate = new Date(dateStr);
  const groups: ITimeSlotGroup[] = [];

  // Use the date day to deterministically seed some random-looking availability
  const day = requestedDate.getDate();
  
  // No slots on Sundays
  if (requestedDate.getDay() === 0) return [];

  // Generate 3 time slots per day
  const hours = [10, 13, 15]; // 10 AM, 1 PM, 3 PM
  
  for (const hour of hours) {
    // Only add this time slot for some days to make it varied
    if ((day + hour) % 3 === 0 && hour === 15) continue;

    const startTime = new Date(requestedDate);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(hour + 1, 0, 0, 0);

    const timeLabel = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const slots: ITimeSlot[] = [];

    // Assign mentors to this slot based on some math so it's consistent
    if ((day + hour) % 2 === 0) {
      slots.push({
        id: `slot-${day}-${hour}-m1`,
        mentor: mentors[0],
        startTime,
        endTime,
        status: "AVAILABLE",
        meetingId: null
      });
    }

    if ((day * hour) % 2 !== 0) {
      slots.push({
        id: `slot-${day}-${hour}-m2`,
        mentor: mentors[1],
        startTime,
        endTime,
        status: "AVAILABLE",
        meetingId: null
      });
    }

    // Sometimes they are all available
    if ((day + hour) % 5 === 0 || slots.length === 0) {
      slots.push({
        id: `slot-${day}-${hour}-m3`,
        mentor: mentors[2],
        startTime,
        endTime,
        status: "AVAILABLE",
        meetingId: null
      });
    }

    groups.push({
      timeLabel,
      startTime,
      slots
    });
  }

  return groups;
}

export async function bookAppointment(availabilityId: string, courseId: string): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Here we would normally interact with Prisma:
  // 1. Create a Meeting record
  // 2. Update MentorAvailability status to BOOKED
  // 3. Decrement Enrollment meetingsAmountLeft
  
  return {
    success: true,
    message: "Meeting scheduled successfully!"
  };
}
