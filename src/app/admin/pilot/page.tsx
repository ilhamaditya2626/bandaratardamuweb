"use client";

import CrudPage from "@/components/admin/CrudPage";

export default function PilotAdminPage() {
  return (
    <CrudPage
      title="Pilot"
      description="Kelola data pilot beserta maskapainya."
      endpoint="/api/admin/pilot"
      addLabel="Tambah Pilot"
      fields={[
        { name: "nama", label: "Nama Pilot", type: "text", required: true },
        { name: "nomor_lisensi", label: "Nomor Lisensi", type: "text" },
        { name: "maskapai_id", label: "Maskapai", type: "select", optionsFrom: "maskapai", required: true },
      ]}
      columns={[
        { key: "nama", label: "Nama" },
        { key: "nomor_lisensi", label: "Nomor Lisensi" },
        { key: "maskapai_id", label: "Maskapai" },
      ]}
    />
  );
}