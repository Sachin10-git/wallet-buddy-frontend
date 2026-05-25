import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const phrases = [
  "Track smarter. Spend wiser.",
  "Your money, your control.",
  "Every rupee matters.",
  "Small savings. Big future.",
  "Manage expenses like a pro."
];

export default function Landing() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  // 🔥 dynamic text
  useEffect(() => {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const interval = setInterval(() => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    setText(currentPhrase.substring(0, charIndex));

    // when full word typed
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
    }

    // when fully deleted → next word
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

  }, isDeleting ? 40 : 80); // typing vs deleting speed

  return () => clearInterval(interval);
}, []);

  return (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden
  bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500">

    {/* 🔥 subtle overlay for depth */}
    <div className="absolute inset-0 bg-black/20"></div>

    {/* 🔥 glow effects */}
    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
    <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-400 rounded-full blur-3xl opacity-30"></div>

    {/* 🔥 MAIN CARD */}
    <div className="relative bg-white p-12 rounded-3xl shadow-2xl text-center w-[400px]">

      <img
        src="/logo.png"
        alt="logo"
        className="w-28 mx-auto mb-6 hover:scale-110 transition"
      />

      <h1 className="text-5xl font-extrabold text-blue-600 mb-3">
        Wallet Buddy
      </h1>

      <p className="text-gray-700 mb-8 text-lg font-medium h-6">
  {text}
  <span className="animate-pulse">|</span>
</p>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-8 py-3 rounded-xl 
          hover:bg-blue-600 hover:scale-105 transition text-lg"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-green-500 text-white px-8 py-3 rounded-xl 
          hover:bg-green-600 hover:scale-105 transition text-lg"
        >
          Register
        </button>
      </div>

      <p className="mt-8 text-gray-500 text-sm flex items-center justify-center gap-2">
  <span className="w-6 h-[1px] bg-gray-300"></span>
  Lets Get Started
  <span className="w-6 h-[1px] bg-gray-300"></span>
</p>

    </div>
  </div>
);
}