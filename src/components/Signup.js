import { useState } from "react";
import API from "../services/api";

export default function Signup({ onSignup }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/signup", form);
      setMessage(res.data.message);
      // 👇 Automatically go to login page after signup success
      setTimeout(() => onSignup(), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Sign Up
        </button>

        {message && <p className="mt-4 text-green-500">{message}</p>}

        {/* 👇 Add this to go back to login */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={onSignup}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
