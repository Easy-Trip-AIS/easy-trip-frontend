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

  const handleSubmit = () => {
    // ТИМЧАСОВІ координати — замінити пізніше на геокодування
    const start_location = { lat: 49.827787, lng: 24.0021997 };
    const end_location = { lat: 49.8413276, lng: 24.0315923 };

    const preferences = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [key, value / 100])
    );

    const payload = {
      start_location,
      end_location,
      preferences,
      transport: "car",
      free_time_minutes: freeTime,
    };

    onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      {/* Локації */}
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

      {/* Фільтри */}
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

      {/* Вільний час */}
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

      {/* Кнопка */}
      <button
        onClick={handleSubmit}
        className="w-full mt-4 p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Побудувати маршрут
      </button>
    </div>
  );
}
