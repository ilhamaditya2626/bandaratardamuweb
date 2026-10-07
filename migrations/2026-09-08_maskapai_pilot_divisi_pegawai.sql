-- Migrasi: Menambah tabel Maskapai, Pilot, Divisi, Pegawai
-- Tujuan: menyambungkan ERD sesuai arahan dosen pembimbing, dengan tetap
-- mencerminkan struktur data yang benar-benar dipakai program.
-- CATATAN: flights.airline TIDAK diubah menjadi FK ke maskapai.id, supaya
-- tidak mengganggu integrasi SIMTAR (/api/penerbangan) yang sudah berjalan
-- dan menulis nilai airline sebagai teks bebas.

CREATE TABLE IF NOT EXISTS `maskapai` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `kode` VARCHAR(10) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `pilot` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `nomor_lisensi` VARCHAR(50) NULL,
  `maskapai_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `pilot_maskapai_id_idx` (`maskapai_id`),
  CONSTRAINT `pilot_maskapai_id_fk` FOREIGN KEY (`maskapai_id`) REFERENCES `maskapai` (`id`)
);

CREATE TABLE IF NOT EXISTS `divisi` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `pegawai` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(150) NOT NULL,
  `jabatan` VARCHAR(150) NULL,
  `pendidikan_terakhir` VARCHAR(50) NULL,
  `divisi_id` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `pegawai_divisi_id_idx` (`divisi_id`),
  CONSTRAINT `pegawai_divisi_id_fk` FOREIGN KEY (`divisi_id`) REFERENCES `divisi` (`id`)
);

-- Data awal (seed) berdasarkan konten yang SUDAH ADA di kode sebelumnya:
-- src/app/(flight)/unit-kerja/page.tsx (workUnits) untuk Divisi,
-- src/app/(flight)/informasi-berkala/page.tsx (officials) untuk Pegawai.
-- Maskapai "Susi Air" adalah maskapai nyata yang melayani bandara ini.
-- Data Pilot bersifat CONTOH karena tidak ada data pilot sungguhan di manapun.

INSERT INTO `maskapai` (`nama`, `kode`) VALUES
  ('Susi Air', 'SI');

INSERT INTO `pilot` (`nama`, `nomor_lisensi`, `maskapai_id`) VALUES
  ('Contoh Pilot Satu', 'CTH-001', (SELECT id FROM (SELECT id FROM `maskapai` WHERE nama = 'Susi Air') AS m)),
  ('Contoh Pilot Dua', 'CTH-002', (SELECT id FROM (SELECT id FROM `maskapai` WHERE nama = 'Susi Air') AS m));

INSERT INTO `divisi` (`nama`, `deskripsi`) VALUES
  ('Unit Administrasi', 'Tata usaha, kepegawaian, arsip, pelaporan, dan dukungan logistik.'),
  ('Unit AVSEC', 'Keamanan penerbangan, pemeriksaan penumpang dan barang, pengawasan area terminal.'),
  ('Unit PKP-PK', 'Kesiapsiagaan pertolongan kecelakaan penerbangan dan pemadam kebakaran.'),
  ('Unit Bangunan dan Landasan', 'Pemeliharaan bangunan, lahan, dan fasilitas fisik bandara.'),
  ('Unit Listrik', 'Pemeliharaan kelistrikan bandara.'),
  ('Unit Elektronika Bandara', 'Pemeliharaan peralatan elektronika bandara.'),
  ('Unit Alat-Alat Berat', 'Pemeliharaan alat berat operasional bandara.'),
  ('Unit Sanitasi', 'Kebersihan dan sanitasi lingkungan bandara.');

INSERT INTO `pegawai` (`nama`, `jabatan`, `divisi_id`) VALUES
  ('David Benjamin Messakh, S.H.', 'Kepala Kantor UPBU Tardamu', NULL),
  ('Gusti Ngurah Budiarta, S.H.', 'Kepala Tata Usaha', (SELECT id FROM (SELECT id FROM `divisi` WHERE nama = 'Unit Administrasi') AS d1)),
  ('Jefri Adji, S.I.P', 'Kepala TOKPD', (SELECT id FROM (SELECT id FROM `divisi` WHERE nama = 'Unit AVSEC') AS d2));
