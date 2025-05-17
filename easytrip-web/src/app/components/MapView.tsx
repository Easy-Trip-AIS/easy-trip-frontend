"use client";

import React from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapView({
  directions,
}: {
  directions: google.maps.DirectionsResult | null;
}) {
  const center = { lat: 49.8397, lng: 24.0297 }; // Львів, як центр за замовчуванням

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}
