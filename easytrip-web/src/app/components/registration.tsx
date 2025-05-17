"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

type ServerError = { [key: string]: any };

interface Errors {
  passwordMismatch: boolean;
  invalidEmail: boolean;
  server: ServerError | null;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Errors>({
    passwordMismatch: false,
    invalidEmail: false,
    server: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email);
    const isPasswordMatch = formData.password === formData.passwordConfirmation;

    if (!isEmailValid || !isPasswordMatch) {
      setErrors({
        passwordMismatch: !isPasswordMatch,
        invalidEmail: !isEmailValid,
        server: null,
      });
      return;
    }

    setErrors({ passwordMismatch: false, invalidEmail: false, server: null });

    const payload = {
      username: formData.username,
      email: formData.email,
      first_name: formData.firstname,
      last_name: formData.lastname,
      date_of_birth: formData.dateOfBirth,
      password: formData.password,
    };

    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors((prev) => ({ ...prev, server: data }));
      } else {
        router.push("/");
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        server: { detail: "Network error, please try again." },
      }));
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-white z-0" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 p-8 gap-4 min-h-screen">
        <div className="p-10 flex flex-col justify-between text-white h-full">
          <div className="flex flex-col items-start justify-center h-full text-left">
            <h2 className="text-6xl font-bold mb-4 text-black">
              Plan inspiring walks
            </h2>
            <p className="text-xl text-gray-800 max-w-xl">
              Find the best routes for walks through parks, squares,
              embankments and other cozy places. Our service will help you pave
              the way where every step is a pleasure.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <div className="flex items-center gap-2">
              <img
                src="/english.png"
                alt="US Flag"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-black font-medium">English</span>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="flex gap-4 text-sm">
              <a
                href="/"
                className="text-black font-medium hover:underline"
              >
                Home
              </a>
              <a
                href="#"
                className="text-black font-medium hover:underline"
              >
                Terms
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-lg w-full max-w-[700px] p-8 overflow-auto">
          <h2 className="text-2xl font-bold mb-1">Create a new Account</h2>
          <p className="text-sm text-gray-400 mb-6">
            Please fill in your details
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              {errors.invalidEmail && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-400 mt-1">
                At least 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Repeat Password
              </label>
              <input
                type="password"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              {errors.passwordMismatch && (
                <p className="text-sm text-red-500 mt-1">
                  Passwords do not match.
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I accept the{" "}
                <a href="/terms" className="text-green-600 hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {errors.server && (
              <div className="text-sm text-red-500">
                {typeof errors.server === "string" ? (
                  errors.server
                ) : (
                  Object.entries(errors.server).map(([field, msgs]) => (
                    <p key={field}>
                      {field}: {Array.isArray(msgs) ? msgs.join(" ") : msgs}
                    </p>
                  ))
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!formData.acceptTerms}
              className="w-full bg-green-400 text-white py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              Sign Up
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <a href="/sign-in" className="text-green-600 hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
