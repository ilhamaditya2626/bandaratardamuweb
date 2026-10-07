"use client";

import CrudPage from "@/components/admin/CrudPage";

export default function PegawaiAdminPage() {
  return (
    <CrudPage
      title="Pegawai"
      description="Kelola data pegawai UPBU. Data ini dipakai di halaman Informasi Berkala."
      endpoint="/api/admin/pegawai"
      addLabel="Tambah Pegawai"
      fields={[
        { name: "nama", label: "Nama", type: "text", required: true },
        { name: "jabatan", label: "Jabatan", type: "text" },
        { name: "pendidikan_terakhir", label: "Pendidikan Terakhir", type: "text" },
        { name: "divisi_id", label: "Divisi", type: "select", optionsFrom: "divisi" },
        { name: "role_id", label: "Role", type: "select", optionsFrom: "role" },
      ]}
      columns={[
        { key: "nama", label: "Nama" },
        { key: "jabatan", label: "Jabatan" },
        { key: "pendidikan_terakhir", label: "Pendidikan" },
        { key: "divisi_id", label: "Divisi" },
        { key: "role_id", label: "Role" },
      ]}
    />
  );
}