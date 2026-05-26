export interface IScheduleTeacher {
  id: string;
  name: string;
  photo: string | null;
}

export interface ITimeSlot {
  id: string;
  teacher: IScheduleTeacher;
  startTime: Date;
  endTime: Date;
  status: "AVAILABLE" | "BOOKED";
}

export interface ITimeSlotGroup {
  timeLabel: string;
  startTime: Date;
  slots: ITimeSlot[];
}

export interface IEnrollmentDetails {
  id: string;
  courseId: string;
  meetingsAmountLeft: number;
}
