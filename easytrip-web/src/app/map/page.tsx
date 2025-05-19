"use client";

import { useEffect, useState } from "react";
import RouteForm from "../components/RouteForm";
import MapView from "../components/MapView";
import { motion, AnimatePresence } from "framer-motion";

type Point = { name: string; lat: number; lng: number; description?: string };
type ApiPoint = { lat: number; lng: number; name: string; description?: string };

export default function MapPage() {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [hasSavedRoute, setHasSavedRoute] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("easytrip_route");
    setHasSavedRoute(!!saved);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const saveRouteToStorage = (route: google.maps.DirectionsResult, points: Point[]) => {
    const data = { directions: route, points };
    localStorage.setItem("easytrip_route", JSON.stringify(data));
    setHasSavedRoute(true);
  };

  const loadSavedRoute = () => {
    const raw = localStorage.getItem("easytrip_route");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setDirections(parsed.directions);
      setPoints(parsed.points);
      showToast("🔄 Маршрут відновлено");
    } catch {
      alert("Неможливо завантажити маршрут.");
    }
  };

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

      if (!res.ok) throw new Error("Сервер повернув помилку");

      const data = await res.json();
      if (!data.recommended?.length) throw new Error("Недостатньо точок");

      const waypointsArr: Point[] = data.recommended.map((p: ApiPoint) => ({
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        description: p.description,
      }));

      const directionsService = new google.maps.DirectionsService();
      const waypoints = waypointsArr.map((p) => ({
        location: new google.maps.LatLng(p.lat, p.lng),
        stopover: true,
      }));

      const origin = new google.maps.LatLng(payload.start_location.lat, payload.start_location.lng);
      const destination = new google.maps.LatLng(payload.end_location.lat, payload.end_location.lng);

      const travelMode = payload.transport === "walk"
        ? google.maps.TravelMode.WALKING
        : payload.transport === "bike"
        ? google.maps.TravelMode.BICYCLING
        : google.maps.TravelMode.DRIVING;

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          optimizeWaypoints: true,
          travelMode,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const order = result.routes[0].waypoint_order;
            const reordered = [
              { name: "Start", lat: payload.start_location.lat, lng: payload.start_location.lng },
              ...order.map((i) => waypointsArr[i]),
              { name: "End", lat: payload.end_location.lat, lng: payload.end_location.lng },
            ];
            setPoints(reordered);
            setDirections(result);
            showToast("✅ Маршрут побудовано");
            saveRouteToStorage(result, reordered);
          } else {
            console.error("❌ Помилка побудови маршруту");
          }
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("💥 Помилка генерації:", err);
      alert("Не вдалося побудувати маршрут.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full p-4 gap-4">
      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 1 }}
              className="p-6 bg-white rounded-lg shadow text-indigo-600 font-semibold text-lg"
            >
              ⏳ Будується маршрут...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="w-full max-w-sm bg-white rounded-xl p-4 shadow space-y-6 overflow-y-auto">
        <RouteForm onSubmit={handleGenerate} setLoading={setLoading} />

        {hasSavedRoute && (
          <button
            onClick={loadSavedRoute}
            className="w-full bg-indigo-100 text-indigo-800 font-medium py-2 rounded-md hover:bg-indigo-200 transition"
          >
            ⤵️ Завантажити останній маршрут
          </button>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden">
        <MapView directions={directions} points={points} />
      </div>
    </div>
  );
}