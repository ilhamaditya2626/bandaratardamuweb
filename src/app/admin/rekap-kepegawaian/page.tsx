import { redirect } from "next/navigation";

// Rekap Kepegawaian sekarang berada di halaman Pegawai.
export default function RekapKepegawaianRedirect() {
  redirect("/admin/pegawai");
}
