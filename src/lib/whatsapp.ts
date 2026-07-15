// Ubah nomor telepon Indonesia menjadi URL WhatsApp (wa.me).
// Contoh: "0812-3456-7890" -> "https://wa.me/6281234567890".
export function toWhatsappUrl(phone?: string | null): string {
  if (!phone) return "#";

  let digits = phone.replace(/\D/g, "");
  if (!digits) return "#";

  if (digits.startsWith("62")) {
    // sudah format internasional
  } else if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (digits.startsWith("8")) {
    digits = "62" + digits;
  }

  return `https://wa.me/${digits}`;
}
