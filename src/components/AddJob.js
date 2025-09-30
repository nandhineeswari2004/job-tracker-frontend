import { useState } from "react";
import API from "../services/api";

export default function AddJob({ onJobAdded, onClose }) {
  const [form, setForm] = useState({
    company: "",
    role: "",
    applied_through: "",
    interview_date: "", // YYYY-MM-DD
    deadline: "",       // YYYY-MM-DD (used for reminder)
    status: "Applied",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.company.trim()) return "Company name is required";
    if (!form.role.trim()) return "Role is required";
    // optional: require deadline? not mandatory
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const err = validate();
    if (err) { setMessage(err); return; }

    setLoading(true);
    try {
      // send payload to backend
      const payload = {
        company: form.company,
        role: form.role,
        status: form.status,
        deadline: form.deadline || null,
        applied_through: form.applied_through || null,
        interview_date: form.interview_date || null,
      };

      // POST /api/jobs (API wrapper automatically adds Authorization header)
      await API.post("/jobs", payload);

      setMessage("✅ Job added successfully!");
      setForm({
        company: "",
        role: "",
        applied_through: "",
        interview_date: "",
        deadline: "",
        status: "Applied",
      });

      if (onJobAdded) onJobAdded(); // refresh parent list
      // optional: close the form
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:720, margin:"16px auto", background:"#fff", padding:18, borderRadius:8, boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
      <h3 style={{marginBottom:10}}>Add New Job</h3>

      <form onSubmit={handleSubmit} style={{display:"grid", gap:10}}>
        <input name="company" placeholder="Company name" value={form.company} onChange={handleChange} />
        <input name="role" placeholder="Role / Position" value={form.role} onChange={handleChange} />
        <input name="applied_through" placeholder="Applied through (e.g., LinkedIn, Referral)" value={form.applied_through} onChange={handleChange} />

        <label style={{fontSize:13, color:"#374151"}}>Interview / Test scheduled on (optional)</label>
        <input name="interview_date" type="date" value={form.interview_date} onChange={handleChange} />

        <label style={{fontSize:13, color:"#374151"}}>Deadline (used for reminder; optional)</label>
        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />

        <label style={{fontSize:13, color:"#374151"}}>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <div style={{display:"flex", gap:8}}>
          <button type="submit" style={{padding:"8px 12px"}} disabled={loading}>
            {loading ? "Saving..." : "Add Job"}
          </button>
          {onClose && <button type="button" onClick={onClose} style={{padding:"8px 12px"}}>Cancel</button>}
        </div>

        {message && <div style={{marginTop:8, color: message.startsWith("✅") ? "green" : "crimson"}}>{message}</div>}
      </form>
    </div>
  );
}
