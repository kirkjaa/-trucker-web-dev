export function translateTruckType(type: string): string {
  const translations: Record<string, string> = {
    PICKUP_TRUCK: "รถกระบะ",
    CARGO_VAN: "รถตู้บรรทุก",
    TANKER_TRUCK: "รถบรรทุกถัง",
    HAZARDOUS_MATERITAL_TRUCK: "รถบรรทุกวัตถุอันตราย",
    SPECIFIC_TRUCK: "รถบรรทุกเฉพาะทาง",
    TRAILER: "รถพ่วง",
    SEMI_TRAILER: "รถกึ่งพ่วง",
    SEMI_TRAILER_CARRYING_LONG_MATERIAL: "รถกึ่งพ่วงบรรทุกวัสดุยาว",
    TOWING_TRUCK: "รถลากจูง",
  };

  return translations[type] || type;
}
