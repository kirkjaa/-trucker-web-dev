"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Autocomplete,
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 13.7563,
  lng: 100.5018,
};

type DraggableMapProps = {
  onSelect: (latlng: { lat: number; lng: number }) => void;
  startPosition?: { lat: number; lng: number };
  startAddress?: string;
};

const DraggableMap: React.FC<DraggableMapProps> = ({
  onSelect,
  startPosition,
  startAddress,
}) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const [markerPosition, setMarkerPosition] = useState(startPosition || center);
  // const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [searchResult, setSearchResult] = useState<any>();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [address, setAddress] = useState(startAddress || "");

  useEffect(() => {
    if (isLoaded && address) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: startAddress }, (results, status) => {
        if (status === "OK" && results && results[0].geometry.location) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          handleUpdatePosition(lat, lng);
          mapRef.current?.panTo({ lat, lng });
        }
      });
    }
  }, [address, isLoaded]);

  const handleUpdatePosition = (lat: number, lng: number) => {
    const newPos = { lat, lng };
    setMarkerPosition(newPos);
    onSelect(newPos);
  };
  function onLoad(autocomplete: any) {
    setSearchResult(autocomplete);
  }
  function onPlaceChanged() {
    if (searchResult != null) {
      //variable to store the result
      const place = searchResult.getPlace();
      //variable to store the name from place details result

      //variable to store the status from place details result

      //variable to store the formatted address from place details result
      const formattedAddress = place.formatted_address;
      // console.log(place);
      //console log all results
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        handleUpdatePosition(lat, lng);
        setAddress(formattedAddress);
        mapRef.current?.panTo({ lat, lng });
      }
    } else {
      alert("Please enter text");
    }
  }
  const onMarkerDragEnd = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleUpdatePosition(lat, lng);
      mapRef.current?.panTo({ lat, lng });
      // const address = await getPlaceFromLatLng(lat, lng);
      // if (address) {
      //   console.log("Place info:", address);
      // }
    }
  }, []);

  // const getPlaceFromLatLng = async (lat: number, lng: number) => {
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     console.log(data);
  //     if (data.status === "OK" && data.results.length > 0) {
  //       const address = data.results[0].formatted_address;
  //       console.log("Formatted address:", address);
  //       return address;
  //     } else {
  //       console.warn("No address found");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Geocoding error:", error);
  //     return null;
  //   }
  // };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <div className="mb-2">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="Search place"
            className="w-full p-2 border rounded"
          />
        </Autocomplete>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={markerPosition}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        <Marker
          position={markerPosition}
          draggable
          onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  );
};

export default DraggableMap;
