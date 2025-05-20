"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-screen place-items-center p-8"
      >
        {/* Ліва панель */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col justify-between h-full text-left text-black p-10"
        >
          <div className="flex flex-col justify-center h-full">
            <h2 className="text-6xl font-bold mb-4 text-blue-900">Плануйте надихаючі прогулянки</h2>
            <p className="text-xl text-gray-800 max-w-xl">
              Знайдіть найкращі маршрути для прогулянок парками, скверами, набережними та іншими затишними місцями.
              Наш сервіс допоможе вам прокласти шлях, де кожен крок буде задоволенням.
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
              <a href="/" className="text-black font-medium hover:underline">Головна</a>
              <a href="/terms" className="text-black font-medium hover:underline">Умови</a>
            </div>
          </div>
        </motion.div>

        {/* Права панель — форма */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        >
          <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Увійти
          </h2>
          <p className="text-sm text-gray-400 mb-6">Будь ласка, заповніть форму входу</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Логін</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 text-gray-800  rounded-lg"
              />
              {errors.emptyUsername && (
                <p className="text-sm text-red-500 mt-1">Поле логіну обов'язкове до заповнення!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 text-gray-800  rounded-lg"
              />
              <p className="text-xs text-gray-400 mt-1">Пароль повинен містити щонайменше 8 символів</p>
              {errors.emptyPassword && (
                <p className="text-sm text-red-500 mt-1">Поле паролю обов'язкове до заповнення!</p>
              )}
            </div>

            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-blue-400 hover:bg-blue-600"
              } text-white py-2 rounded-lg font-semibold transition`}
              disabled={loading}
            >
              {loading ? "Входимо..." : "Увійти"}
            </motion.button>

            <p className="text-sm text-gray-400 text-center mt-4">
              До сих пір немає акаунту?{" "}
              <a href="/sign-up" className="text-blue-600 hover:underline">Зареєструватись</a>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
