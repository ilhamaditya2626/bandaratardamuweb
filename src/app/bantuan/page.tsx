"use client";

import FlightLayout from "../(flight)/layout";
import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "Kapan waktu terbaik untuk tiba di bandara sebelum keberangkatan?",
    answer:
      "Untuk penerbangan domestik, kami menyarankan Anda tiba sekurang-kurangnya 2 jam sebelum waktu keberangkatan untuk proses check-in dan pemeriksaan keamanan yang nyaman.",
  },
  {
    question: "Apakah tersedia charger station untuk gadget penumpang di Terminal Penumpang?",
    answer:
      "Untuk menjaga kenyamanan dan pengalaman positif bagi seluruh penumpang, Bandara Tardamu menyediakan beberapa titik akses Charger Station yang tersebar di area terminal. Anda dapat menemui fasilitas pengisian daya baterai ini di beberapa lokasi strategis: Area Ruang Tunggu Keberangkatan (Boarding Gate area), Area Ruang Tunggu Kedatangan (Arrival Hall), Area Check-in Counter.",
  },
  {
    question: "Bagaimana cara melihat jadwal penerbangan di Bandara Tardamu?",
    answer:
      "Silahkan akses halaman website bagian penerbangan untuk melihat jadwal penerbangan di Bandara Tardamu",
  },
];

const helpCards = [
  {
    iconClass: "fa-solid fa-phone-volume",
    valueIconClass: "fa-solid fa-phone",
    title: "Pusat Panggilan",
    description: "Layanan 24 jam untuk informasi operasional bandara.",
    value: "(0380) 861322",
    href: "tel:0380861322",
  },
  {
    iconClass: "fa-solid fa-envelope-open-text",
    valueIconClass: "fa-solid fa-envelope",
    title: "Dukungan Email",
    description: "Kirimkan pertanyaan atau masukan Anda secara tertulis.",
    value: "bandaratardamu@gmail.com",
    href: "mailto:bandaratardamu@gmail.com",
  },
  {
    iconClass: "fa-brands fa-whatsapp",
    valueIconClass: "fa-brands fa-whatsapp",
    title: "WhatsApp Chat",
    description: "Respon cepat melalui aplikasi pesan instan WhatsApp.",
    value: "0812 3456 7890",
    href: "https://wa.me/6281234567890",
  },
];

const complaintChannels = [
  {
    icon: "fa-tower-broadcast",
    title: "Contact Center 151",
    description: "Layanan informasi terpadu perhubungan di seluruh Indonesia.",
    href: "tel:151",
    label: "Hubungi 151",
  },
  {
    icon: "fa-shield-halved",
    title: "SIMADU (WBS)",
    description: "Sistem Manajemen Pengaduan untuk pelaporan KKN dan pelanggaran.",
    href: "https://simadu.dephub.go.id",
    label: "Buka Sistem",
  },
  {
    icon: "fa-handshake-angle",
    title: "SP4N-LAPOR!",
    description: "Layanan aspirasi dan pengaduan rakyat secara nasional.",
    href: "https://lapor.go.id",
    label: "Kunjungi Website",
  },
];

function BantuanContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scriptSrc = "https://elfsightcdn.com/platform.js";
    const widgetClass = "elfsight-app-37cd97bc-620e-41e8-b222-b62dae7c36eb";
    const platformWindow = window as Window & {
      elfsightPlatform?: {
        init?: () => void;
        reload?: () => void;
      };
    };

    const mountWidget = () => {
      if (!reviewsRef.current) {
        return;
      }

      reviewsRef.current.innerHTML = "";

      const widget = document.createElement("div");
      widget.className = widgetClass;
      widget.setAttribute("data-elfsight-app-lazy", "");
      reviewsRef.current.appendChild(widget);

      window.setTimeout(() => {
        platformWindow.elfsightPlatform?.reload?.();
        platformWindow.elfsightPlatform?.init?.();
      }, 150);
    };

    const existingScript = document.querySelector(
      `script[src="${scriptSrc}"]`,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        mountWidget();
      } else {
        existingScript.addEventListener("load", mountWidget, { once: true });
      }

      return;
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.dataset.loaded = "false";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        mountWidget();
      },
      { once: true },
    );
    document.body.appendChild(script);
  }, []);

  const handleFeedbackSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackError("");
    setIsFeedbackSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: feedbackName,
          message: feedbackMessage,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Aspirasi belum dapat dikirim.");
      }

      setFeedbackName("");
      setFeedbackMessage("");
      setIsFeedbackSent(true);
    } catch (error) {
      setFeedbackError(
        error instanceof Error ? error.message : "Aspirasi belum dapat dikirim.",
      );
    } finally {
      setIsFeedbackSubmitting(false);
    }
  };

  return (
    <main className="bg-[#111928] font-[Poppins,sans-serif] text-gray-200 antialiased">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #111928;
        }

        ::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #facc15;
        }
      `}</style>

      <header
        className="px-6 pb-24 pt-40 text-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(17, 25, 40, 0.8), rgba(17, 25, 40, 1)), url('https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-[#facc15]">
            Customer Service Excellence
          </span>
          <h1
            className="mb-6 text-5xl text-white md:text-7xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Kami Siap <br />
            <span className="italic text-[#facc15]">Membantu Anda</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            Temukan informasi yang Anda butuhkan mengenai layanan bandara, prosedur
            keamanan, dan bantuan teknis lainnya.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative z-10 -mt-32 grid grid-cols-1 gap-8 md:grid-cols-3">
          {helpCards.map((item) => (
            <div
              key={item.title}
              className="group rounded-[32px] border border-white/5 bg-[rgba(31,41,55,0.6)] p-10 text-center backdrop-blur-xl transition-all duration-500 hover:border-[#facc15]"
            >
              <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#facc15]/10 text-3xl text-[#facc15] transition group-hover:scale-110">
                <i className={item.iconClass}></i>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
              <p className="mb-6 text-sm text-gray-400">{item.description}</p>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center justify-center gap-3 text-base font-bold text-[#facc15] transition-colors hover:text-white"
              >
                <i className={`${item.valueIconClass} text-base shrink-0`}></i>
                <span className="break-all">{item.value}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-40 max-w-4xl">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-3xl text-white md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pertanyaan <span className="italic text-[#facc15]">Sering Diajukan</span>
            </h2>
            <div className="mx-auto h-1 w-20 bg-[#facc15]"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-white/5 bg-[rgba(31,41,55,0.6)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 p-6 text-left font-medium text-white transition hover:bg-white/5"
                  >
                    <span>{faq.question}</span>
                    <i
                      className={`fa-solid fa-chevron-down shrink-0 text-[#facc15] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    ></i>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 text-sm text-gray-400">{faq.answer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-40 rounded-[40px] border border-white/5 bg-[#1f2937]/30 p-12">
          <div className="mb-12 text-center">
            <h2
              className="mb-4 text-3xl uppercase tracking-widest text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Kanal Pengaduan <span className="text-[#facc15]">Resmi</span>
            </h2>
            <p className="text-gray-500">
              Integrasi layanan pengaduan di bawah naungan Kementerian Perhubungan
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {complaintChannels.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mb-4 text-3xl text-[#facc15]">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h4 className="mb-2 font-bold text-white">{item.title}</h4>
                <p className="mb-4 text-xs leading-relaxed text-gray-500">{item.description}</p>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="border-b border-[#facc15]/30 pb-1 text-sm font-bold text-[#facc15]"
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[40px] border border-[#facc15]/20 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_38%),rgba(31,41,55,0.72)] shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative p-8 md:p-12">
              <div className="absolute right-8 top-8 hidden h-20 w-20 rounded-full border border-[#facc15]/20 lg:block"></div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#facc15]/25 bg-[#facc15]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#facc15]">
                <i className="fa-solid fa-pen-nib"></i>
                Kritik & Saran
              </span>
              <h2
                className="mb-5 text-3xl leading-tight text-white md:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Suara Anda Membantu Kami Lebih Baik
              </h2>
              <p className="max-w-xl text-sm leading-7 text-gray-400 md:text-base">
                Sampaikan pengalaman, kritik, atau saran untuk peningkatan layanan Bandara
                Tardamu. Setiap aspirasi akan diterima oleh tim admin sebagai bahan evaluasi.
              </p>
            </div>

            <div className="border-t border-white/5 bg-[#0f172a]/45 p-8 md:p-12 lg:border-l lg:border-t-0">
              {isFeedbackSent ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15 text-4xl text-emerald-300">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <h3 className="mb-3 text-3xl font-bold text-white">Pesan terkirim</h3>
                  <p className="max-w-md text-sm leading-7 text-emerald-50/70">
                    Terima kasih. Kritik dan saran Anda sudah masuk ke dashboard admin.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsFeedbackSent(false)}
                    className="mt-8 rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:border-[#facc15] hover:text-[#facc15]"
                  >
                    Kirim Aspirasi Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="feedback-name" className="mb-2 block text-sm font-semibold text-white">
                      Nama
                    </label>
                    <input
                      id="feedback-name"
                      type="text"
                      required
                      maxLength={120}
                      value={feedbackName}
                      onChange={(event) => setFeedbackName(event.target.value)}
                      placeholder="Masukkan nama Anda"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#facc15] focus:bg-white/[0.08]"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <label
                        htmlFor="feedback-message"
                        className="block text-sm font-semibold text-white"
                      >
                        Kritik dan Saran
                      </label>
                      <span className="text-xs text-gray-500">{feedbackMessage.length}/2000</span>
                    </div>
                    <textarea
                      id="feedback-message"
                      required
                      maxLength={2000}
                      rows={7}
                      value={feedbackMessage}
                      onChange={(event) => setFeedbackMessage(event.target.value)}
                      placeholder="Tulis kritik, saran, atau pengalaman layanan Anda..."
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#facc15] focus:bg-white/[0.08]"
                    />
                  </div>

                  {feedbackError && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                      {feedbackError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isFeedbackSubmitting}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#facc15] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#111928] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isFeedbackSubmitting ? "Mengirim..." : "Kirim Aspirasi"}
                    <i className="fa-solid fa-arrow-right transition group-hover:translate-x-1"></i>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="my-10">
          <div ref={reviewsRef}></div>
        </div>
      </section>
    </main>
  );
}

export default function BantuanPage() {
  return (
    <FlightLayout>
      <BantuanContent />
    </FlightLayout>
  );
}
