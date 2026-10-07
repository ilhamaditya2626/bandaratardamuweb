import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { PageHero } from "../_components/info-page-shell";
import InformationRequestForm from "./information-request-form";

type PageProps = { searchParams?: Promise<{ jenis?: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Permohonan & Keberatan Informasi",
    description: "Ajukan permohonan informasi publik atau keberatan secara elektronik kepada PPID Bandar Udara Tardamu Sabu Raijua.",
    path: "/permohonan-informasi",
  });
}

export default async function PermohonanInformasiPage({ searchParams }: PageProps) {
  const jenis = (await searchParams)?.jenis === "keberatan" ? "keberatan" : "permohonan";
  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/hero-bg.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, .82), rgba(17, 25, 40, 1))"
        breadcrumbs={[{ href: "/", label: "Beranda" }, { href: "/layanan-informasi", label: "Layanan Informasi" }, { label: "Permohonan Informasi" }]}
        title={<>Permohonan <br /><span className="italic text-[#facc15]">Informasi</span></>}
        description="Ajukan permohonan informasi publik atau keberatan atas tanggapan permohonan secara elektronik."
      />
      <main className="mx-auto max-w-4xl px-6 py-20">
        <InformationRequestForm initialKind={jenis} />
      </main>
    </div>
  );
}
