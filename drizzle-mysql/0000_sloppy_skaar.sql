CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedback_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`message` text NOT NULL,
	`status` varchar(30) NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedback_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`flight_no` varchar(20) NOT NULL,
	`airline` varchar(100) NOT NULL,
	`airline_key` varchar(50),
	`origin` varchar(100),
	`destination` varchar(100),
	`type` varchar(20) NOT NULL,
	`flight_type` varchar(30) DEFAULT 'reguler',
	`scheduled_time` varchar(5) NOT NULL,
	`estimated_time` varchar(5),
	`sta` varchar(5),
	`eta` varchar(5),
	`std` varchar(5),
	`etd` varchar(5),
	`status` varchar(20) DEFAULT 'ontime',
	`status_label` varchar(30),
	`notes` text,
	`flight_date` date NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`image_url` text,
	`author` varchar(100) DEFAULT 'Redaksi Bandara',
	`slug` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `passenger_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`arrival_count` int NOT NULL DEFAULT 0,
	`departure_count` int NOT NULL DEFAULT 0,
	`category` varchar(20) NOT NULL DEFAULT 'domestic',
	`airline` varchar(100),
	`flight_type` varchar(20),
	`city` varchar(100),
	`passenger_count` int DEFAULT 0,
	`load_factor` decimal(8,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passenger_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `ticket_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`route_key` varchar(160) NOT NULL,
	`origin` varchar(100) NOT NULL,
	`destination` varchar(100) NOT NULL,
	`flight_type` varchar(20) NOT NULL DEFAULT 'reguler',
	`operating_days` json NOT NULL,
	`price` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticket_prices_id` PRIMARY KEY(`id`),
	CONSTRAINT `ticket_prices_route_type_unique` UNIQUE(`route_key`,`flight_type`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL,
	`image` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;