import { getEventSummaries, getRecentEvents, getTotalUsers, getBookingInterestByCourse } from "@/src/features/analytics/actions/get-analytics.action";

const EVENT_LABELS: Record<string, { label: string; color: string }> = {
  REGISTER_VIEW: { label: "Register Page Views", color: "#32a569" },
  REGISTER_SUBMIT: { label: "Completed Registrations", color: "#32a569" },
  BUY_COURSE_CLICK: { label: "Course Buy Clicks", color: "#f79d1c" },
  BUY_SUBSCRIPTION_CLICK: { label: "Subscription Clicks", color: "#ea7c9d" },
  BUY_DIY_KIT_CLICK: { label: "DIY Kit Interest Clicks", color: "#e4552c" },
  GALLERY_ZOOM_CLICK: { label: "Gallery Image Zooms", color: "#f79d1c" },
  GALLERY_ADD_IMAGE_CLICK: { label: "Add to Gallery Clicks", color: "#ea7c9d" },
  BOOK_ZOOM_MEETING_CLICK: { label: "Book Zoom Meeting Clicks", color: "#32a569" },
};

function formatDate(date: Date | null) {
  if (!date) return "Never";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

export default async function AdminAnalyticsPage() {
  const [summaries, recentEvents, totalUsers, bookingsByCourse] = await Promise.all([
    getEventSummaries(),
    getRecentEvents(30),
    getTotalUsers(),
    getBookingInterestByCourse(),
  ]);

  const totalRegistered = summaries.find(s => s.action === "REGISTER_SUBMIT")?.count ?? 0;
  const totalBookings = summaries.find(s => s.action === "BOOK_ZOOM_MEETING_CLICK")?.count ?? 0;
  const totalSubClicks = summaries.find(s => s.action === "BUY_SUBSCRIPTION_CLICK")?.count ?? 0;

  return (
    <main
      className="min-h-screen w-full px-4 sm:px-8 py-12 flex flex-col gap-10"
      style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
    >
      {/* Header */}
      <div>
        <h1 className="font-family-papernotes text-5xl text-[#32a569] mb-2">MVP Analytics Dashboard</h1>
        <p className="text-gray-500 text-lg">Track user interest and engagement across MakeitWithLove.</p>
      </div>

      {/* Top-level KPI Row */}
      <div className="flex flex-wrap gap-6">
        {[
          { label: "Total Users", value: totalUsers, color: "#32a569" },
          { label: "Registered", value: totalRegistered, color: "#f79d1c" },
          { label: "Zoom Bookings", value: totalBookings, color: "#ea7c9d" },
          { label: "Subscription Clicks", value: totalSubClicks, color: "#e4552c" },
        ].map(kpi => (
          <div
            key={kpi.label}
            className="flex-1 min-w-[180px] bg-white rounded-3xl p-6 shadow-md border-t-4 flex flex-col gap-2"
            style={{ borderColor: kpi.color }}
          >
            <span className="text-4xl font-black" style={{ color: kpi.color }}>{kpi.value}</span>
            <span className="text-gray-500 font-semibold text-sm uppercase tracking-widest">{kpi.label}</span>
          </div>
        ))}
      </div>

      {/* Event Summary Cards */}
      <section>
        <h2 className="font-family-papernotes text-3xl text-gray-700 mb-6">Event Breakdown</h2>
        <div className="flex flex-wrap gap-5">
          {summaries.map(s => {
            const meta = EVENT_LABELS[s.action] ?? { label: s.action, color: "#888" };
            return (
              <div
                key={s.action}
                className="flex-1 min-w-[220px] bg-white rounded-2xl p-6 shadow border-l-4 flex flex-col gap-3"
                style={{ borderColor: meta.color }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700 text-base">{meta.label}</span>
                </div>
                <span className="text-5xl font-black" style={{ color: meta.color }}>{s.count}</span>
                <span className="text-xs text-gray-400">Last: {formatDate(s.latest)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking Interest by Course */}
      {bookingsByCourse.length > 0 && (
        <section>
          <h2 className="font-family-papernotes text-3xl text-gray-700 mb-6">🎥 Zoom Booking Interest by Course</h2>
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#f6e5c4] text-gray-700">
                <tr>
                  <th className="text-left px-6 py-4 font-bold">Course</th>
                  <th className="text-right px-6 py-4 font-bold">Interested Users</th>
                </tr>
              </thead>
              <tbody>
                {bookingsByCourse
                  .sort((a, b) => b.count - a.count)
                  .map((row, i) => (
                    <tr key={row.courseId} className={i % 2 === 0 ? "bg-white" : "bg-[#f6e5c4]/20"}>
                      <td className="px-6 py-4 font-semibold text-gray-800">{row.courseName}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-[#ea7c9d] text-white font-bold px-3 py-1 rounded-full text-sm">
                          {row.count}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent Activity Log */}
      <section>
        <h2 className="font-family-papernotes text-3xl text-gray-700 mb-6">Recent Activity (Last 30 Events)</h2>
        <div className="bg-white rounded-3xl shadow-md overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f6e5c4] text-gray-700">
              <tr>
                <th className="text-left px-6 py-4 font-bold">Time</th>
                <th className="text-left px-6 py-4 font-bold">Event</th>
                <th className="text-left px-6 py-4 font-bold">Details</th>
                <th className="text-left px-6 py-4 font-bold">User</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event, i) => {
                const meta = EVENT_LABELS[event.action] ?? { label: event.action, color: "#888" };
                return (
                  <tr key={event.id} className={i % 2 === 0 ? "bg-white" : "bg-[#f6e5c4]/20"}>
                    <td className="px-6 py-3 text-gray-400 whitespace-nowrap">{formatDate(event.createdAt)}</td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2 font-semibold" style={{ color: meta.color }}>
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{event.details ?? "—"}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {event.user ? (
                        <div>
                          <div className="font-semibold">{event.user.name}</div>
                          <div className="text-xs text-gray-400">{event.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-300 italic">Anonymous</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
