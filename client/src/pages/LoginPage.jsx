import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function LoginPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Authenticating...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        const res = await api.get(`/auth/magic-login/${token}`);
        localStorage.setItem("user", JSON.stringify(res.data));
        setMessage("✅ ACCESS GRANTED");

        // 🎯 Vibrate (200ms)
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        setSuccess(true);

        // Redirect after delay
        setTimeout(() => navigate("/profile"), 2000);
      } catch (err) {
        setMessage("❌ ACCESS DENIED");
        setSuccess(false);
      }
    };
    login();
  }, [token, navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        success ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-80 text-center animate-bounce">
        {/* ✅ Logo (optional) */}
        <img
          src="/logo.png"
          alt="PrivateRoom Logo"
          className="w-16 h-16 mx-auto mb-4"
        />
        {/* <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          PrivateRoom
        </h1> */}

        <p className="text-3xl font-bold mb-4">{message}</p>
        <p className="text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  );
}
