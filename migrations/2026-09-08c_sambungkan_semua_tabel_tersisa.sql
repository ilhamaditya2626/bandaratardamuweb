-- Migrasi: Menyambungkan SEMUA tabel yang masih berdiri sendiri
-- Tujuan: tidak ada satupun tabel yang terputus dari tabel lain (ERD 100% tersambung).
-- Kolom teks lama (airline) TIDAK dihapus, supaya integrasi SIMTAR
-- (/api/penerbangan) yang menulis nilai airline sebagai teks bebas
-- tetap berjalan normal. Kolom baru semuanya NULLABLE.

ALTER TABLE `flights`
  ADD COLUMN `maskapai_id` INT NULL AFTER `airline`,
  ADD CONSTRAINT `flights_maskapai_id_fk` FOREIGN KEY (`maskapai_id`) REFERENCES `maskapai` (`id`);

ALTER TABLE `ticket_prices`
  ADD COLUMN `maskapai_id` INT NULL AFTER `flight_type`,
  ADD CONSTRAINT `ticket_prices_maskapai_id_fk` FOREIGN KEY (`maskapai_id`) REFERENCES `maskapai` (`id`);

ALTER TABLE `passenger_stats`
  ADD COLUMN `maskapai_id` INT NULL AFTER `airline`,
  ADD CONSTRAINT `passenger_stats_maskapai_id_fk` FOREIGN KEY (`maskapai_id`) REFERENCES `maskapai` (`id`);

ALTER TABLE `urgent_information`
  ADD COLUMN `pegawai_id` INT NULL AFTER `attachment_url`,
  ADD CONSTRAINT `urgent_information_pegawai_id_fk` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai` (`id`);

ALTER TABLE `verification`
  ADD COLUMN `user_id` VARCHAR(255) NULL AFTER `expires_at`,
  ADD CONSTRAINT `verification_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

-- Isi contoh supaya relasi terlihat terisi (Susi Air satu-satunya maskapai
-- di sistem, jadi semua baris flights/ticket_prices/passenger_stats yang
-- sudah ada dihubungkan ke situ).
UPDATE `flights` SET `maskapai_id` = (SELECT id FROM (SELECT id FROM `maskapai` LIMIT 1) AS m1) WHERE `maskapai_id` IS NULL;
UPDATE `ticket_prices` SET `maskapai_id` = (SELECT id FROM (SELECT id FROM `maskapai` LIMIT 1) AS m2) WHERE `maskapai_id` IS NULL;
UPDATE `passenger_stats` SET `maskapai_id` = (SELECT id FROM (SELECT id FROM `maskapai` LIMIT 1) AS m3) WHERE `maskapai_id` IS NULL;
UPDATE `urgent_information` SET `pegawai_id` = (SELECT id FROM (SELECT id FROM `pegawai` ORDER BY id LIMIT 1) AS p1) WHERE `pegawai_id` IS NULL;
-- verification.user_id sengaja TIDAK diisi contoh — token verifikasi
-- bersifat sementara/kadaluarsa, NULL mencerminkan tidak ada proses
-- verifikasi yang sedang berjalan saat ini (keadaan nyata sistem).
