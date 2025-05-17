"use client";

import React, { useState } from "react";

type Filters = {
  culture: number;
  nature: number;
  food: number;
  shopping: number;
  relaxation: number;
  spiritual: number;
  entertaiment: number;
};

export default function RouteForm({
  onSubmit,
}: {
  onSubmit: (payload: {
    start_location: { lat: number; lng: number };
    end_location: { lat: number; lng: number };
    preferences: Record<string, number>;
    transport: string;
    free_time_minutes: number;
  }) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [transport, setTransport] = useState("car");
  const [freeTime, setFreeTime] = useState(120);
  const [filters, setFilters] = useState<Filters>({
    culture: 30,
    nature: 30,
    food: 10,
    shopping: 10,
    relaxation: 10,
    spiritual: 5,
    entertaiment: 5,
  });

  const geocodeAddress = async (address: string) => {
    const url = `/api/geocode?address=${encodeURIComponent(address)}`;
    console.log("Geocoding address:", url);

    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Geocode error:", errorText);
      throw new Error("Геокодування не вдалося");
    }
    return await res.json();
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

      onSubmit(payload);
    } catch (err) {
      console.log("API key from env:", process.env.GOOGLE_MAPS_API_KEY); // тимчасово для перевірки

      console.error("Помилка при геокодуванні. Перевірте введені адреси.");
      alert("Не вдалося знайти одну з адрес. Перевірте введення.");
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
          className="w-full p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          placeholder="Куди"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div>
        <label className="block font-medium">Транспорт</label>
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
            <label className="block font-medium capitalize">{key}</label>
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
        <label className="block font-medium">Вільний час (хвилин)</label>
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
