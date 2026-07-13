"use client";

import { useMemo, useState } from "react";
import { PageHero } from "../_components/info-page-shell";

const localServices = [
  {
    icon: "fa-car",
    title: "Sewa Mobil (Rent Car)",
    subtitle: "Tardamu Car Rental",
    contact: "+62 812-3800-1234",
  },
  {
    icon: "fa-motorcycle",
    title: "Ojek Lokal",
    subtitle: "Tersedia di area kedatangan",
    contact: "+62 813-3921-5678",
  },
  {
    icon: "fa-bus",
    title: "Angkutan Umum",
    subtitle: "Rute Bandara - Terminal Seba",
    note: "06:30 - 17:30 WITA",
  },
];

const destinations = [
  {
    name: "Pantai Napae",
    type: "Pantai",
    distance: "1,3 km",
    duration: "4 mnt",
    query: "Pantai Napae, Sabu Raijua",
  },
  {
    name: "Skyber",
    type: "Religi",
    distance: "1,6 km",
    duration: "4 mnt",
    query: "Skyber, Sabu Raijua",
  },
  {
    name: "Kampung Adat Namata",
    type: "Budaya",
    distance: "3,2 km",
    duration: "9 mnt",
    query: "Kampung Adat Namata, Sabu Raijua",
  },
  {
    name: "Kota Seba",
    type: "Pusat Kota",
    distance: "5 km",
    duration: "10 mnt",
    query: "Kota Seba, Sabu Raijua, NTT",
  },
  {
    name: "Pantai Cemara",
    type: "Pantai",
    distance: "8 km",
    duration: "15 mnt",
    query: "Pantai Cemara, Sabu Raijua",
  },
  {
    name: "Bukit Senyum",
    type: "Panorama",
    distance: "10 km",
    duration: "20 mnt",
    query: "Bukit Senyum, Sabu Raijua",
  },
  {
    name: "Gua Nahoro",
    type: "Gua",
    distance: "10,4 km",
    duration: "16 mnt",
    query: "Gua Nahoro, Sabu Raijua",
  },
  {
    name: "Bukit Titinalede",
    type: "Panorama Alam",
    distance: "12,1 km",
    duration: "23 mnt",
    query: "Bukit Titinalede, Sabu Raijua",
  },
  {
    name: "Gua Mabala",
    type: "Gua",
    distance: "15 km",
    duration: "26 mnt",
    query: "Gua Mabala, Sabu Raijua",
  },
  {
    name: "Benteng Menanga",
    type: "Sejarah",
    distance: "15 km",
    duration: "30 mnt",
    query: "Benteng Menanga, Sabu Raijua",
  },
  {
    name: "Telaga Porohahu",
    type: "Danau",
    distance: "16 km",
    duration: "30 mnt",
    query: "Telaga Porohahu, Sabu Raijua",
  },
  {
    name: "Pantai Kepo",
    type: "Pantai",
    distance: "17,8 km",
    duration: "36 mnt",
    query: "Pantai Kepo, Sabu Raijua",
  },
  {
    name: "Kampung Adat Kolorae",
    type: "Budaya",
    distance: "20 km",
    duration: "40 mnt",
    query: "Kampung Adat Kolorae, Sabu Raijua",
  },
  {
    name: "Pantai Gelenalalu",
    type: "Pantai",
    distance: "20,7 km",
    duration: "41 mnt",
    query: "Pantai Gelenalalu, Sabu Raijua",
  },
  {
    name: "Kampung Adat Kujiratu",
    type: "Budaya",
    distance: "20,9 km",
    duration: "29 mnt",
    query: "Kampung Adat Kujiratu, Sabu Raijua",
  },
  {
    name: "Kelabba Maja",
    type: "Ikon Wisata",
    distance: "21,7 km",
    duration: "43 mnt",
    query: "Kelabba Maja, Sabu Raijua, NTT",
  },
  {
    name: "Pantai Langa Ae",
    type: "Pantai",
    distance: "22,2 km",
    duration: "36 mnt",
    query: "Pantai Langa Ae, Sabu Raijua",
  },
  {
    name: "Pantai Leokoa",
    type: "Pantai",
    distance: "23 km",
    duration: "45 mnt",
    query: "Pantai Leokoa, Sabu Raijua",
  },
  {
    name: "Pantai Ledeae",
    type: "Pasir Putih",
    distance: "23,4 km",
    duration: "39 mnt",
    query: "Pantai Ledeae, Sabu Raijua",
  },
  {
    name: "Pantai Majala",
    type: "Pantai",
    distance: "23,4 km",
    duration: "45 mnt",
    query: "Pantai Majala, Sabu Raijua",
  },
  {
    name: "Pantai Eingatta",
    type: "Pantai",
    distance: "24 km",
    duration: "45 mnt",
    query: "Pantai Eingatta, Sabu Raijua",
  },
  {
    name: "Pantai Rai Mea",
    type: "Wisata Bahari",
    distance: "25,5 km",
    duration: "37 mnt",
    query: "Pantai Rai Mea, Sabu Raijua",
  },
  {
    name: "Pantai Ledeana",
    type: "Pantai",
    distance: "27 km",
    duration: "50 mnt",
    query: "Pantai Ledeana, Sabu Raijua",
  },
  {
    name: "Gua Lie Madira",
    type: "Gua",
    distance: "28 km",
    duration: "50 mnt",
    query: "Gua Lie Madira, Sabu Raijua",
  }
]

export default function TransportasiAksesPage() {
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);

  const mapSrc = useMemo(() => {
    const destination = selectedDestination.query.replace(/ /g, "+");
    return `https://www.google.com/maps?q=Bandara+Tardamu+Sabu+Raijua+ke+${destination}&output=embed`;
  }, [selectedDestination]);

  const gmapsHref = useMemo(() => {
    const destination = selectedDestination.query.replace(/ /g, "+");
    return `https://www.google.com/maps/dir/?api=1&origin=Bandara+Tardamu+Sabu+Raijua&destination=${destination}`;
  }, [selectedDestination]);

  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/hero-bg.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.9) 0%, rgba(17, 25, 40, 1) 100%)"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/jelajah-sabu", label: "Jelajah Sabu" },
          { label: "Transportasi & Akses" },
        ]}
        title={
          <>
            Panduan <span className="italic text-[#facc15]">Transportasi & Akses</span>
          </>
        }
        description="Informasi lengkap moda transportasi dan estimasi perjalanan dari Bandara Tardamu menuju jantung Sabu Raijua."
      />

      <main className="mx-auto max-w-7xl flex-grow px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#facc15]/10 text-[#facc15]">
                <i className="fa-solid fa-taxi text-xl"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Layanan Lokal</h2>
            </div>

            <div className="space-y-4">
              {localServices.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/5 bg-white/[0.03] p-5 transition hover:border-[#facc15] hover:bg-[#facc15]/[0.05]"
                >
                  <div className="flex gap-4">
                    <i className={`fa-solid ${item.icon} mt-1 text-[#facc15]`}></i>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="mt-1 text-xs text-gray-400">{item.subtitle}</p>
                      {item.contact ? (
                        <p className="mt-2 text-xs font-medium text-[#facc15]">
                          <i className="fa-solid fa-phone mr-1"></i> {item.contact}
                        </p>
                      ) : (
                        <p className="mt-2 text-[10px] italic text-gray-500">{item.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#facc15]/10 text-[#facc15]">
                <i className="fa-solid fa-stopwatch-20 text-xl"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Estimasi Perjalanan</h2>
            </div>

            <div className="transport-scroll max-h-[410px] overflow-y-auto pr-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-left text-[#facc15]">
                    <th className="pb-4 text-[10px] font-semibold uppercase tracking-wider">
                      Destinasi
                    </th>
                    <th className="pb-4 text-[10px] font-semibold uppercase tracking-wider">
                      Jarak
                    </th>
                    <th className="pb-4 text-[10px] font-semibold uppercase tracking-wider">
                      Waktu
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {destinations.map((item) => (
                    <tr
                      key={item.name}
                      onClick={() => setSelectedDestination(item)}
                      className={`cursor-pointer border-b border-white/5 transition last:border-b-0 ${selectedDestination.name === item.name ? "bg-[#facc15]/10" : "hover:bg-[#facc15]/10"
                        }`}
                    >
                      <td className="py-4">
                        <span className="block font-medium text-white">{item.name}</span>
                        <span className="text-[10px] text-gray-500">{item.type}</span>
                      </td>
                      <td className="py-4">{item.distance}</td>
                      <td className="py-4">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-8 flex gap-2 text-[10px] italic text-gray-500">
              <i className="fa-solid fa-circle-info text-[#facc15]"></i> Klik pada baris
              tujuan untuk memperbarui peta rute.
            </p>
          </section>

          <section className="flex flex-col rounded-2xl border border-white/5 bg-[#1f2937] p-4 shadow-xl">
            <div className="mb-4 flex items-center gap-4 px-4 pt-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#facc15]/10 text-[#facc15]">
                <i className="fa-solid fa-map-location-dot text-xl"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Peta Navigasi</h2>
            </div>

            <div className="flex-grow overflow-hidden rounded-xl">
              <iframe
                title="Peta Navigasi"
                src={mapSrc}
                className="h-[400px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <a
              href={gmapsHref}
              target="_blank"
              rel="noreferrer"
              className="mx-4 mt-4 inline-flex items-center justify-center gap-3 rounded-full bg-[#facc15] px-5 py-3 text-sm font-bold text-[#111928] transition hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]"
            >
              Buka di Google Maps <i className="fa-solid fa-location-arrow"></i>
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
