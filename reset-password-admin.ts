import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

// Membuat password baru untuk akun admin yang lupa password.
// Password lama tidak bisa dilihat, karena yang tersimpan hanya hasil hash.
//
// Cara pakai:
//   npx tsx reset-password-admin.ts "email@contoh.com" "PasswordBaruMinimal8"
//
// Setelah login dengan password baru, admin sebaiknya menggantinya lagi di menu Pengaturan.

async function resetPassword() {
  const [email, passwordBaru] = process.argv.slice(2).map((value) => value?.trim());

  if (!email || !passwordBaru) {
    throw new Error('Format: npx tsx reset-password-admin.ts "email" "passwordBaru"');
  }
  if (passwordBaru.length < 8) throw new Error("Password baru minimal 8 karakter.");

  const [{ auth }, { db }, { user }, { eq }] = await Promise.all([
    import("./src/lib/auth"),
    import("./src/db"),
    import("./src/db/schema"),
    import("drizzle-orm"),
  ]);

  const [akun] = await db.select({ id: user.id, name: user.name }).from(user).where(eq(user.email, email.toLowerCase()));
  if (!akun) throw new Error(`Akun ${email} tidak ditemukan.`);

  const ctx = await auth.$context;
  await ctx.internalAdapter.updatePassword(akun.id, await ctx.password.hash(passwordBaru));
  // Semua sesi login akun ini diakhiri, supaya harus login ulang dengan password baru.
  await ctx.internalAdapter.deleteSessions(akun.id);

  console.log(`Password akun ${email} (${akun.name}) berhasil diganti. Silakan login dengan password baru.`);
}

resetPassword()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Gagal mengganti password:", error instanceof Error ? error.message : error);
    process.exit(1);
  });
