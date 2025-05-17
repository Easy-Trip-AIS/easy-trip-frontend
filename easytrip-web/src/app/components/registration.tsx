"use client";

import React, { useState } from "react";

export default function SignUpPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-r from-blue-100 to-blue-300 p-8 gap-4">
      {/* Лівий блок */}
      <div className="p-10 flex flex-col justify-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Fast, Efficient and Productive</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          </p>
        </div>
      </div>

      {/* Правий блок - форма */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[700px] max-h-screen overflow-auto p-8 flex items-center justify-center justify-end pr-12">
        <div className="w-full max-w-[600px] ml-auto">
          <h2 className="text-2xl font-bold mb-1">Create a new Account</h2>
          <p className="text-sm text-gray-400 mb-6">Please fill in your details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
                <div className="w-1/2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                    <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="w-1/2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                    <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
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
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Repeat Password</label>
              <input
                type="password"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
            >
              Sign Up
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account? <a href="#" className="text-blue-600">Sign In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}