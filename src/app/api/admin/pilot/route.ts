import { createAdminCrud } from "@/lib/admin-crud";
import { pilot } from "@/db/schema";

const crud = createAdminCrud({
  table: pilot,
  label: "pilot",
  fields: [
    { name: "nama", type: "string", required: true },
    { name: "nomor_lisensi", type: "string" },
    { name: "maskapai_id", type: "number", required: true },
  ],
});
export const GET = crud.GET;
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;