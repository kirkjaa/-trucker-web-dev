import React from "react";

type FactoriesAndComponiesLocationCardProps = {
  latitude: string;
  longitude: string;
};

export default function FactoriesAndComponiesLocationCard({
  latitude,
  longitude,
}: FactoriesAndComponiesLocationCardProps) {
  const mapSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=th&z=14&output=embed`;

  return (
    <div className="border-2 border-gray-300 p-4 rounded-lg min-h-full">
      <p className="mb-2">
        พิกัดสถานที่
        <span className="text-neutral-06">(ละติจูด, ลองติจูด)</span>
      </p>
      <p className="mb-2">
        {latitude}, {longitude}
      </p>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        loading="lazy"
        marginHeight={0}
        marginWidth={0}
        src={mapSrc}
      ></iframe>
    </div>
  );
}
