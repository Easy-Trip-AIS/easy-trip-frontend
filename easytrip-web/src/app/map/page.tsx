"use client";

import { useState } from "react";
import RouteForm from "../components/RouteForm";
import MapView from "../components/MapView";

type RecommendedPoint = {
  name: string;
  lat: number;
  lng: number;
  description?: string;
};

export default function MapPage() {
  const [waypoints, setWaypoints] = useState<google.maps.DirectionsWaypoint[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [points, setPoints] = useState<RecommendedPoint[]>([]); // для відображення маркерів

  const handleGenerate = async (payload: {
    start_location: { lat: number; lng: number };
    end_location: { lat: number; lng: number };
    preferences: Record<string, number>;
    transport: string;
    free_time_minutes: number;
  }) => {
    try {
      const response = await fetch("/ml/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Помилка сервера: ${text}`);
      }

      const result = await response.json();
      const recommended = result.recommended as RecommendedPoint[];

      setPoints(recommended); // для маркерів

      const directionsService = new google.maps.DirectionsService();

      const routeWaypoints = recommended.map((point) => ({
        location: { lat: point.lat, lng: point.lng },
        stopover: true,
      }));

      directionsService.route(
        {
          origin: payload.start_location,
          destination: payload.end_location,
          waypoints: routeWaypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            setWaypoints(routeWaypoints);
          } else {
            console.error("Помилка побудови маршруту:", status);
          }
        }
      );
    } catch (err) {
      console.error("Помилка генерації маршруту:", err);
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
