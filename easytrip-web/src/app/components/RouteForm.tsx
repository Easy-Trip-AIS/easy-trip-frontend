"use client";

import React, { useState } from "react";

type Filters = {
  culture: number;
  nature: number;
  food: number;
  shopping: number;
  relaxation: number;
  spiritual: number;
  entertainment: number; // ✅ виправлено!
};

export default function RouteForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [transport, setTransport] = useState("car");
  const [freeTime, setFreeTime] = useState(10); 
  const [filters, setFilters] = useState<Filters>({
    culture: 50,
    nature: 50,
    food: 50,
    shopping: 50,
    relaxation: 50,
    spiritual: 50,
    entertainment: 50, 
  });

  const geocodeAddress = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "EasyTripApp/1.0 (youremail@example.com)",
      },
    });

    if (!res.ok) {
      throw new Error("Геокодування не вдалося");
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      throw new Error("Не знайдено координат за цією адресою");
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  };

  const handleSubmit = async () => {
    try {
      const start_location = await geocodeAddress(from);
      const end_location = await geocodeAddress(to);

      const preferences = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value / 100])
      );

      const payload = {
        start_location,
        end_location,
        preferences,
        transport,
        free_time_minutes: freeTime,
      };

      console.log(JSON.stringify(payload, null, 2));

      const response = await fetch("/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Помилка з боку сервера: ${text}`);
      }

      const result = await response.json();
      console.log("Отримано маршрут:", result);
      alert("Маршрут згенеровано успішно!");
    } catch (err) {
      console.error("🚨 Помилка:", err);
      alert("Не вдалося побудувати маршрут. Перевірте введення.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Звідки"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 text-red-700"
        />
        <input
          type="text"
          placeholder="Куди"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 text-red-700"
        />
      </div>

      <div>
        <label className="block font-medium text-indigo-700">Транспорт</label>
        <select
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        >
          <option value="walking">Пішки</option>
          <option value="bicycle">Велосипед</option>
          <option value="car">Авто</option>
        </select>
      </div>

      <div className="space-y-4">
        {Object.keys(filters).map((key) => (
          <div key={key}>
            <label className="block font-medium text-indigo-700 capitalize">{key}</label>
            <input
              type="range"
              min={0}
              max={100}
              value={filters[key as keyof Filters]}
              onChange={(e) =>
                setFilters({ ...filters, [key]: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block font-medium text-indigo-700">Вільний час (хвилин)</label>
        <input
          type="number"
          min={30}
          max={480}
          step={15}
          value={freeTime}
          onChange={(e) => setFreeTime(Number(e.target.value))}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Побудувати маршрут
      </button>
    </div>
  );
}
