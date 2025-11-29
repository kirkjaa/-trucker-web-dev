import React from "react";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface MapComponentProps {
  lat: number;
  lon: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lon }) => {
  const containerStyle = {
    width: "100%",
    height: "150%",
  };

  const center = {
    lat: lat,
    lng: lon,
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
