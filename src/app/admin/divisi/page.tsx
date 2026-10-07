"use client";

import CrudPage from "@/components/admin/CrudPage";

export default function DivisiAdminPage() {
  return (
    <CrudPage
      title="Divisi / Unit Kerja"
      description="Kelola daftar unit kerja yang tampil di halaman Unit Kerja."
      endpoint="/api/admin/divisi"
      addLabel="Tambah Divisi"
      fields={[
        { name: "nama", label: "Nama Divisi", type: "text", required: true },
        { name: "deskripsi", label: "Deskripsi", type: "textarea" },
      ]}
      columns={[
        { key: "nama", label: "Nama" },
        { key: "deskripsi", label: "Deskripsi" },
      ]}
    />
  );
}