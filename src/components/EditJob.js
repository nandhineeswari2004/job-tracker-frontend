// src/components/EditJob.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EditJob() {
  const { id } = useParams(); // ✅ get job id from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    role: "",
    applied_through: "",
    interview_date: "",
    deadline: "",
    status: "Applied",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ✅ Fetch job data when component loads
  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await API.get(`/jobs/${id}`);
        const job = res.data;
        setForm({
          company: job.company || "",
          role: job.role || "",
          applied_through: job.applied_through || "",
          interview_date: job.interview_date
            ? job.interview_date.slice(0, 10)
            : "",
          deadline: job.deadline ? job.deadline.slice(0, 10) : "",
          status: job.status || "Applied",
        });
      } catch (err) {
        console.error(err);
        setMessage("⚠️ Failed to load job details");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      const payload = {
        company: form.company,
        role: form.role,
        status: form.status,
        deadline: form.deadline === "" ? null : form.deadline,
        applied_through:
          form.applied_through === "" ? null : form.applied_through,
        interview_date:
          form.interview_date === "" ? null : form.interview_date,
      };

      await API.put(`/jobs/${id}`, payload);
      setMessage("✅ Updated successfully");
      setTimeout(() => navigate("/dashboard"), 1500); // go back to dashboard
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this job? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await API.delete(`/jobs/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p className="p-4 text-center">Loading job...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Job</h3>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500"
          >
            ✕ Close
          </button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-3">
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company"
            className="border p-2 rounded"
          />
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role"
            className="border p-2 rounded"
          />
          <input
            name="applied_through"
            value={form.applied_through}
            onChange={handleChange}
            placeholder="Applied through"
            className="border p-2 rounded"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Interview Date</label>
              <input
                type="date"
                name="interview_date"
                value={form.interview_date}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="text-sm">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <div className="flex gap-2 justify-between items-center mt-2">
            <div>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="ml-2 px-3 py-2 border rounded"
              >
                Reset
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2 bg-red-500 text-white rounded"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {message && <div className="text-sm mt-2">{message}</div>}
        </form>
      </div>
    </div>
  );
}
