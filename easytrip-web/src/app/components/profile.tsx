"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaCalendarAlt, FaSitemap, FaMapMarkerAlt, FaMars } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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

      router.push("/"); // redirect home
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

  if (loading) return <p className="p-4 text-gray-600">Loading profile...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-green-50 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-green-100">
        <h2 className="text-2xl font-semibold text-green-800">Account Information</h2>
      </div>
      <div className="flex flex-col md:flex-row p-6 gap-8">
        {/* Profile photo */}
        <div className="flex flex-col items-center gap-2">
          <img
            src="/avatar.png" // заміни або додай власне зображення
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-green-400"
          />
          <p className="text-lg font-semibold text-green-800">Avatar</p>
          <p className="text-sm text-gray-500 text-center">This will be displayed on your profile.</p>
        </div>

        {/* Profile fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <Field icon={<FaUser />} label="Username" value={profile.username} />
          <Field icon={<FaEnvelope />} label="Email Address" value={profile.email} />
          <Field icon={<FaUser />} label="First Name" value={profile.first_name} />
          <Field icon={<FaUser />} label="Last Name" value={profile.last_name} />
          <Field icon={<FaCalendarAlt />} label="Date of Birth" value={profile.date_of_birth} />
          <Field icon={<FaMapMarkerAlt />} label="Joined" value={new Date(profile.date_joined).toLocaleDateString()} />
        </div>
      </div>

      <div className="p-6 border-t border-green-100 flex justify-end">
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition"
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-md text-green-900">
        <span className="text-green-700">{icon}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
