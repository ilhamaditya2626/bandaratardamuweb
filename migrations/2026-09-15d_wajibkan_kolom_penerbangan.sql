-- Migrasi: Menjadikan maskapai_id, pilot_id, destinasi_id di tabel
-- `penerbangan` WAJIB diisi (NOT NULL), sesuai kardinalitas "wajib"
-- (tanda ‡) di ERD Chen yang di-ACC. Kolom penumpang_id TETAP boleh
-- kosong (opsional), sesuai gambar.

-- Langkah pengaman: isi dulu baris yang kebetulan masih kosong,
-- supaya perintah NOT NULL di bawah tidak gagal.
UPDATE `penerbangan` SET `maskapai_id` = (SELECT id FROM (SELECT id FROM `maskapai` LIMIT 1) AS m1) WHERE `maskapai_id` IS NULL;
UPDATE `penerbangan` SET `pilot_id` = (SELECT id FROM (SELECT id FROM `pilot` LIMIT 1) AS p1) WHERE `pilot_id` IS NULL;
UPDATE `penerbangan` SET `destinasi_id` = (SELECT id FROM (SELECT id FROM `destinasi` LIMIT 1) AS d1) WHERE `destinasi_id` IS NULL;

-- Kunci jadi wajib diisi.
ALTER TABLE `penerbangan`
  MODIFY COLUMN `maskapai_id` INT NOT NULL,
  MODIFY COLUMN `pilot_id` INT NOT NULL,
  MODIFY COLUMN `destinasi_id` INT NOT NULL;
