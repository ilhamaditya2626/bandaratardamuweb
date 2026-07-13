import Image from "next/image";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const facilityGroups = [
  {
    title: "Fasilitas Sisi Udara",
    eyebrow: "Airside Facilities",
    number: "01",
    description:
      "Fasilitas operasional yang mendukung pergerakan pesawat sejak proses mendarat, bergerak di area sisi udara, parkir, hingga kembali lepas landas.",
    items: [
      {
        name: "Runway",
        icon: "fa-road",
        image:
          "/assets/images/fasilitas/runway.webp",
        description: "Landasan pacu untuk kegiatan lepas landas dan pendaratan pesawat.",
      },
      {
        name: "Taxiway",
        icon: "fa-route",
        image:
          "/assets/images/fasilitas/Taxiway.webp",
        description: "Jalur penghubung pergerakan pesawat dari runway menuju apron.",
      },
      {
        name: "Apron",
        icon: "fa-plane-circle-check",
        image:
          "/assets/images/fasilitas/apron.webp",
        description: "Area parkir pesawat untuk proses boarding, handling, dan persiapan operasi.",
      },
      {
        name: "APAPI",
        icon: "fa-lightbulb",
        image:
          "/assets/images/fasilitas/APAPI.webp",
        description: "Alat bantu visual untuk membantu pilot menjaga sudut pendekatan pendaratan.",
      },
    ],
  },
  {
    title: "Fasilitas Sisi Darat",
    eyebrow: "Landside Facilities",
    number: "02",
    description:
      "Fasilitas pendukung di area darat yang memastikan pelayanan umum, terkait administrasi, keselamatan, kenyamanan, dan pemeliharaan bandar udara.",
    items: [
      {
        name: "Gedung Terminal",
        icon: "fa-building-columns",
        image:
          "/assets/images/fasilitas/terminal.webp",
        description: "Bangunan utama pelayanan penumpang untuk keberangkatan dan kedatangan.",
      },
      {
        name: "Parking Area",
        icon: "fa-square-parking",
        image:
          "/assets/images/fasilitas/parking area.webp",
        description: "Area parkir kendaraan pengguna jasa dengan akses menuju terminal.",
      },
      {
        name: "Gedung PKP-PK",
        icon: "fa-fire-extinguisher",
        image:
          "/assets/images/fasilitas/PKP-PK.webp",
        description: "Fasilitas siaga pertolongan kecelakaan penerbangan dan pemadam kebakaran.",
      },
      {
        name: "Gedung Power House",
        icon: "fa-bolt",
        image:
          "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",
        description: "Pusat dukungan kelistrikan untuk menjaga pasokan daya fasilitas bandara.",
      },
      {
        name: "Gedung Workshop",
        icon: "fa-screwdriver-wrench",
        image:
          "/assets/images/fasilitas/gedung workshop.webp",
        description: "Area kerja pemeliharaan fasilitas dan peralatan pendukung operasional.",
      },
      {
        name: "Gedung Administrasi",
        icon: "fa-folder-open",
        image:
          "/assets/images/fasilitas/GEDUNG ADMINISTRASI.webp",
        description: "Ruang tata kelola administrasi, koordinasi, dan layanan perkantoran bandara.",
      },
    ],
  },
  {
    title: "Fasilitas Gedung Terminal",
    eyebrow: "Terminal Building Facilities",
    number: "03",
    description:
      "Fasilitas pelayanan penumpang yang dirancang untuk menunjang kenyamanan, aksesibilitas, kebersihan, dan kebutuhan perjalanan di terminal.",
    items: [
      {
        name: "Ruang Tunggu VIP",
        icon: "fa-couch",
        image:
          "/assets/images/fasilitas/vip.webp",
        description: "Ruang tunggu khusus dengan suasana lebih nyaman untuk tamu tertentu.",
      },
      {
        name: "Toilet",
        icon: "fa-restroom",
        image:
          "/assets/images/fasilitas/toilet.webp",
        description: "Fasilitas sanitasi umum yang dirawat untuk kebersihan pengguna jasa.",
      },
      {
        name: "Toilet Disabilitas",
        icon: "fa-wheelchair",
        image:
          "/assets/images/fasilitas/toilet disabilitas.webp",
        description: "Toilet dengan akses dan ruang gerak yang mendukung kebutuhan disabilitas.",
      },
      {
        name: "Ramp",
        icon: "fa-person-walking-arrow-right",
        image:
          "/assets/images/fasilitas/ramp.webp",
        description: "Akses miring yang membantu mobilitas penumpang dan pengguna kursi roda.",
      },
      {
        name: "Kursi Prioritas",
        icon: "fa-chair",
        image:
          "/assets/images/fasilitas/Kursi Prioritas.webp",
        description: "Tempat duduk prioritas bagi lansia, ibu hamil, dan penumpang berkebutuhan khusus.",
      },
      {
        name: "Smoking Area",
        icon: "fa-smoking",
        image:
          "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070&auto=format&fit=crop",
        description: "Area khusus merokok untuk menjaga kenyamanan ruang publik terminal.",
      },
      {
        name: "Nursery Room",
        icon: "fa-person-breastfeeding",
        image:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop",
        description: "Ruang laktasi dan perawatan bayi yang privat, bersih, dan nyaman.",
      },
      {
        name: "Mushola",
        icon: "fa-mosque",
        image:
          "https://images.unsplash.com/photo-1542750012-f029646b1f81?q=80&w=2070&auto=format&fit=crop",
        description: "Area ibadah yang tenang untuk memenuhi kebutuhan spiritual pengguna jasa.",
      },
      {
        name: "Area Komersial",
        icon: "fa-store",
        image:
          "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?q=80&w=2070&auto=format&fit=crop",
        description: "Ruang layanan komersial pendukung kebutuhan penumpang di area terminal.",
      },
    ],
  },
];

const serviceIndicators = [
  {
    number: "01",
    icon: "fa-plane-departure",
    title: "Proses Keberangkatan & Kedatangan",
    subtitle: "Passenger Departure & Arrival Process",
    predicate: "A",
    predicateLabel: "Istimewa",
    score: 95,
    description:
      "Proses keberangkatan dan kedatangan berjalan cepat, tertib, serta efisien dengan standar pelayanan terbaik.",
  },
  {
    number: "02",
    icon: "fa-couch",
    title: "Kenyamanan",
    subtitle: "Passenger Comfort",
    predicate: "B",
    predicateLabel: "Baik Sekali",
    score: 79,
    description:
      "Tingkat kenyamanan penumpang terjaga melalui fasilitas yang memadai, bersih, dan terawat dengan baik.",
  },
  {
    number: "03",
    icon: "fa-star",
    title: "Fasilitas Pemberi Nilai Tambah",
    subtitle: "Value Added Facilities",
    predicate: "C",
    predicateLabel: "Baik",
    score: 40,
    description:
      "Fasilitas nilai tambah tersedia untuk mendukung pengalaman perjalanan yang lebih optimal bagi pengguna jasa.",
  },
];

const iap4Pillars = [
  {
    icon: "fa-person-digging",
    title: "Pembangunan",
    description: "Fondasi kuat untuk infrastruktur bandara.",
  },
  {
    icon: "fa-users-between-lines",
    title: "Pendayagunaan",
    description: "Optimalisasi aset dan sumber daya yang efektif.",
  },
  {
    icon: "fa-chart-line",
    title: "Pengembangan",
    description: "Peluang peningkatan fasilitas dan layanan berkelanjutan.",
  },
  {
    icon: "fa-gauge-high",
    title: "Pengoperasian",
    description: "Operasional andal, aman, dan efisien setiap waktu.",
  },
];

export default function FasilitasPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <style>{`
        @keyframes facilityReveal {
          from {
            opacity: 0;
            transform: translateY(42px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @supports (animation-timeline: view()) {
          .facility-reveal {
            opacity: 0;
            animation: facilityReveal linear both;
            animation-timeline: view();
            animation-range: entry 8% cover 30%;
          }
        }

        @keyframes serviceGlow {
          0%, 100% {
            opacity: 0.38;
            transform: translate3d(-8%, -4%, 0) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate3d(8%, 5%, 0) scale(1.08);
          }
        }

        .level-service-orbit {
          animation: serviceGlow 8s ease-in-out infinite;
        }
      `}</style>

      <PageHero
        backgroundImage="/assets/images/fasilitas.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.72), rgba(17, 25, 40, 1))"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/tentang", label: "Tentang" },
          { label: "Fasilitas" },
        ]}
        title={
          <>
            Fasilitas <br />
            <span className="italic text-[#facc15]">Bandar Udara</span>
          </>
        }
        description="Informasi fasilitas sisi udara, sisi darat, dan gedung terminal Bandar Udara Tardamu untuk mendukung keselamatan operasi serta kenyamanan pengguna jasa."
      />

      <main>
        <section className="border-b border-white/5 px-6 py-20">
          <div className="mx-auto mt-16 grid max-w-7xl overflow-hidden border-y border-white/10 md:grid-cols-3">
            {facilityGroups.map((group) => (
              <div
                key={group.title}
                className="border-b border-white/10 px-8 py-8 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <p className="mb-4 text-4xl font-black text-[#facc15]">{group.number}</p>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#facc15]">
                  {group.eyebrow}
                </p>
                <h3 className="text-2xl text-white" style={serifStyle}>
                  {group.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {facilityGroups.map((group, groupIndex) => (
          <section
            key={group.title}
            className={`facility-reveal border-b border-white/5 px-6 py-24 ${groupIndex % 2 === 0 ? "bg-[#172131]" : "bg-[#111928]"
              }`}
          >
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-[#facc15]">
                    {group.eyebrow}
                  </p>
                  <h2 className="text-4xl leading-tight text-white md:text-5xl" style={serifStyle}>
                    {group.title}
                  </h2>
                </div>
                <p className="max-w-3xl leading-relaxed text-gray-400 lg:ml-auto">
                  {group.description}
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item, itemIndex) => (
                  <article
                    key={item.name}
                    className="group overflow-hidden rounded-[30px] border border-white/5 bg-[#1f2937]/55 shadow-2xl shadow-black/10 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-[#facc15]/70 hover:bg-[#1f2937]/80"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111928] via-[#111928]/15 to-transparent"></div>
                      <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15] text-xl text-[#111928] shadow-xl shadow-black/25">
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#facc15]">
                          {group.eyebrow}
                        </p>
                        <span className="rounded-full border border-white/15 bg-[#111928]/70 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                          {String(itemIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="mb-4 text-2xl text-white" style={serifStyle}>
                        {item.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="facility-reveal relative overflow-hidden border-b border-white/5 bg-[#0b1421] px-6 py-24">
          <div className="level-service-orbit pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-[#facc15]/10 blur-3xl"></div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(250,204,21,0.11),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_36%)]"></div>

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-[#facc15]">
                  Level of Service
                </p>
                <h2 className="text-4xl leading-tight text-white md:text-5xl" style={serifStyle}>
                  Kualitas Pelayanan Bandar Udara{" "}
                  <span className="italic text-[#facc15]">Tardamu Sabu</span>
                </h2>
              </div>
              <p className="max-w-3xl leading-relaxed text-gray-400 lg:ml-auto">
                Evaluasi Level of Service menjadi panduan peningkatan kualitas pelayanan
                Bandar Udara Tardamu, mulai dari alur perjalanan penumpang, kenyamanan
                terminal, hingga fasilitas pendukung yang memberi nilai tambah.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
              <div className="rounded-[30px] border border-white/10 bg-[#111928]/90 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4 px-1">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-[#facc15]">
                      Indikator Level of Service
                    </p>
                    <h3 className="mt-2 text-2xl text-white" style={serifStyle}>
                      Kinerja Pelayanan Penumpang
                    </h3>
                  </div>
                  <span className="rounded-full border border-[#facc15]/30 bg-[#facc15]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#facc15]">
                    LoS
                  </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  {serviceIndicators.map((indicator) => (
                    <article
                      key={indicator.title}
                      className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0f1b2a]/85 p-6 transition duration-500 hover:-translate-y-1 hover:border-[#facc15]/70 hover:bg-[#132236]"
                    >
                      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#facc15]/10 blur-2xl transition duration-500 group-hover:bg-[#facc15]/20"></div>
                      <div className="relative">
                        <div className="mb-6 flex items-start justify-between gap-4">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#facc15]/50 bg-[#111928] text-[11px] font-black text-[#facc15]">
                            {indicator.number}
                          </span>
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#facc15]/20 bg-[#facc15]/10 text-3xl text-[#facc15] shadow-[0_0_32px_rgba(250,204,21,0.16)]">
                            <i className={`fa-solid ${indicator.icon}`}></i>
                          </div>
                        </div>

                        <h4 className="min-h-[64px] text-xl leading-tight text-white" style={serifStyle}>
                          {indicator.title}
                        </h4>
                        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                          {indicator.subtitle}
                        </p>

                        <div className="my-7 grid grid-cols-[0.92fr_1.08fr] items-center gap-3">
                          <div className="border-r border-white/10 pr-4">
                            <span className="rounded-full bg-[#facc15] px-3 py-1 text-[10px] font-black text-[#111928]">
                              Predikat
                            </span>
                            <p className="mt-3 text-5xl font-black leading-none text-[#facc15]" style={serifStyle}>
                              {indicator.predicate}
                            </p>
                            <p className="mt-1 text-sm text-white">{indicator.predicateLabel}</p>
                          </div>

                          <div className="flex min-w-0 flex-col items-center pr-3">
                            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">
                              Performance Index
                            </p>
                            <div
                              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full p-2"
                              style={{
                                background: `conic-gradient(#facc15 ${indicator.score}%, rgba(255,255,255,0.08) 0)`,
                              }}
                            >
                              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#111928] text-2xl font-semibold text-white">
                                {indicator.score}%
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-gray-400">{indicator.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="relative overflow-hidden rounded-[30px] border border-[#facc15]/20 bg-[#111928] p-7 shadow-2xl shadow-black/20">
                <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(250,204,21,0.12),transparent_32%),radial-gradient(circle_at_85%_12%,rgba(255,255,255,0.12),transparent_22%)]"></div>
                <div className="absolute right-0 top-24 h-px w-3/4 rotate-[-24deg] bg-[#facc15]/45"></div>
                <div className="relative">
                  <p className="text-3xl font-black text-[#facc15]" style={serifStyle}>
                    IAP4
                  </p>
                  <p className="mt-2 max-w-sm text-[11px] font-bold uppercase leading-relaxed tracking-[0.2em] text-gray-300">
                    Indikasi Awal Pembangunan, Pendayagunaan, Pengembangan dan Pengoperasian
                  </p>

                  <div className="mt-8">
                    <div className="flex flex-wrap items-end gap-4">
                      <p className="text-7xl font-black leading-none text-[#facc15]" style={serifStyle}>
                        0.57
                      </p>
                      <p className="pb-3 text-sm text-gray-300">Skor IAP4</p>
                    </div>
                    <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10 p-1">
                      <div className="h-full w-[57%] rounded-full bg-gradient-to-r from-[#f59e0b] to-[#facc15] shadow-[0_0_24px_rgba(250,204,21,0.35)]"></div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                      <span>0</span>
                      <span>1.00</span>
                    </div>
                  </div>

                  <p className="mt-7 text-sm leading-relaxed text-gray-400">
                    Nilai IAP4 sebesar <span className="font-bold text-[#facc15]">0.57</span>{" "}
                    menunjukkan performa tata kelola bandara pada kategori operasional baik,
                    dengan peluang peningkatan pada aspek pengembangan dan pendayagunaan fasilitas.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {iap4Pillars.map((pillar) => (
                      <div
                        key={pillar.title}
                        className="border-t border-white/10 pt-4 transition duration-300 hover:border-[#facc15]/60"
                      >
                        <i className={`fa-solid ${pillar.icon} mb-3 text-3xl text-[#facc15]`}></i>
                        <h4 className="font-bold text-white">{pillar.title}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-gray-400">{pillar.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
