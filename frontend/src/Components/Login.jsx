import { useState } from "react";
import React from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || "An error occurred. Please try again.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      console.log("Token stored:", data.accessToken); // Debugging line
      setMessage("Login successful!");
      navigate('/'); // Redirect to home or dashboard
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="border rounded-lg bg-white w-[500px] p-8 shadow">
        <h1 className="text-3xl font-bold">Login Account</h1>
        <div className="py-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2.5"
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2.5"
                placeholder="Password@123"
                required
              />
            </div>
            <div className="btn">
              <button className="w-full p-2.5 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Log in
              </button>
            </div>
            {message && <p className="text-red-500">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
