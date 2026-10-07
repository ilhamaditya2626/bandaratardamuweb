-- Migrasi: Menambah tabel ROLE dan PENERBANGAN sesuai ERD Chen
-- yang sudah di-ACC dosen pembimbing.
-- PENTING: tabel ini BERDIRI SENDIRI, tidak menggantikan atau
-- mengubah tabel user/session/account/verification/flights/
-- ticket_prices/passenger_stats yang tetap dipakai aplikasi yang
-- berjalan. Datanya adalah SALINAN (snapshot) dari data yang sudah
-- ada, bukan sumber data otomatis/real-time.

CREATE TABLE IF NOT EXISTS `role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama_role` VARCHAR(50) NOT NULL,
  `deskripsi` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `penerbangan` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maskapai_id` INT NULL,
  `pilot_id` INT NULL,
  `destinasi_id` INT NULL,
  `penumpang_id` INT NULL,
  `tanggal` DATE NULL,
  `jam` VARCHAR(5) NULL,
  `seat` VARCHAR(10) NULL,
  `harga_tiket` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `penerbangan_maskapai_id_idx` (`maskapai_id`),
  INDEX `penerbangan_pilot_id_idx` (`pilot_id`),
  INDEX `penerbangan_destinasi_id_idx` (`destinasi_id`),
  INDEX `penerbangan_penumpang_id_idx` (`penumpang_id`),
  CONSTRAINT `penerbangan_maskapai_id_fk` FOREIGN KEY (`maskapai_id`) REFERENCES `maskapai` (`id`),
  CONSTRAINT `penerbangan_pilot_id_fk` FOREIGN KEY (`pilot_id`) REFERENCES `pilot` (`id`),
  CONSTRAINT `penerbangan_destinasi_id_fk` FOREIGN KEY (`destinasi_id`) REFERENCES `destinasi` (`id`),
  CONSTRAINT `penerbangan_penumpang_id_fk` FOREIGN KEY (`penumpang_id`) REFERENCES `penumpang` (`id`)
);

-- ── Isi data ROLE ──────────────────────────────────────────────
INSERT INTO `role` (`nama_role`, `deskripsi`) VALUES
  ('Admin', 'Pengguna internal yang mengelola konten dan data sistem'),
  ('Pengunjung', 'Pengguna publik yang mengakses informasi tanpa login');

-- ── Isi data PENUMPANG contoh (belum ada data penumpang individu
--    sungguhan di sistem, ini murni contoh struktur) ──────────
INSERT INTO `penumpang` (`nama`, `nomor_identitas`, `kontak`) VALUES
  ('Contoh Penumpang Satu', '5371xxxxxxxxxxx1', '0812xxxxxxx1'),
  ('Contoh Penumpang Dua', '5371xxxxxxxxxxx2', '0812xxxxxxx2');

-- ── Isi data PENERBANGAN (disalin dari flights + ticket_prices
--    yang sudah ada, sebagai snapshot contoh) ──────────────────
INSERT INTO `penerbangan` (`maskapai_id`, `pilot_id`, `destinasi_id`, `penumpang_id`, `tanggal`, `jam`, `seat`, `harga_tiket`)
SELECT
  f.maskapai_id,
  (SELECT id FROM (SELECT id FROM `pilot` ORDER BY id LIMIT 1) AS p1),
  (SELECT id FROM (SELECT id FROM `destinasi` WHERE nama_kota = 'Kupang' LIMIT 1) AS d1),
  (SELECT id FROM (SELECT id FROM `penumpang` ORDER BY id LIMIT 1) AS pn1),
  f.flight_date,
  f.scheduled_time,
  '12A',
  (SELECT price FROM `ticket_prices` tp WHERE tp.maskapai_id = f.maskapai_id LIMIT 1)
FROM `flights` f
LIMIT 5;
