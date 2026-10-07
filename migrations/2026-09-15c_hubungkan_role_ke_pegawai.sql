-- Migrasi: Menyambungkan tabel ROLE ke PEGAWAI ("memiliki")
-- Ini perbaikan -- kolom ini terlewat waktu migrasi sebelumnya
-- (2026-09-15b), padahal relasi ini ada di ERD Chen yang di-ACC.

ALTER TABLE `pegawai`
  ADD COLUMN `role_id` INT NULL AFTER `divisi_id`,
  ADD CONSTRAINT `pegawai_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

-- Isi data: semua pegawai yang sudah ada dihubungkan ke role "Admin"
-- (karena pegawai yang tercatat di sistem ini memang staf internal).
UPDATE `pegawai` SET `role_id` = (SELECT id FROM (SELECT id FROM `role` WHERE nama_role = 'Admin' LIMIT 1) AS r1) WHERE `role_id` IS NULL;
