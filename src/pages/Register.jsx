import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        alert("All fields are required");
        return;
      }

      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      // ❌ DO NOT store token here
      // ❌ DO NOT go to dashboard

      // ✅ correct flow
      alert("Registration successful! Please login.");
      navigate("/login");

    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("RESPONSE:", err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center 
  bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500">

    {/* Card */}
    <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-[380px]">

      {/* Logo */}
      <img
        src="/logo.png"
        alt="logo"
        className="w-16 mx-auto mb-4"
      />

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
        Create Account 🚀
      </h2>

      {/* Inputs */}
      <div className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Name"
          className="border p-3 rounded-lg focus:outline-none 
          focus:ring-2 focus:ring-green-400 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none 
          focus:ring-2 focus:ring-green-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none 
          focus:ring-2 focus:ring-green-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="bg-green-500 text-white py-3 rounded-lg 
          hover:bg-green-600 hover:scale-105 transition"
        >
          Register
        </button>

      </div>

      {/* Footer */}
      <p className="text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>

    </div>
  </div>
);
}