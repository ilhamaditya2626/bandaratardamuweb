-- =====================================================================
--  Tabel: penginapan (Akomodasi Penginapan)
--  Dialect: MySQL — jalankan di DBeaver pada database `airport_system`.
--  Berisi: CREATE TABLE + seed 3 data awal (identik dengan data statis lama).
-- =====================================================================

CREATE TABLE `penginapan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(50) NOT NULL,
	`name` varchar(150) NOT NULL,
	`description` text,
	`photos` json NOT NULL,
	`facilities` json NOT NULL,
	`price` int NOT NULL,
	`phone` varchar(30),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `penginapan_id` PRIMARY KEY(`id`)
);

-- ---------------------------------------------------------------------
--  Seed data (mereproduksi kartu akomodasi statis sebelumnya)
-- ---------------------------------------------------------------------

INSERT INTO `penginapan`
	(`category`, `name`, `description`, `photos`, `facilities`, `price`, `phone`, `is_active`)
VALUES
(
	'Terpopuler',
	'Hotel Raijua Permai',
	'Terletak strategis di pusat kota Seba, menawarkan fasilitas lengkap dengan akses mudah ke bandara dan pelabuhan.',
	JSON_ARRAY(
		'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2070&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop'
	),
	JSON_ARRAY('WiFi', 'AC', 'Resto'),
	450000,
	'081234567890',
	true
),
(
	'Beachfront',
	'Napae Beach Inn',
	'Penginapan nyaman tepat di bibir pantai, cocok untuk menikmati pemandangan matahari terbenam setiap hari.',
	JSON_ARRAY(
		'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=2070&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop'
	),
	JSON_ARRAY('Pantai', 'AC', 'Parkir'),
	350000,
	'081234567890',
	true
),
(
	'Budget Friendly',
	'Leba Homestay',
	'Suasana kekeluargaan yang kental dengan keramahan penduduk lokal, kamar bersih, dan lingkungan sangat tenang.',
	JSON_ARRAY(
		'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1974&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop'
	),
	JSON_ARRAY('Sarapan', 'Fan'),
	200000,
	'081234567890',
	true
);
