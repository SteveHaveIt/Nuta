CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`postalCode` varchar(20),
	`country` varchar(100) NOT NULL,
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliateCommissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`orderId` int NOT NULL,
	`commissionAmount` int NOT NULL,
	`status` enum('pending','paid','cancelled') DEFAULT 'pending',
	`payoutDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliateCommissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`referralCode` varchar(50) NOT NULL,
	`totalEarnings` int NOT NULL DEFAULT 0,
	`monthlyEarnings` int NOT NULL DEFAULT 0,
	`rank` enum('Bronze','Silver','Gold','Platinum') DEFAULT 'Bronze',
	`status` enum('pending','approved','suspended') DEFAULT 'pending',
	`referralCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliates_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliates_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `affiliates_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `guestOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`orderPin` varchar(10) NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`status` enum('pending','verified','active','expired') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `guestOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `guestOrders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int,
	`pointsEarned` int NOT NULL DEFAULT 0,
	`pointsRedeemed` int NOT NULL DEFAULT 0,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyaltyHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyPoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`points` int NOT NULL DEFAULT 0,
	`redeemedPoints` int NOT NULL DEFAULT 0,
	`totalEarned` int NOT NULL DEFAULT 0,
	`lastUpdated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyaltyPoints_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyaltyPoints_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`price` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`orderNumber` varchar(50) NOT NULL,
	`status` enum('pending','confirmed','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`totalAmount` int NOT NULL,
	`paymentMethod` varchar(50),
	`paymentStatus` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`deliveryAddress` text,
	`guestPhone` varchar(20),
	`guestEmail` varchar(320),
	`guestPin` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 0,
	`category` varchar(100),
	`imageUrl` text,
	`featured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `returns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`userId` int,
	`returnNumber` varchar(50) NOT NULL,
	`reason` text,
	`status` enum('requested','approved','shipped','received','refunded','rejected') DEFAULT 'requested',
	`refundAmount` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `returns_id` PRIMARY KEY(`id`),
	CONSTRAINT `returns_returnNumber_unique` UNIQUE(`returnNumber`)
);
--> statement-breakpoint
CREATE TABLE `spinWheelRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`purchaseCount` int NOT NULL,
	`rewardAmount` int NOT NULL,
	`rewardStatus` enum('pending','credited','claimed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `spinWheelRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int,
	`message` text NOT NULL,
	`isAdmin` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supportMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`ticketNumber` varchar(50) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text,
	`status` enum('open','in-progress','resolved','closed') DEFAULT 'open',
	`priority` enum('low','medium','high','urgent') DEFAULT 'medium',
	`guestEmail` varchar(320),
	`guestPhone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `supportTickets_ticketNumber_unique` UNIQUE(`ticketNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);