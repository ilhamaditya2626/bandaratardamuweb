import { createAdminCrud } from "@/lib/admin-crud";
import { publicDocuments } from "@/db/schema";

const crud = createAdminCrud({
  table: publicDocuments,
  label: "dokumen publik",
  pegawaiField: "pegawai_id", // diisi otomatis dari admin yang login
  fields: [
    { name: "category", type: "string", required: true },
    { name: "subcategory", type: "string" },
    { name: "title", type: "string", required: true },
    { name: "description", type: "string" },
    { name: "document_date", type: "date" },
    { name: "file_url", type: "string", required: true },
    { name: "file_name", type: "string", required: true },
    { name: "total_pages", type: "number", required: true },
    { name: "is_published", type: "boolean" },
    { name: "access_type", type: "string", required: true },
  ],
});
export const GET = crud.GET;
export const POST = crud.POST;
export const PUT = crud.PUT;
export const DELETE = crud.DELETE;