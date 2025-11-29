"use client";

import React, { useEffect, useRef } from "react";

const DEFAULT_CENTER = { lat: 28.4595, lng: 77.0266 };
const DEFAULT_ZOOM = 7;

const addSingleMarkers = ({
  locations,
  map,
}: {
  locations: ReadonlyArray<google.maps.LatLngLiteral>;
  map: google.maps.Map | null | undefined;
}) =>
  locations.map(
    (position) =>
      new google.maps.Marker({
        position,
        map,
      })
  );

export const GoogleMaps = ({
  locations,
}: {
  locations: ReadonlyArray<google.maps.LatLngLiteral>;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      addSingleMarkers({ locations, map });
    }
  }, [ref, locations]);

  return <div ref={ref} style={{ width: "1000px", height: "700px" }} />;
};
