-- Migrasi: Menjembatani 3 kelompok tabel yang sebelumnya terpisah
-- (kelompok USER, kelompok MASKAPAI, kelompok PEGAWAI) menjadi SATU
-- graf tersambung penuh, sesuai arahan dosen pembimbing.

ALTER TABLE `user`
  ADD COLUMN `pegawai_id` INT NULL AFTER `image`,
  ADD CONSTRAINT `user_pegawai_id_fk` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai` (`id`);

ALTER TABLE `flights`
  ADD COLUMN `dicatat_oleh` INT NULL AFTER `maskapai_id`,
  ADD CONSTRAINT `flights_dicatat_oleh_fk` FOREIGN KEY (`dicatat_oleh`) REFERENCES `pegawai` (`id`);

-- Isi contoh: hubungkan akun admin yang sudah ada ke pejabat pertama
-- (David Benjamin Messakh, Kepala Kantor), dan seluruh jadwal penerbangan
-- yang sudah ada dianggap dicatat oleh pejabat yang sama untuk saat ini.
UPDATE `user` SET `pegawai_id` = (SELECT id FROM (SELECT id FROM `pegawai` ORDER BY id LIMIT 1) AS p1) WHERE `pegawai_id` IS NULL;
UPDATE `flights` SET `dicatat_oleh` = (SELECT id FROM (SELECT id FROM `pegawai` ORDER BY id LIMIT 1) AS p2) WHERE `dicatat_oleh` IS NULL;
