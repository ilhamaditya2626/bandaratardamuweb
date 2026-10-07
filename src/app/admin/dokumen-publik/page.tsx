"use client";

import CrudPage from "@/components/admin/CrudPage";

const categories = [
  { value: "annual_report", label: "Laporan Tahunan" },
  { value: "work_budget", label: "Rencana Kerja Anggaran" },
  { value: "financial_report", label: "Laporan Keuangan" },
  { value: "lakip", label: "LAKIP" },
  { value: "dip", label: "Daftar Informasi Publik" },
  { value: "dik", label: "Daftar Informasi Dikecualikan" },
  { value: "sop", label: "SOP" },
  { value: "surat", label: "Surat" },
  { value: "bmn", label: "Barang Milik Negara (BMN)" },
];

const accessTypes = [
  { value: "umum", label: "Umum (tampil di website)" },
  { value: "rahasia", label: "Rahasia (tidak tampil di website)" },
];

export default function DokumenPublikAdminPage() {
  return (
    <CrudPage
      title="Dokumen Publik"
      description="Unggah dan kelola dokumen PDF. Hanya dokumen berjenis Umum dan dicentang Tampilkan yang muncul di halaman Dokumen Publik."
      endpoint="/api/admin/dokumen-publik"
      addLabel="Tambah Dokumen"
      fields={[
        { name: "category", label: "Kategori", type: "select", options: categories, required: true },
        { name: "subcategory", label: "Subkategori (opsional)", type: "text" },
        { name: "title", label: "Judul Dokumen", type: "text", required: true },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "document_date", label: "Tanggal Dokumen", type: "date" },
        { name: "file_url", label: "Berkas PDF (maks. 25 MB)", type: "file", accept: "application/pdf", fileNameField: "file_name", required: true },
        { name: "total_pages", label: "Jumlah Halaman", type: "number", required: true, defaultValue: "0" },
        { name: "access_type", label: "Jenis Akses", type: "select", options: accessTypes, required: true, defaultValue: "umum" },
        { name: "is_published", label: "Tampilkan ke publik", type: "checkbox", defaultValue: true },
      ]}
      columns={[
        { key: "category", label: "Kategori" },
        { key: "title", label: "Judul" },
        { key: "document_date", label: "Tanggal" },
        { key: "access_type", label: "Akses" },
        { key: "is_published", label: "Tampil" },
      ]}
    />
  );
}