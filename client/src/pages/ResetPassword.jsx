import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { id, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    try {
      const res = await fetch(`/api/auth/reset-password/${id}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      // console.log("Response data:", data);

      if (!data.success) {
        setError(data.message);
        return;
      }

      setMessage("Password reset successful! Redirecting to sign-in page...");
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl text-center font-semibold my-7">Reset Password</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
          Reset Password
        </button>
      </form>

      {message && <p className="text-green-500 mt-5">{message}</p>}
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
