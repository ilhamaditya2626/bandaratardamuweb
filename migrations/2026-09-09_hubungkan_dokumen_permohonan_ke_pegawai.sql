-- Migrasi: Menyambungkan information_requests dan public_documents
-- (tabel milik developer lain) ke pegawai.
-- CATATAN PENTING: tabel ini BUKAN bagian dari kode yang diaudit
-- (tidak ada di ZIP manapun yang pernah diberikan), jadi kolom yang
-- dipakai di sini didasarkan pada struktur yang terlihat di DBeaver
-- saja. SEBAIKNYA DIKOORDINASIKAN dulu dengan developer lain yang
-- mengelola tabel ini sebelum dijalankan ke server produksi.

ALTER TABLE `information_requests`
  ADD COLUMN `ditangani_oleh` INT NULL AFTER `admin_note`,
  ADD CONSTRAINT `information_requests_ditangani_oleh_fk` FOREIGN KEY (`ditangani_oleh`) REFERENCES `pegawai` (`id`);

ALTER TABLE `public_documents`
  ADD COLUMN `pegawai_id` INT NULL AFTER `is_published`,
  ADD CONSTRAINT `public_documents_pegawai_id_fk` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai` (`id`);
