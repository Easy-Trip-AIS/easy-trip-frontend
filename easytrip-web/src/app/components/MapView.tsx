"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../lib/loadGoogleMaps";

export type Point = {
  lat: number;
  lng: number;
  name: string;
  description?: string;
};

export type MapViewProps = {
  directions: google.maps.DirectionsResult | null;
  points: Point[];
};

export default function MapView({ directions, points }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const [loaded, setLoaded] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    loadGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!)
      .then(() => setLoaded(true))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 49.84, lng: 24.02 },
      });

      directionsRenderer.current = new google.maps.DirectionsRenderer();
      directionsRenderer.current.setMap(mapInstance.current);
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && directionsRenderer.current && directions) {
      directionsRenderer.current.setDirections(directions);
    }
  }, [loaded, directions]);

  useEffect(() => {
    if (!loaded || !mapInstance.current || points.length === 0) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    points.forEach((point, index) => {
      const color =
        index === 0 ? "green" : index === points.length - 1 ? "red" : "orange";

      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: mapInstance.current!,
        title: `${point.name}\n${point.description ?? ""}`,
        label: `${index + 1}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "white",
          scale: 8,
        },
      });

      const info = new google.maps.InfoWindow({
        content: `<strong>${point.name}</strong><br/>${point.description ?? ""}`,
      });

      marker.addListener("click", () => info.open(mapInstance.current!, marker));

      markersRef.current.push(marker);
    });
  }, [loaded, points]);

  const handleFocusPoint = (point: Point) => {
    if (mapInstance.current) {
      mapInstance.current.panTo({ lat: point.lat, lng: point.lng });
      mapInstance.current.setZoom(15);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0" />

      {/* Список точок */}
      <div className="absolute left-4 bottom-4 z-10 bg-white/90 backdrop-blur-lg p-4 rounded-lg shadow-lg max-w-xs overflow-auto max-h-[50vh]">
        <h3 className="text-lg font-semibold mb-2 text-indigo-700">Маршрут</h3>
        <ul className="space-y-2 text-sm">
          {points.map((p, i) => (
            <li
              key={i}
              className="border-b pb-1 cursor-pointer hover:bg-indigo-50 rounded px-1"
              onClick={() => handleFocusPoint(p)}
            >
              <span className="font-medium text-gray-800">{i + 1}. {p.name}</span>
              {p.description && <p className="text-gray-500">{p.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
