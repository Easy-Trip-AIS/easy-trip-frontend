"use client";

import { useState } from "react";
import RouteForm from "../components/RouteForm";
import MapView from "../components/MapView";
import { motion } from "framer-motion";

type Point = { name: string; lat: number; lng: number; description?: string };

export default function MapPage() {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [points, setPoints] = useState<Point[]>([]);

  const handleGenerate = async (payload: {
    start_location: { lat: number; lng: number };
    end_location: { lat: number; lng: number };
    preferences: Record<string, number>;
    transport: string;
    free_time_minutes: number;
  }) => {
    try {
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

      if (!data.recommended || data.recommended.length === 0) {
        console.warn("⚠️ Недостатньо точок для побудови маршруту");
        return;
      }

      // ВАЖЛИВО! data.recommended має містити ТІЛЬКИ ПРОМІЖНІ точки (без старту і кінця)
      const waypointsArr: Point[] = data.recommended.map((p: any) => ({
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        description: p.description,
      }));

      if (typeof google === "undefined" || !google.maps) {
        console.error("❌ Google Maps API не завантажено");
        return;
      }

      const directionsService = new google.maps.DirectionsService();

      // Передаємо тільки проміжні точки як waypoints
      const waypoints = waypointsArr.map((p) => ({
        location: new google.maps.LatLng(p.lat, p.lng),
        stopover: true,
      }));

      const origin = new google.maps.LatLng(payload.start_location.lat, payload.start_location.lng);
      const destination = new google.maps.LatLng(payload.end_location.lat, payload.end_location.lng);

      const getTravelMode = (transport: string) => {
          switch (transport) {
            case "walk":
              return google.maps.TravelMode.WALKING;
            case "bicycle":
              return google.maps.TravelMode.BICYCLING;
            case "car":
            default:
              return google.maps.TravelMode.DRIVING;
          }
      };

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          optimizeWaypoints: true,
          travelMode: getTravelMode(payload.transport),// google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            // Порядок проходження точок (тільки для waypoints!)
            const order: number[] = result.routes[0].waypoint_order;

            // Формуємо відсортований масив для маркерів:
            const reordered = [
              {
                name: "Start",
                lat: payload.start_location.lat,
                lng: payload.start_location.lng,
                description: "Початок",
              },
              ...order.map((i) => waypointsArr[i]),
              {
                name: "End",
                lat: payload.end_location.lat,
                lng: payload.end_location.lng,
                description: "Кінець",
              },
            ];

            setPoints(reordered);
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

