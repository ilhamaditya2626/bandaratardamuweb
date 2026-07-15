// Katalog fasilitas penginapan: memetakan nama fasilitas ke ikon Font Awesome.
// Dipakai di halaman admin (ceklist) dan halaman publik (render ikon).

export interface FacilityOption {
  name: string;
  icon: string; // kelas Font Awesome tanpa prefix "fa-solid"
}

export const FACILITY_CATALOG: FacilityOption[] = [
  { name: "WiFi", icon: "fa-wifi" },
  { name: "AC", icon: "fa-snowflake" },
  { name: "Resto", icon: "fa-utensils" },
  { name: "Pantai", icon: "fa-water" },
  { name: "Parkir", icon: "fa-parking" },
  { name: "Sarapan", icon: "fa-mug-hot" },
  { name: "Fan", icon: "fa-fan" },
  { name: "TV", icon: "fa-tv" },
  { name: "Air Panas", icon: "fa-shower" },
  { name: "Kolam Renang", icon: "fa-person-swimming" },
  { name: "Dapur", icon: "fa-kitchen-set" },
  { name: "Laundry", icon: "fa-jug-detergent" },
  { name: "Mushola", icon: "fa-mosque" },
  { name: "24 Jam", icon: "fa-clock" },
];

// Ikon default untuk fasilitas custom (di luar katalog).
export const DEFAULT_FACILITY_ICON = "fa-circle-check";

const ICON_BY_NAME = new Map(
  FACILITY_CATALOG.map((item) => [item.name.toLowerCase(), item.icon]),
);

// Kembalikan kelas ikon untuk nama fasilitas; fallback ke ikon default.
export function facilityIcon(name: string): string {
  return ICON_BY_NAME.get(name.trim().toLowerCase()) ?? DEFAULT_FACILITY_ICON;
}
