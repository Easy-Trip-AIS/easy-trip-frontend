"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../lib/loadGoogleMaps";

type Point = {
  lat: number;
  lng: number;
  name: string;
  description?: string;
};

type MapViewProps = {
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
      .then(() => {
        console.log("✅ Google Maps API завантажено");
        setLoaded(true);
      })
      .catch((err) => {
        console.error("❌ Помилка при завантаженні Google Maps API:", err);
      });
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

      console.log("🗺️ Карта ініціалізована");
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && directionsRenderer.current && directions) {
      directionsRenderer.current.setDirections(directions);
      console.log("📍 Маршрут оновлено");
    }
  }, [loaded, directions]);

  useEffect(() => {
    if (!loaded || !mapInstance.current || points.length === 0) return;

    // Прибрати старі маркери
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    console.log("📌 Встановлення маркерів:", points);

    points.forEach((point, index) => {
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: mapInstance.current!,
        title: `${index === 0 ? "Початок: " : index === points.length - 1 ? "Кінець: " : ""}${point.name}`,
        label: `${index + 1}`,
      });
      markersRef.current.push(marker);
    });
  }, [loaded, points]);

  return <div ref={mapRef} className="w-full h-full" />;
}