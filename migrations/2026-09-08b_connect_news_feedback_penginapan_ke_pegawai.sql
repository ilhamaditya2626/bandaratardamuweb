-- Migrasi: Menyambungkan news, feedback_submissions, penginapan ke pegawai
-- Tujuan: agar seluruh 15 tabel tersambung dalam satu ERD (relational model),
-- sesuai arahan dosen pembimbing dan pola pada skripsi acuan.
-- Kolom lama (author, dst) TIDAK dihapus, supaya kode yang sudah berjalan
-- tidak rusak. Kolom baru bersifat NULLABLE.

ALTER TABLE `news`
  ADD COLUMN `pegawai_id` INT NULL AFTER `author`,
  ADD CONSTRAINT `news_pegawai_id_fk` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai` (`id`);

ALTER TABLE `feedback_submissions`
  ADD COLUMN `ditangani_oleh` INT NULL AFTER `status`,
  ADD CONSTRAINT `feedback_ditangani_oleh_fk` FOREIGN KEY (`ditangani_oleh`) REFERENCES `pegawai` (`id`);

ALTER TABLE `penginapan`
  ADD COLUMN `dikelola_oleh` INT NULL AFTER `is_active`,
  ADD CONSTRAINT `penginapan_dikelola_oleh_fk` FOREIGN KEY (`dikelola_oleh`) REFERENCES `pegawai` (`id`);

-- Isi contoh (opsional) supaya relasi terlihat terisi, bukan kosong semua.
-- Menghubungkan berita/kritik-saran/penginapan yang sudah ada ke pejabat
-- pertama di tabel pegawai (David Benjamin Messakh, Kepala Kantor).
UPDATE `news` SET `pegawai_id` = (SELECT id FROM (SELECT id FROM `pegawai` ORDER BY id LIMIT 1) AS p1) WHERE `pegawai_id` IS NULL;
UPDATE `penginapan` SET `dikelola_oleh` = (SELECT id FROM (SELECT id FROM `pegawai` ORDER BY id LIMIT 1) AS p2) WHERE `dikelola_oleh` IS NULL;
-- feedback_submissions sengaja TIDAK diisi contoh — secara bisnis proses,
-- kritik/saran baru "ditangani_oleh" seseorang setelah ada tindak lanjut,
-- jadi NULL di sini justru mencerminkan keadaan nyata (belum ditugaskan).
