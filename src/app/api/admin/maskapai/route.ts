import { createAdminCrud } from "@/lib/admin-crud";
import { maskapai } from "@/db/schema";

const crud = createAdminCrud({
  table: maskapai,
  label: "maskapai",
  fields: [
    { name: "nama", type: "string", required: true },
    { name: "kode", type: "string" },
  ],
});
export const GET = crud.GET;
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;