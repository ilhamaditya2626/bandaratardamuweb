/**
 * Helper pengiriman notifikasi Telegram via Telegram Bot API.
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramNotification(htmlMessage: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Token atau Chat ID belum disetel di .env
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gagal mengirim notifikasi Telegram:", res.status, errText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error saat menghubungi Telegram Bot API:", error);
    return false;
  }
}

export interface InformationRequestNotificationPayload {
  request_type: string;
  name: string;
  phone: string;
  email: string;
  occupation: string;
  institution?: string | null;
  information_detail?: string | null;
  purpose?: string | null;
  objection_reason?: string | null;
  objection_reason_other?: string | null;
  case_position?: string | null;
  submitted_on: string;
}

export async function notifyNewInformationRequest(
  data: InformationRequestNotificationPayload
): Promise<void> {
  try {
    const isObjection = data.request_type === "objection";
    const header = isObjection
      ? "⚠️ <b>PENGAJUAN KEBERATAN INFORMASI BARU</b>"
      : "📬 <b>PERMOHONAN INFORMASI PUBLIK BARU</b>";

    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://tardamuairport.id";

    const lines: (string | null)[] = [
      header,
      "━━━━━━━━━━━━━━━━━━━━",
      `📅 <b>Tanggal:</b> ${escapeHtml(data.submitted_on)}`,
      `👤 <b>Nama:</b> ${escapeHtml(data.name)}`,
      `📱 <b>No. HP/WA:</b> ${escapeHtml(data.phone)}`,
      `✉️ <b>Email:</b> ${escapeHtml(data.email)}`,
      `💼 <b>Pekerjaan:</b> ${escapeHtml(data.occupation)}`,
      data.institution ? `🏢 <b>Instansi:</b> ${escapeHtml(data.institution)}` : null,
      "━━━━━━━━━━━━━━━━━━━━",
    ];

    if (isObjection) {
      lines.push(
        `❓ <b>Alasan Keberatan:</b>\n${escapeHtml(data.objection_reason || "-")}`
      );
      if (data.objection_reason_other) {
        lines.push(`📝 <b>Keterangan Alasan Lain:</b>\n${escapeHtml(data.objection_reason_other)}`);
      }
      if (data.case_position) {
        lines.push(`📌 <b>Kasus Posisi:</b>\n${escapeHtml(data.case_position)}`);
      }
    } else {
      lines.push(
        `📄 <b>Rincian Informasi:</b>\n${escapeHtml(data.information_detail || "-")}`,
        "",
        `🎯 <b>Tujuan Penggunaan:</b>\n${escapeHtml(data.purpose || "-")}`
      );
    }

    lines.push(
      "━━━━━━━━━━━━━━━━━━━━",
      `🔗 <i>Periksa di Dashboard Admin:</i>\n${siteUrl}/admin/information-services`
    );

    const message = lines.filter((l) => l !== null).join("\n");
    await sendTelegramNotification(message);
  } catch (err) {
    // Non-blocking error logging agar form submit pemohon tidak pernah terganggu
    console.error("notifyNewInformationRequest exception:", err);
  }
}
