"use client";

import CrudPage from "@/components/admin/CrudPage";

const statuses = [
  { value: "pending", label: "Menunggu" },
  { value: "processed", label: "Sedang diproses" },
  { value: "accepted", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
];

export default function PermohonanInformasiAdminPage() {
  return (
    <CrudPage
      title="Permohonan & Keberatan Informasi"
      description="Tanggapi permohonan dan keberatan informasi publik yang masuk dari formulir."
      endpoint="/api/admin/permohonan-informasi"
      canCreate={false}
      fields={[
        { name: "request_type", label: "Jenis (information = permohonan, objection = keberatan)", type: "readonly" },
        { name: "name", label: "Nama Pemohon", type: "readonly" },
        { name: "email", label: "Email", type: "readonly" },
        { name: "phone", label: "No. Telepon", type: "readonly" },
        { name: "address", label: "Alamat", type: "readonly" },
        { name: "occupation", label: "Pekerjaan", type: "readonly" },
        { name: "institution", label: "Instansi", type: "readonly" },
        { name: "identity_type", label: "Jenis Identitas", type: "readonly" },
        { name: "identity_number", label: "Nomor Identitas", type: "readonly" },
        { name: "identity_file_url", label: "Berkas Identitas", type: "readonly" },
        { name: "information_detail", label: "Informasi yang Diminta", type: "readonly" },
        { name: "purpose", label: "Tujuan Penggunaan", type: "readonly" },
        { name: "objection_reason", label: "Alasan Keberatan", type: "readonly" },
        { name: "objection_reason_other", label: "Alasan Keberatan Lainnya", type: "readonly" },
        { name: "case_position", label: "Kasus Posisi", type: "readonly" },
        { name: "status", label: "Status", type: "select", options: statuses, required: true },
        { name: "admin_note", label: "Catatan / Tanggapan Petugas", type: "textarea" },
      ]}
      columns={[
        { key: "request_type", label: "Jenis", render: (row) => (row.request_type === "objection" ? "Keberatan" : "Permohonan") },
        { key: "name", label: "Pemohon" },
        { key: "email", label: "Email" },
        { key: "submitted_on", label: "Masuk", render: (row) => new Date(row.submitted_on).toLocaleDateString("id-ID") },
        { key: "status", label: "Status" },
      ]}
    />
  );
}