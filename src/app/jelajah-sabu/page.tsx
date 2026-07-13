import Image from "next/image";
import Link from "next/link";

const exploreCards = [
  {
    title: "Destinasi Wisata",
    description:
      "Temukan keindahan alam dan budaya melalui panduan lokasi wisata terbaik di penjuru Sabu Raijua.",
    icon: "fa-location-dot",
    image: "/assets/images/wisata/Kelabba Madja Sabu Raijua.webp",
    href: "/destinasi-wisata",
  },
  {
    title: "Transportasi & Akses",
    description:
      "Informasi transportasi dari dan menuju Sabu, jalur perjalanan darat, laut, udara dan akses yang tersedia untuk wisatawan.",
    icon: "fa-car",
    image:
      "/assets/images/wisata/transportasi.webp",
    href: "/transportasi-akses",
  },
  {
    title: "Akomodasi",
    description:
      "Pilihan penginapan, hotel, homestay dengan fasilitas beragam untuk kenyamanan singgah Anda di Sabu.",
    icon: "fa-house",
    image:
      "/assets/images/wisata/penginapan.webp",
    href: "/akomodasi-penginapan",
  },
];

export default function JelajahSabuPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-[148px] sm:px-6 md:pb-28 md:pt-[164px] lg:px-8">
          <div className="max-w-3xl">
            <nav className="mb-6 flex text-sm text-gray-300" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li>
                  <Link href="/" className="hover:text-white">
                    Beranda
                  </Link>
                </li>
                <li>
                  <i className="fa-solid fa-chevron-right mx-2 text-[10px]"></i>
                </li>
                <li className="text-[#facc15]">Jelajah Sabu</li>
              </ol>
            </nav>

            <h1 className="mb-6 text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
              <span style={{ fontFamily: "'Playfair Display', serif" }}>
                Pesona{" "}
                <span className="italic text-[#facc15] underline decoration-gray-500 underline-offset-8">
                  Sabu Raijua
                </span>
              </span>
            </h1>

            <p className="max-w-3xl text-lg leading-relaxed text-gray-200">
              Kabupaten Sabu Raijua merupakan destinasi eksotis di Nusa Tenggara Timur.
              Temukan keindahan alam yang tak tertandingi di beranda selatan Indonesia.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <section id="jelajah-sabu">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2
                className="mb-4 text-3xl text-white md:text-4xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Mulai Penjelajahan Anda
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-200 md:text-base">
                Rencanakan perjalanan Anda bersama kami. Panduan ini mencakup berbagai
                tempat ikonik, akses transportasi, dan pilihan akomodasi terbaik.
              </p>
            </div>

            <a
              href="https://disparbud.saburaijuakab.go.id/#pariwisata"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg border border-white/15 bg-[#1f2937]/80 px-6 py-3 text-sm font-medium text-white transition-all hover:border-[#facc15]"
            >
              Lihat Peta Wisata <i className="fa-solid fa-location-arrow ml-2 text-[#facc15]"></i>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {exploreCards.map((item) => (
              <article
                key={item.title}
                className="group relative flex h-[480px] flex-col overflow-hidden rounded-2xl shadow-2xl"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111928] via-[#111928]/70 to-[#111928]/20"></div>
                <div className="relative z-10 flex h-full flex-col p-8">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#facc15]/90 text-2xl text-[#111928] shadow-lg">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h3
                    className="mb-4 text-2xl text-white md:text-3xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="flex-grow text-sm leading-relaxed text-gray-200 md:text-base">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#facc15] transition-all group-hover:gap-4"
                  >
                    Jelajahi Sekarang <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-24" id="peta-lokasi">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-[2px] flex-grow bg-white/10"></div>
              <h2
                className="text-2xl italic text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Peta Lokasi Sabu Raijua
              </h2>
              <div className="h-[2px] flex-grow bg-white/10"></div>
            </div>

            <div className="overflow-hidden rounded-xl border-4 border-[#1f2937]/90 shadow-2xl">
              <iframe
                title="Peta Sabu Raijua"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252458.749005953!2d121.72266890356555!3d-10.511394148464672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c37730e181f9b3f%3A0x3030303030303030!2sSabu%20Raijua%20Regency%2C%20East%20Nusa%20Tenggara!5e0!3m2!1sen!2sid!4v1711880000000!5m2!1sen!2sid"
                className="h-[450px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
