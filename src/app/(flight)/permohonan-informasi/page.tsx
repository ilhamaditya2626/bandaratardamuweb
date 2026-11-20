import { redirect } from "next/navigation";

// Formulir permohonan dan keberatan informasi berada di halaman Layanan Informasi.
// Alamat lama ini diarahkan ke formulir tersebut agar tautan yang sudah ada tetap berfungsi.
export default async function PermohonanInformasiPage({
  searchParams,
}: {
  searchParams: Promise<{ jenis?: string }>;
}) {
  const { jenis } = await searchParams;
  redirect(jenis === "keberatan" ? "/layanan-informasi?form=keberatan" : "/layanan-informasi?form=permohonan");
}
