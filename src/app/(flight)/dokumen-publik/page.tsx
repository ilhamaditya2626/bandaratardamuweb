import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { PageHero, serifStyle } from "../_components/info-page-shell";
import { getPublishedDocuments } from "@/services/public-documents.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Dokumen Publik",
    description: "Daftar dokumen publik Bandar Udara Tardamu Sabu Raijua yang dapat dibuka dan diunduh.",
    path: "/dokumen-publik",
  });
}

const categoryLabels: Record<string, string> = {
  annual_report: "Laporan Tahunan",
  work_budget: "Rencana Kerja Anggaran",
  financial_report: "Laporan Keuangan",
  lakip: "LAKIP",
  dip: "Daftar Informasi Publik",
  dik: "Daftar Informasi Dikecualikan",
  sop: "SOP",
  surat: "Surat",
  bmn: "Barang Milik Negara (BMN)",
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default async function DokumenPublikPage() {
  let documents: Awaited<ReturnType<typeof getPublishedDocuments>> | null = null;
  try {
    documents = await getPublishedDocuments();
  } catch (error) {
    console.error("Failed to load public documents:", error);
  }

  const groups = new Map<string, NonNullable<typeof documents>>();
  for (const doc of documents ?? []) {
    groups.set(doc.category, [...(groups.get(doc.category) ?? []), doc]);
  }
  const orderedKeys = [
    ...Object.keys(categoryLabels).filter((key) => groups.has(key)),
    ...[...groups.keys()].filter((key) => !(key in categoryLabels)),
  ];

  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/hero-bg.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, .82), rgba(17, 25, 40, 1))"
        breadcrumbs={[{ href: "/", label: "Beranda" }, { href: "/informasi", label: "Informasi" }, { label: "Dokumen Publik" }]}
        title={<>Dokumen <br /><span className="italic text-[#facc15]">Publik</span></>}
        description="Laporan, rencana kerja, daftar informasi, dan dokumen lain yang dapat diakses masyarakat."
      />
      <main className="mx-auto max-w-5xl px-6 py-20">
        {!documents ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">Gagal memuat dokumen publik.</div>
        ) : documents.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-[#1f2937] p-10 text-center text-gray-400">Belum ada dokumen yang dipublikasikan.</div>
        ) : (
          <div className="space-y-12">
            {orderedKeys.map((key) => (
              <section key={key}>
                <h2 className="mb-5 text-2xl text-white" style={serifStyle}>{categoryLabels[key] ?? key}</h2>
                <div className="space-y-3">
                  {(groups.get(key) ?? []).map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-[#1f2937] p-5 transition hover:border-[#facc15]/70"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                        <i className="fa-solid fa-file-pdf" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-semibold text-white">{doc.title}</span>
                        {doc.description && <span className="mt-1 block text-sm leading-6 text-gray-400">{doc.description}</span>}
                        <span className="mt-2 block text-xs text-gray-500">
                          {doc.document_date ? dateFormatter.format(new Date(doc.document_date)) : null}
                          {doc.document_date && doc.total_pages > 0 ? " • " : null}
                          {doc.total_pages > 0 ? `${doc.total_pages} halaman` : null}
                        </span>
                      </span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs text-gray-500 group-hover:text-[#facc15]" />
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
        <div className="mt-14">
          <Link href="/permohonan-informasi" className="inline-flex items-center gap-2 rounded-full bg-[#facc15] px-6 py-3 text-sm font-bold text-[#111928]">
            Dokumen tidak ditemukan? Ajukan permohonan informasi
          </Link>
        </div>
      </main>
    </div>
  );
}