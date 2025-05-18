"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  const fetchProfile = async (accessToken: string, retry = true) => {
    try {
      const res = await fetch(`${API_URL}/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 401 && retry) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token available");

        const refreshResp = await fetch(`${API_URL}/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshResp.ok) throw new Error("Refresh failed");

        const refreshData = await refreshResp.json();
        localStorage.setItem("access_token", refreshData.access);

        return fetchProfile(refreshData.access, false);
      }

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const access = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");

      if (!access || !refresh) throw new Error("Tokens missing");

      await fetch(`${API_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh }),
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      router.push("/");
    } catch (err) {
      alert("Logout failed. Try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/sign-in");
      return;
    }
    fetchProfile(accessToken);
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Завантаження профілю...</p>;
  if (error) return <p className="p-4 text-red-500">Помилка: {error}</p>;

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-white z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-center min-h-screen p-8"
      >
        <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl items-start justify-center">
          {/* Аватар */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <img
              src="/avatar.png"
              alt="Profile"
              className="w-44 h-44 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button className="text-sm text hover:underline">Змінити</button>
          </motion.div>

          {/* Інформація профілю */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col w-full max-w-xl gap-4"
          >
            <Field label="Логін" value={profile.username} />
            <Field label="Пошта" value={profile.email} />
            <Field label="Ім'я" value={profile.first_name} />
            <Field label="Прізвище" value={profile.last_name} />
            <Field label="Дата народення" value={profile.date_of_birth} />
            <Field label="Реєстрація акаунту" value={new Date(profile.date_joined).toLocaleDateString()} />

            <div className="w-full flex justify-end mt-4">
              <motion.button
                onClick={handleLogout}
                disabled={logoutLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-md transition"
              >
                {logoutLoading ? "Виходимо з аккаунту..." : "Вийти з аккаунту"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Поле профілю з анімацією (якщо хочеш — анімовані окремо)
function Field({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full"
    >
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium">
        {value}
      </div>
    </motion.div>
  );
}