"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 p-8 gap-4 min-h-screen"
      >
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="p-10 flex flex-col justify-between text-white h-full"
        >
          <div className="flex flex-col items-start justify-center h-full text-left">
            <h2 className="text-6xl font-bold mb-4 text-blue-900">
              Плануйте надихаючі прогулянки
            </h2>
            <p className="text-xl text-gray-800 max-w-xl">
              Знайдіть найкращі маршрути для прогулянок парками, скверами, набережними та іншими затишними місцями.
              Наш сервіс допоможе вам прокласти шлях, де кожен крок буде задоволенням.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <div className="flex items-center gap-2">
              <img src="/english.png" alt="US Flag" className="w-6 h-6 rounded-full" />
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

        {/* RIGHT PANEL (Форма) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg w-full max-w-[700px] p-8 overflow-auto"
        >
          <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Cтворіть новий акаунт
          </h2>
          <p className="text-sm text-gray-400 mb-6">Будь ласка, заповніть форму реєстрації</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <InputField label="Ім'я" name="firstname" value={formData.firstname} onChange={handleChange} />
              <InputField label="Прізвище" name="lastname" value={formData.lastname} onChange={handleChange} />
            </div>

            <InputField label="Дата народження" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
            <InputField label="Логін" name="username" value={formData.username} onChange={handleChange} />
            <InputField label="Електронна пошта" name="email" value={formData.email} onChange={handleChange} type="email" error={errors.invalidEmail && "Будь ласка, введіть корекнту електронну пошту."} />
            <InputField label="Пароль" name="password" value={formData.password} onChange={handleChange} type="password" hint="Пароль повинен містити щонайменше 8 символів" />
            <InputField label="Повторіть пароль" name="passwordConfirmation" value={formData.passwordConfirmation} onChange={handleChange} type="password" error={errors.passwordMismatch && "Паролі не співпадають, спробуйте ще раз"} />

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
                Я підтверджую{" "}
                <a href="/terms" className="text-blue-600 hover:underline">Умови & Вимоги</a>
              </label>
            </div>

            {errors.server && (
              <div className="text-sm text-red-500">
                {typeof errors.server === "string"
                  ? errors.server
                  : Object.entries(errors.server).map(([field, msgs]) => (
                      <p key={field}>
                        {field}: {Array.isArray(msgs) ? msgs.join(" ") : msgs}
                      </p>
                    ))}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={!formData.acceptTerms}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-blue-400 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              Зареєструватись
            </motion.button>

            <p className="text-sm text-gray-400 text-center mt-4">
              Вже зареєстровані?{" "}
              <a href="/sign-in" className="text-blue-600 hover:underline">Увійти</a>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string | boolean;
  hint?: string;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 text-gray-800 rounded-lg"
        required
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}