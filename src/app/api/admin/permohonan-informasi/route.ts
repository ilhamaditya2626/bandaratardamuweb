import { createAdminCrud } from "@/lib/admin-crud";
import { informationRequests } from "@/db/schema";

const crud = createAdminCrud({
  table: informationRequests,
  label: "permohonan informasi",
  allowCreate: false,
  pegawaiField: "ditangani_oleh",
  pegawaiOn: "update", // petugas yang menanggapi tercatat otomatis
  fields: [
    { name: "status", type: "string", required: true },
    { name: "admin_note", type: "string" },
  ],
});
export const GET = crud.GET;
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;