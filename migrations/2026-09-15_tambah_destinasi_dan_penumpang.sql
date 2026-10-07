-- Migrasi: Menambah tabel DESTINASI dan PENUMPANG
-- Sesuai ERD Chen yang sudah di-ACC dosen pembimbing.
-- Ini implementasi BERTAHAP (Opsi aman): tabel baru ditambahkan
-- tanpa mengubah/menghapus apapun yang sudah berjalan.
-- Kolom origin/destination di flights & ticket_prices TETAP teks
-- bebas seperti sekarang (belum dihubungkan ke tabel ini), supaya
-- integrasi SIMTAR tidak terganggu.
-- CATATAN: tabel `penumpang` disiapkan strukturnya saja -- belum
-- ada form/halaman yang mengisi datanya secara nyata.

CREATE TABLE IF NOT EXISTS `destinasi` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kode_bandara` VARCHAR(10) NULL,
  `nama_kota` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `penumpang` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(150) NOT NULL,
  `nomor_identitas` VARCHAR(50) NULL,
  `kontak` VARCHAR(30) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Data awal (seed) DESTINASI -- Kupang (Bandara El Tari, kode IATA
-- KOE, terverifikasi) adalah rute utama dari Bandara Tardamu.
INSERT INTO `destinasi` (`kode_bandara`, `nama_kota`) VALUES
  ('KOE', 'Kupang');

-- Tabel penumpang sengaja TIDAK diisi data contoh -- karena belum
-- ada sumber data nyata untuk pencatatan per-individu.
