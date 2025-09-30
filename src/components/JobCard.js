// 📌 Install date-fns first if not already:
// npm install date-fns

import { differenceInCalendarDays, parseISO } from "date-fns";

export default function JobCard({ job }) {
  // ✅ Status colors for each application stage
  const statusColor = {
    Applied: "bg-blue-200 text-blue-800",
    Interview: "bg-yellow-200 text-yellow-800",
    Offer: "bg-green-200 text-green-800",
    Rejected: "bg-red-200 text-red-800",
  };

  // ✅ Parse the deadline and calculate days left
  const deadlineDate = job.deadline
    ? typeof job.deadline === "string"
      ? new Date(job.deadline)
      : new Date(job.deadline)
    : null;

  const daysLeft = deadlineDate
    ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  // ✅ Highlight job cards based on deadline status
  const highlightClass =
    daysLeft !== null && daysLeft <= 3 && daysLeft >= 0
      ? "ring-2 ring-yellow-300" // ⏰ Deadline soon
      : daysLeft !== null && daysLeft < 0
      ? "ring-2 ring-red-300" // ❌ Overdue
      : "";

  return (
    <div className={`bg-white p-4 rounded shadow ${highlightClass}`}>
      <h3 className="text-xl font-bold">{job.company}</h3>
      <p className="text-gray-700">{job.role}</p>

      <p
        className={`inline-block mt-2 px-2 py-1 rounded ${
          statusColor[job.status] || "bg-gray-200 text-gray-800"
        }`}
      >
        {job.status}
      </p>

      {/* ✅ Show deadline date */}
      {job.deadline && (
        <p className="mt-1 text-sm text-gray-500">
          Deadline: {new Date(job.deadline).toLocaleDateString()}
        </p>
      )}

      {/* ✅ Show how many days left or overdue */}
      {daysLeft !== null && (
        <p
          className={`text-sm mt-1 ${
            daysLeft < 0 ? "text-red-600 font-semibold" : "text-yellow-700"
          }`}
        >
          {daysLeft < 0
            ? `⚠️ Overdue by ${Math.abs(daysLeft)} day(s)`
            : `⏰ ${daysLeft} day(s) left`}
        </p>
      )}
    </div>
  );
}
