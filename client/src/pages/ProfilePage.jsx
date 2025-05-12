import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return <div>Not logged in. Go back.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
      <h2 className="text-xl font-bold mb-4">Welcome to PrivateRoom</h2>
      <p className="mb-2">
        <strong>Name:</strong> {user.name}
      </p>
      {/* <p className="mb-2">
        <strong>User ID:</strong> {user.userId}
      </p> */}
      <p className="mb-4">
        <strong>Email:</strong> {user.email}
      </p>
      <button
        onClick={logout}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
