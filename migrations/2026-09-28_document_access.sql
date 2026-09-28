-- Jalankan sekali pada basis data yang sudah memiliki tabel public_documents.
-- Dokumen lama tetap bersifat umum agar perilaku sebelumnya tidak berubah secara tiba-tiba.
ALTER TABLE public_documents
  ADD COLUMN IF NOT EXISTS access_type VARCHAR(20) NOT NULL DEFAULT 'umum' AFTER is_published;

UPDATE public_documents
SET access_type = 'umum'
WHERE access_type IS NULL OR access_type = '';

-- Normalisasi kategori lama agar Surat Keluar Masuk dan Laporan BMN
-- tidak lagi tercatat sebagai subkategori Laporan Kinerja.
UPDATE public_documents
SET category = 'surat', subcategory = NULL
WHERE category = 'annual_report' AND subcategory = 'surat';

UPDATE public_documents
SET category = 'bmn', subcategory = NULL
WHERE category = 'annual_report' AND subcategory = 'bmn';
