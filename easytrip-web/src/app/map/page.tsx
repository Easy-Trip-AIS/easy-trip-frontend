"use client";

import { useState } from "react";
import RouteForm from "../components/RouteForm";
import MapView from "../components/MapView";

export default function MapPage() {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [points, setPoints] = useState<
    { name: string; lat: number; lng: number; description: string }[]
  >([]);

  const handleGenerate = async (payload: {
    start_location: { lat: number; lng: number };
    end_location: { lat: number; lng: number };
    preferences: Record<string, number>;
    transport: string;
    free_time_minutes: number;
  }) => {
    try {
      console.log("📤 Надсилаємо запит на /ml/recommend з payload:", payload);

      const res = await fetch("/ml/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Сервер повернув помилку:", text);
        return;
      }

      const data = await res.json();
      console.log("✅ Отримано рекомендовані точки:", data);

      if (!data.recommended || data.recommended.length < 2) {
        console.warn("⚠️ Недостатньо точок для побудови маршруту");
        return;
      }

      setPoints(data.recommended); // Передаємо точки в MapView

      const directionsService = new google.maps.DirectionsService();

      const waypoints = data.recommended.slice(1, -1).map((p: any) => ({
        location: { lat: p.lat, lng: p.lng },
        stopover: true,
      }));

      console.log("📍 Будуємо маршрут через точки:", {
        origin: data.recommended[0],
        destination: data.recommended[data.recommended.length - 1],
        waypoints,
      });

      directionsService.route(
        {
          origin: { lat: data.recommended[0].lat, lng: data.recommended[0].lng },
          destination: {
            lat: data.recommended[data.recommended.length - 1].lat,
            lng: data.recommended[data.recommended.length - 1].lng,
          },
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            console.log("✅ Маршрут побудовано успішно");
            setDirections(result);
          } else {
            console.error("❌ Помилка побудови маршруту:", status, result);
          }
        }
      );
    } catch (err) {
      console.error("💥 Помилка при генерації маршруту:", err);
    }
  };

  return (
    <div className="flex h-screen w-full p-4 gap-4">
      <div className="w-full max-w-sm bg-white rounded-xl p-4 shadow space-y-6 overflow-y-auto">
        <RouteForm onSubmit={handleGenerate} />
      </div>

      <div className="flex-1 rounded-xl overflow-hidden">
        <MapView directions={directions} points={points} />
      </div>
    </div>
  );
}
