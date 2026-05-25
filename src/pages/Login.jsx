import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      // ✅ store token (important for API calls)
      localStorage.setItem("token", data.token);

      // context (if you’re using it)
      login(data);

      navigate("/dashboard");
    } catch (err) {
  console.error("LOGIN ERROR:", err.response?.data);
  alert(err.response?.data?.message || "Login failed");
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
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Welcome Buddy 🫂
      </h2>

      {/* Inputs */}
      <div className="flex flex-col gap-4">

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none 
          focus:ring-2 focus:ring-blue-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none 
          focus:ring-2 focus:ring-blue-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-3 rounded-lg 
          hover:bg-blue-600 hover:scale-105 transition"
        >
          Login
        </button>

      </div>

      {/* Footer */}
      <p className="text-center text-gray-600 mt-6">
        Don’t have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>

    </div>
  </div>
);
}