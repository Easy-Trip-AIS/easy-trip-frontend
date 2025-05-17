"use client";

import { useState } from "react";
import RouteForm from "../components/RouteForm";
import MapView from "../components/MapView";

export default function MapPage() {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const handleGenerate = async (payload: {
    start_location: { lat: number; lng: number };
    end_location: { lat: number; lng: number };
    preferences: Record<string, number>;
    transport: string;
    free_time_minutes: number;
  }) => {
    console.log("Надсилаємо:", payload);

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: payload.start_location,
        destination: payload.end_location,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          console.error("Помилка побудови маршруту:", status);
        }
      }
    );
  };

  return (
    <div className="flex h-screen w-full p-4 gap-4">
      <div className="w-full max-w-sm bg-white rounded-xl p-4 shadow space-y-6 overflow-y-auto">
        <RouteForm onSubmit={handleGenerate} />
      </div>

      <div className="flex-1 rounded-xl overflow-hidden">
        <MapView directions={directions} />
      </div>
    </div>
  );
}
