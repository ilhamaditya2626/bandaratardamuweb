-- =============================================================
-- Migrasi: kolom untuk laporan LLAU / DAU-01..06 (Kemenhub)
-- Target DB: tardamua1_airport (produksi)
--
-- HANYA MENAMBAH kolom (nullable / default 0). Tidak menghapus/
-- mengubah kolom atau data lama, sehingga web publish tetap jalan.
-- Kolom baru kosong (0) sampai diisi.
--
-- Aman dijalankan ulang bila memakai skrip pengecek (add-dau-columns.mjs);
-- bila dijalankan manual, jangan diulang (MySQL tak punya ADD COLUMN IF NOT EXISTS).
-- =============================================================

-- ---- passenger_stats: rincian penumpang + bagasi/kargo/pos ----
ALTER TABLE `passenger_stats`
  ADD COLUMN `pax_adult`          INT NOT NULL DEFAULT 0 COMMENT 'Dewasa (dihitung penumpang)',
  ADD COLUMN `pax_child`          INT NOT NULL DEFAULT 0 COMMENT 'Anak (dihitung penumpang)',
  ADD COLUMN `pax_infant`         INT NOT NULL DEFAULT 0 COMMENT 'Bayi (TIDAK dihitung penumpang, tetap tampil di PDF)',
  ADD COLUMN `pax_transit_adult`  INT NOT NULL DEFAULT 0 COMMENT 'Transit dewasa',
  ADD COLUMN `pax_transit_child`  INT NOT NULL DEFAULT 0 COMMENT 'Transit anak',
  ADD COLUMN `pax_transit_infant` INT NOT NULL DEFAULT 0 COMMENT 'Transit bayi',
  ADD COLUMN `baggage_kg`         INT NOT NULL DEFAULT 0 COMMENT 'Bagasi (kg)',
  ADD COLUMN `cargo_kg`           INT NOT NULL DEFAULT 0 COMMENT 'Kargo (kg)',
  ADD COLUMN `mail_kg`            INT NOT NULL DEFAULT 0 COMMENT 'Pos (kg)';

-- ---- flights: atribut pesawat untuk DAU ----
ALTER TABLE `flights`
  ADD COLUMN `seat_capacity` INT NOT NULL DEFAULT 12 COMMENT 'Kapasitas kursi',
  ADD COLUMN `aircraft_type` VARCHAR(30) NULL COMMENT 'Tipe pesawat, mis. C.208.B',
  ADD COLUMN `is_scheduled`  TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1=Berjadwal, 0=Tidak Berjadwal';
