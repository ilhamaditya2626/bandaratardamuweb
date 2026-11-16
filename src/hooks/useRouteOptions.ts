"use client";

import { useEffect, useState } from "react";

// Pilihan maskapai dan bandara untuk form Penerbangan dan Penumpang,
// diambil dari menu Maskapai dan Destinasi di dashboard admin.

type RawOption = { value: number | string; label: string; kode?: string | null };
export type SelectOption = { value: string; label: string };

// Dipakai kalau tabel Maskapai/Destinasi masih kosong atau gagal dimuat.
const FALLBACK_AIRLINES = ["Susi Air"];
const FALLBACK_CITIES = [
  { nama: "Kupang", kode: "KOE" },
  { nama: "Waingapu", kode: "WGP" },
  { nama: "Ende", kode: "ENE" },
  { nama: "Rote", kode: "RTI" },
];

async function fetchOptions(name: string): Promise<RawOption[]> {
  try {
    const response = await fetch(`/api/admin/options/${name}`);
    const json = await response.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export function useRouteOptions() {
  const [airlines, setAirlines] = useState<string[]>(FALLBACK_AIRLINES);
  const [cities, setCities] = useState(FALLBACK_CITIES);

  useEffect(() => {
    void (async () => {
      const [maskapaiRows, destinasiRows] = await Promise.all([fetchOptions("maskapai"), fetchOptions("destinasi")]);

      const airlineNames = maskapaiRows.map((row) => row.label.trim()).filter(Boolean);
      if (airlineNames.length > 0) setAirlines(airlineNames);

      // Sabu tidak ditampilkan, karena Bandara Tardamu Sabu adalah bandara ini sendiri.
      const cityRows = destinasiRows
        .map((row) => ({ nama: row.label.trim(), kode: (row.kode ?? "").trim().toUpperCase() }))
        .filter((row) => row.nama && row.kode !== "SAU" && !row.nama.toLowerCase().startsWith("sabu"));
      if (cityRows.length > 0) setCities(cityRows);
    })();
  }, []);

  return {
    airlineNames: airlines,
    cityNames: cities.map((city) => city.nama),
    airlineOptions: airlines.map((name) => ({ value: name, label: name })),
    // Format bandara di data penerbangan: "Kupang (KOE)".
    airportOptions: cities.map((city) => {
      const text = city.kode ? `${city.nama} (${city.kode})` : city.nama;
      return { value: text, label: text };
    }),
  };
}

// Supaya data lama yang sedang diedit tetap muncul di pilihan walaupun tidak ada di daftar.
export function withCurrent(options: SelectOption[], current: string): SelectOption[] {
  if (!current || options.some((option) => option.value === current)) return options;
  return [{ value: current, label: current }, ...options];
}

export function withCurrentName(names: string[], current: string): string[] {
  if (!current || names.includes(current)) return names;
  return [current, ...names];
}
