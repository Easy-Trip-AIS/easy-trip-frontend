"use client";

import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    emptyUsername: false,
    emptyPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLoginError(""); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = formData;
    const hasErrors = {
      emptyUsername: username.trim() === "",
      emptyPassword: password.trim() === "",
    };

    setErrors(hasErrors);

    if (!hasErrors.emptyUsername && !hasErrors.emptyPassword) {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setLoginError(data?.detail || "Login failed. Try again.");
        } else {
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          window.location.href = "/"; 
        }
      } catch (error) {
        setLoginError("Error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-white z-0"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-screen place-items-center p-8">
        <div className="flex flex-col justify-between h-full text-left text-black p-10">
          <div className="flex flex-col justify-center h-full">
            <h2 className="text-6xl font-bold mb-4">Plan inspiring walks</h2>
            <p className="text-xl text-gray-800 max-w-xl">
              Find the best routes for walks through parks, squares, embankments and other cozy places.
              Our service will help you pave the way where every step is a pleasure.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <div className="flex items-center gap-2">
              <img src="/english.png" alt="English" className="w-6 h-6 rounded-full" />
              <span className="text-black font-medium">English</span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="/" className="text-black font-medium hover:underline">Home</a>
              <a href="#" className="text-black font-medium hover:underline">Terms</a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-1">Sign in</h2>
          <p className="text-sm text-gray-400 mb-6">Please fill in your details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              {errors.emptyUsername && (
                <p className="text-sm text-red-500 mt-1">Username is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-400 mt-1">At least 8 characters</p>
              {errors.emptyPassword && (
                <p className="text-sm text-red-500 mt-1">Password is required</p>
              )}
            </div>

            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}

            <button
              type="submit"
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-green-400 hover:bg-green-600"
              } text-white py-2 rounded-lg font-semibold transition`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-sm text-center mt-4">
              Don't have an account?{" "}
              <a href="/sign-up" className="text-green-600 hover:underline">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
