import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

// Membuat akun admin (Unit Kerja UPBU) melalui mekanisme seeding,
// sekaligus menghubungkannya dengan data pegawai di menu Pegawai.
//
// Cara pakai:
//   npx tsx seed-admin.ts "email@contoh.com" "PasswordMinimal8" "Nama Lengkap Pegawai"
//
// Password tidak disimpan di kode; diketik saat menjalankan perintah.

async function seedAdmin() {
  const [email, password, namaPegawai] = process.argv.slice(2).map((value) => value?.trim());

  if (!email || !password || !namaPegawai) {
    throw new Error('Format: npx tsx seed-admin.ts "email" "password" "Nama Lengkap Pegawai"');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email tidak valid.");
  if (password.length < 8) throw new Error("Password minimal 8 karakter.");

  const [{ auth }, { db }, { pegawai, user }, { eq }] = await Promise.all([
    import("./src/lib/auth"),
    import("./src/db"),
    import("./src/db/schema"),
    import("drizzle-orm"),
  ]);

  // 1. Pastikan pegawainya ada dan tepat satu, sebelum akun dibuat.
  const daftarPegawai = await db
    .select({ id: pegawai.id, nama: pegawai.nama })
    .from(pegawai)
    .where(eq(pegawai.nama, namaPegawai));
  if (daftarPegawai.length !== 1) {
    throw new Error(`Pegawai "${namaPegawai}" ditemukan ${daftarPegawai.length} kali di menu Pegawai, harus tepat 1. Akun tidak dibuat.`);
  }

  // 2. Pastikan email belum dipakai akun lain.
  const [akunLama] = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
  if (akunLama) throw new Error(`Email ${email} sudah dipakai akun lain. Akun tidak dibuat.`);

  // 3. Buat akun lewat jalur internal Better Auth (pendaftaran publik dimatikan),
  //    simpan password dalam bentuk hash, lalu hubungkan dengan data pegawai.
  const ctx = await auth.$context;
  const akunBaru = await ctx.internalAdapter.createUser({
    email: email.toLowerCase(),
    name: daftarPegawai[0].nama,
    emailVerified: false,
  });
  await ctx.internalAdapter.linkAccount({
    userId: akunBaru.id,
    providerId: "credential",
    accountId: akunBaru.id,
    password: await ctx.password.hash(password),
  });
  await db.update(user).set({ pegawai_id: daftarPegawai[0].id }).where(eq(user.id, akunBaru.id));

  console.log(`Akun ${email} berhasil dibuat dan terhubung dengan pegawai "${daftarPegawai[0].nama}".`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Gagal membuat akun admin:", error instanceof Error ? error.message : error);
    process.exit(1);
  });
