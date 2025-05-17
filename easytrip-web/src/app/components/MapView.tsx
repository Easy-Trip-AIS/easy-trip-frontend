import { useEffect, useRef } from "react";

type Point = {
  lat: number;
  lng: number;
  name: string;
  description: string;
};

export default function MapView({
  directions,
  points,
}: {
  directions: google.maps.DirectionsResult | null;
  points: Point[];
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!mapRef.current || typeof google === "undefined") {
      console.warn("Google Maps API не завантажено або mapRef не готовий");
      return;
    }

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 49.84, lng: 24.03 },
      zoom: 13,
    });

    directionsRenderer.current = new google.maps.DirectionsRenderer();
    directionsRenderer.current.setMap(mapInstance.current);
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !points || points.length === 0) return;

    console.log("🧷 Встановлюємо маркери:", points);

    points.forEach((point) => {
      new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: mapInstance.current!,
        title: point.name,
      });
    });
  }, [points]);

  useEffect(() => {
    if (directionsRenderer.current && directions) {
      directionsRenderer.current.setDirections(directions);
    }
  }, [directions]);

  return <div ref={mapRef} className="w-full h-full" />;
}
