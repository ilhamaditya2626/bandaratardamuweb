import { createAdminCrud } from "@/lib/admin-crud";
import { divisi } from "@/db/schema";

const crud = createAdminCrud({
  table: divisi,
  label: "divisi",
  fields: [
    { name: "nama", type: "string", required: true },
    { name: "deskripsi", type: "string" },
  ],
});
export const GET = crud.GET;
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;