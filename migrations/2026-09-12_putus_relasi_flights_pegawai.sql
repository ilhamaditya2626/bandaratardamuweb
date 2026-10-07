-- Migrasi: Memutus relasi FLIGHTS -> PEGAWAI ("dicatat_oleh")
-- Sesuai arahan dosen pembimbing: relasi ini dibuat semata untuk
-- menyambungkan graf ERD, bukan mencerminkan proses bisnis nyata.
-- Dosen meminta relasi ini diputus.

ALTER TABLE `flights`
  DROP FOREIGN KEY `flights_dicatat_oleh_fk`,
  DROP COLUMN `dicatat_oleh`;
