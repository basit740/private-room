import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function LoginPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Logging in...");

  useEffect(() => {
    const login = async () => {
      try {
        const res = await api.get(`/auth/magic-login/${token}`);
        localStorage.setItem("user", JSON.stringify(res.data));
        setMessage("Access Granted! Redirecting...");

        // Play sound
        const audio = new Audio("/success_beep.mp3");
        audio.play();

        // Redirect after beep
        setTimeout(() => navigate("/profile"), 1500);
      } catch (err) {
        setMessage("Access Denied. Invalid or expired link.");
      }
    };
    login();
  }, [token, navigate]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
      <h2 className="text-xl font-bold mb-4">PrivateRoom Login</h2>
      <p>{message}</p>
    </div>
  );
}
