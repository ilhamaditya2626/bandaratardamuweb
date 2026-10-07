import { createAdminCrud } from "@/lib/admin-crud";
import { pegawai } from "@/db/schema";

const crud = createAdminCrud({
  table: pegawai,
  label: "pegawai",
  fields: [
    { name: "nama", type: "string", required: true },
    { name: "jabatan", type: "string" },
    { name: "pendidikan_terakhir", type: "string" },
    { name: "divisi_id", type: "number" },
    { name: "role_id", type: "number" },
  ],
});
export const GET = crud.GET;
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;