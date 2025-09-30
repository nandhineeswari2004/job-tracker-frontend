import { useState } from "react";
import API from "../services/api";

export default function Login({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.user); // pass user info to App
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Login</h2>

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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Login
        </button>

        {message && <p className="mt-4 text-red-500">{message}</p>}

        {/* 👇 Add this to go to signup */}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={onSwitch}
          >
            Create one
          </button>
        </p>
      </form>
    </div>
  );
}
