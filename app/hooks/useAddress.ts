import { useState } from "react";

import { IAmphure, IProvince, ITambon } from "../types/addressType";

import amphureJson from "@/app/json/address/thai_amphures.json";
import provinceJson from "@/app/json/address/thai_provinces.json";
import tambonJson from "@/app/json/address/thai_tambons.json";

export default function useAddress() {
  const [provinces] = useState<IProvince[]>(provinceJson);
  const [amphures, setAmphures] = useState<IAmphure[]>([]); // Empty by default
  const [tambons, setTambons] = useState<ITambon[]>([]); // Empty by default

  /**
   * Set amphures based on selected province ID.
   * @param {number} provinceId - ID of the selected province.
   */
  const updateAmphuresByProvinceId = (provinceId: number) => {
    const filteredAmphures = amphureJson.filter(
      (amphure) => amphure.province_id === provinceId
    );
    setAmphures(filteredAmphures);
    setTambons([]); // Reset tambons when province changes
  };

  /**
   * Set tambons based on selected amphure ID.
   * @param {number} amphureId - ID of the selected amphure.
   */
  const updateTambonsByAmphureId = (amphureId: number) => {
    const filteredTambons = tambonJson.filter(
      (tambon) => tambon.amphure_id === amphureId
    );
    setTambons(filteredTambons);
  };

  const getZipCodeByTambonId = (tambonId: number): number | null => {
    const tambon = tambons.find((tambon) => tambon.id === tambonId);
    return tambon ? tambon.zip_code : null;
  };

  const getZipCodeByTambonName = (tambonName: string): string | null => {
    const tambon = tambons.find((tambon) => tambon.name_th === tambonName);
    return tambon ? tambon.zip_code.toString() : null;
  };

  /**
   * Set amphures based on selected province name.
   * @param {string} provinceName - Name of the selected province.
   */
  const updateAmphuresByProvinceName = (provinceName: string) => {
    const province = provinces.find(
      (province) => province.name_th === provinceName
    );
    if (province) {
      const filteredAmphures = amphureJson.filter(
        (amphure) => amphure.province_id === province.id
      );
      setAmphures(filteredAmphures);
    } else {
      setAmphures([]); // Reset if no matching province
    }
    setTambons([]); // Reset tambons when province changes
  };

  const getAmphureByProvinceId = (provinceId: number): IAmphure[] => {
    const filteredAmphures = amphureJson.filter(
      (amphure) => amphure.province_id === provinceId
    );
    return filteredAmphures;
  };

  /**
   * Set tambons based on selected amphure name.
   * @param {string} amphureName - Name of the selected amphure.
   */
  const updateTambonsByAmphureName = (amphureName: string) => {
    const amphure = amphureJson.find(
      (amphure) => amphure.name_th === amphureName
    );
    if (amphure) {
      const filteredTambons = tambonJson.filter(
        (tambon) => tambon.amphure_id === amphure.id
      );
      setTambons(filteredTambons);
    } else {
      setTambons([]); // Reset if no matching amphure
    }
  };

  return {
    provinces,
    amphures,
    amphureJson,
    tambons,
    updateAmphuresByProvinceId,
    updateTambonsByAmphureId,
    getZipCodeByTambonId,
    getZipCodeByTambonName,
    updateAmphuresByProvinceName,
    updateTambonsByAmphureName,
    setAmphures,
    getAmphureByProvinceId,
  };
}
