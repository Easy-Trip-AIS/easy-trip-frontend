"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

type Filters = {
  culture: number;
  nature: number;
  food: number;
  shopping: number;
  relaxation: number;
  spiritual: number;
  entertainment: number;
};

type Coordinates = { lat: number; lng: number };

type Payload = {
  start_location: Coordinates;
  end_location: Coordinates;
  preferences: Record<string, number>;
  transport: string;
  free_time_minutes: number;
};

type Props = {
  onSubmit: (payload: Payload) => void;
  setLoading: (loading: boolean) => void;
};

export default function RouteForm({ onSubmit, setLoading }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [transport, setTransport] = useState("car");
  const [freeTime, setFreeTime] = useState(60);
  const [filters, setFilters] = useState<Filters>({
    culture: 50,
    nature: 50,
    food: 50,
    shopping: 50,
    relaxation: 50,
    spiritual: 50,
    entertainment: 50,
  });

  const filterLabels: Record<keyof Filters, string> = {
    culture: "Культура",
    nature: "Природа",
    food: "Їжа",
    shopping: "Шопінг",
    relaxation: "Відпочинок",
    spiritual: "Духовність",
    entertainment: "Розваги",
  };

  const geocodeAddress = async (address: string): Promise<Coordinates> => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "EasyTripApp/1.0 (youremail@example.com)",
      },
    });
    const data = await res.json();
    if (!data || data.length === 0) throw new Error("Не знайдено координат");
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Геолокація не підтримується вашим браузером.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data.display_name) {
            setFrom(data.display_name);
          } else {
            alert("Не вдалося визначити адресу.");
          }
        } catch {
          alert("Помилка при отриманні адреси.");
        }
        setLoading(false);
      },
      () => {
        alert("Не вдалося отримати ваше місцезнаходження.");
        setLoading(false);
      }
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const start_location = await geocodeAddress(from);
      const end_location = await geocodeAddress(to);

      const preferences = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value / 100])
      );

      onSubmit({
        start_location,
        end_location,
        preferences,
        transport,
        free_time_minutes: freeTime,
      });
    } catch (err) {
      console.error("Помилка:", err);
      alert("Не вдалося побудувати маршрут. Перевірте введення.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <motion.input
          type="text"
          placeholder="Звідки"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow"
          whileFocus={{ scale: 1.02 }}
        />
        <button
          type="button"
          onClick={handleUseLocation}
          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition font-medium"
        >
          📍 Використати моє місцезнаходження
        </button>
      </div>

      <div>
        <motion.input
          type="text"
          placeholder="Куди"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow"
          whileFocus={{ scale: 1.02 }}
        />
      </div>

      <div>
        <label className="block font-semibold text-indigo-700 mb-1">Транспорт</label>
        <select
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow"
        >
          <option value="walk">Пішки</option>
          <option value="bike">Велосипед</option>
          <option value="car">Авто</option>
        </select>
      </div>

      <div className="space-y-4">
        {(Object.keys(filters) as (keyof Filters)[]).map((key) => (
          <div key={key}>
            <label className="block font-semibold text-indigo-700">{filterLabels[key]}</label>
            <input
              type="range"
              min={0}
              max={100}
              value={filters[key]}
              onChange={(e) =>
                setFilters({ ...filters, [key]: Number(e.target.value) })
              }
              className="w-full accent-indigo-500"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block font-semibold text-indigo-700 mb-1">Вільний час (хвилин)</label>
        <input
          type="number"
          min={30}
          max={480}
          step={15}
          value={freeTime}
          onChange={(e) => setFreeTime(Number(e.target.value))}
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        className="w-full mt-4 p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Побудувати маршрут
      </motion.button>
    </motion.div>
  );
}