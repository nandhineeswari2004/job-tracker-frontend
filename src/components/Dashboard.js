import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⭐ NEW
import API from "../services/api";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    applied_through: "",
    interview_date: "",
    deadline: "",
    status: "Applied",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ⭐ NEW

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/jobs");
      setJobs(res.data.jobs ?? res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.company || !form.role) {
      setMessage("⚠️ Company and Role are required");
      return;
    }
    try {
      await API.post("/jobs", form);
      setMessage("✅ Job added successfully!");
      setForm({
        company: "",
        role: "",
        applied_through: "",
        interview_date: "",
        deadline: "",
        status: "Applied",
      });
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      setMessage("❌ Failed to add job. Try again.");
      console.error(err);
    }
  };

  // ⭐ NEW: Delete function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (err) {
        console.error("❌ Failed to delete job", err);
      }
    }
  };

  // ✅ Status overview calculation
  const totalJobs = jobs.length;
  const statusCounts = {
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Offer: jobs.filter((j) => j.status === "Offer").length,
    Rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  const percentage = (count) =>
    totalJobs === 0 ? 0 : Math.round((count / totalJobs) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700">📂 My Job Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          {showForm ? "Close Form ✖️" : "➕ Add New Job"}
        </button>
      </header>

      {/* ✅ Status Overview */}
      {totalJobs > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 flex justify-between">
                {status}
                <span className="text-blue-600">{count}</span>
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div
                  className={`h-3 rounded-full ${
                    status === "Applied"
                      ? "bg-blue-500"
                      : status === "Interview"
                      ? "bg-yellow-500"
                      : status === "Offer"
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percentage(count)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{percentage(count)}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Job Form */}
      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl mx-auto mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add Job Details
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="role"
              placeholder="Role / Position"
              value={form.role}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="applied_through"
              placeholder="Applied Through (e.g., LinkedIn)"
              value={form.applied_through}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 col-span-2"
            />
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Interview Date
              </label>
              <input
                type="date"
                name="interview_date"
                value={form.interview_date}
                onChange={handleChange}
                className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Deadline (for reminder)
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="col-span-2 text-center mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                ✅ Add Job
              </button>
              {message && (
                <p className="mt-3 text-sm text-center text-gray-700">
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Job List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          📁 Jobs You Applied For
        </h2>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">
            No jobs added yet. Click "Add New Job" to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id || job._id}
                className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-blue-700">
                  {job.company}
                </h3>
                <p className="text-gray-700 mt-1">{job.role}</p>
                {job.applied_through && (
                  <p className="text-sm text-gray-500 mt-1">
                    📬 Applied through: {job.applied_through}
                  </p>
                )}
                <p
                  className={`text-sm mt-1 ${
                    job.interview_date ? "text-gray-500" : "text-red-500"
                  }`}
                >
                  🗓️ Interview:{" "}
                  {job.interview_date
                    ? new Date(job.interview_date).toLocaleDateString()
                    : "Not Scheduled"}
                </p>
                {job.deadline && (
                  <p className="text-sm text-gray-500 mt-1">
                    ⏰ Reminder set for:{" "}
                    {new Date(job.deadline).toLocaleDateString()}
                  </p>
                )}
                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-white text-sm ${
                    job.status === "Applied"
                      ? "bg-blue-500"
                      : job.status === "Interview"
                      ? "bg-yellow-500"
                      : job.status === "Offer"
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                >
                  {job.status}
                </span>

                {/* ⭐ Edit & Delete Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate(`/edit-job/${job.id || job._id}`)}
                    className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id || job._id)}
                    className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
