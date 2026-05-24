import React from "react";
import { getMyMeetings } from "@/src/features/courses/actions/get-my-meetings.action";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "My Meetings | Make It With Love",
};

export default async function MyMeetingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const meetings = await getMyMeetings();

  const now = new Date();

  return (
    <main className="min-h-screen relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-6xl font-family-papernotes text-gray-800 mb-2">My Meetings</h1>
        <p className="text-gray-500 font-sans text-lg">Your booked online sessions with teachers.</p>
      </div>

      {meetings.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-24">
          <div className="text-8xl">📅</div>
          <h2 className="text-3xl font-family-papernotes text-gray-500">No meetings booked yet</h2>
          <p className="text-gray-400 font-sans text-center max-w-md">
            Once you enroll in a course, you can schedule meetings with teachers from the course page.
          </p>
          <Link
            href="/courses"
            className="px-8 py-4 bg-[#32a569] text-white font-bold text-xl rounded-full hover:bg-[#28915a] transition-colors font-family-papernotes tracking-widest"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {meetings.map((meeting) => {
            const isUpcoming = new Date(meeting.startTime) > now;
            const isToday =
              new Date(meeting.startTime).toDateString() === now.toDateString();

            return (
              <div
                key={meeting.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-[2rem] p-6 shadow-lg border-2 ${
                  isUpcoming ? "border-[#32a569]/30" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  {meeting.teacherPhoto ? (
                    <img
                      src={meeting.teacherPhoto}
                      alt={meeting.teacherName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#f79d1c] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ea7c9d] to-[#f79d1c] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {meeting.teacherName[0]}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-family-papernotes text-xl text-gray-800">{meeting.courseTitle}</span>
                    <span className="text-sm font-bold text-gray-600">with {meeting.teacherName}</span>
                    <span className="text-sm text-gray-400 font-sans">
                      {new Date(meeting.startTime).toLocaleString("id-ID", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                      {" – "}
                      {new Date(meeting.endTime).toLocaleTimeString("id-ID", { timeStyle: "short" })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {isUpcoming && (
                    <span className="px-3 py-1 bg-[#32a569]/10 text-[#32a569] rounded-full text-xs font-bold uppercase tracking-widest border border-[#32a569]/20">
                      {isToday ? "Today!" : "Upcoming"}
                    </span>
                  )}

                  {meeting.meetingUrl ? (
                    <a
                      href={meeting.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-[#32a569] hover:bg-[#28915a] text-white font-bold rounded-full transition-colors font-family-papernotes text-base tracking-widest"
                    >
                      Join Meeting →
                    </a>
                  ) : isUpcoming ? (
                    <span className="text-xs text-gray-400 font-sans text-right">
                      Meeting link available<br />15 min before start
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300 font-sans">Completed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
