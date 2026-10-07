"use client";

import CrudPage from "@/components/admin/CrudPage";

export default function MaskapaiAdminPage() {
  return (
    <CrudPage
      title="Maskapai"
      description="Kelola data maskapai yang melayani Bandara Tardamu."
      endpoint="/api/admin/maskapai"
      addLabel="Tambah Maskapai"
      fields={[
        { name: "nama", label: "Nama Maskapai", type: "text", required: true },
        { name: "kode", label: "Kode Maskapai", type: "text" },
      ]}
      columns={[
        { key: "nama", label: "Nama" },
        { key: "kode", label: "Kode" },
      ]}
    />
  );
}