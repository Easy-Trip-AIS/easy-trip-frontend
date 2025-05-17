"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../lib/loadGoogleMaps";

type MapViewProps = {
  directions: google.maps.DirectionsResult | null;
  points: { lat: number; lng: number; name: string; description?: string }[];
};

export default function MapView({ directions, points }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMaps("AIzaSyBV8ddOK9JOJVK5gYmJRO128p9ZHCyZ4kc").then(() => setLoaded(true)).catch(console.error);
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

    if (directions && directionsRenderer.current) {
      directionsRenderer.current.setDirections(directions);
    }
  }, [loaded, directions]);

  useEffect(() => {
    if (!loaded || !mapInstance.current || points.length === 0) return;

    points.forEach((point) => {
      new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: mapInstance.current!,
        title: point.name,
      });
    });
  }, [loaded, points]);

  return <div ref={mapRef} className="w-full h-full" />;
}
