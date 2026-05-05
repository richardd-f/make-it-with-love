export interface IScheduleMentor {
  id: string;
  name: string;
  photo: string | null;
}

export interface ITimeSlot {
  id: string; // mentorAvailability id
  mentor: IScheduleMentor;
  startTime: Date;
  endTime: Date;
  status: "AVAILABLE" | "BOOKED";
  meetingId: string | null; // null if available, set if booked
}

export interface ITimeSlotGroup {
  timeLabel: string; // e.g. "10:00 AM - 11:00 AM"
  startTime: Date;
  slots: ITimeSlot[];
}

export interface IEnrollmentDetails {
  id: string;
  courseId: string;
  meetingsAmountLeft: number;
}
