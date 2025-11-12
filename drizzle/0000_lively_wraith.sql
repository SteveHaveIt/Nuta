CREATE TABLE `adminLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50),
	`entityId` int,
	`details` json,
	`ipAddress` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` varchar(500),
	`featuredImage` text,
	`author` varchar(100),
	`category` varchar(100),
	`tags` json,
	`isPublished` boolean DEFAULT false,
	`viewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('flash_sale','seasonal','email','whatsapp','affiliate_bonus','giveaway') NOT NULL,
	`description` text,
	`discountPercent` int,
	`discountAmount` int,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`status` enum('draft','active','paused','ended') DEFAULT 'draft',
	`targetAudience` json,
	`products` json,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`campaignId` int,
	`discountType` enum('percent','fixed') NOT NULL,
	`discountValue` int NOT NULL,
	`maxUses` int,
	`usedCount` int DEFAULT 0,
	`minOrderAmount` int,
	`validFrom` timestamp NOT NULL,
	`validUntil` timestamp NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `customerCommunications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`type` enum('email','sms','whatsapp','call','note') NOT NULL,
	`subject` varchar(255),
	`message` text NOT NULL,
	`sentBy` varchar(100),
	`status` enum('sent','delivered','read','failed') DEFAULT 'sent',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customerCommunications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100),
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`segment` enum('vip','regular','inactive','at_risk') DEFAULT 'regular',
	`totalOrders` int DEFAULT 0,
	`totalSpent` int DEFAULT 0,
	`lastOrderDate` timestamp,
	`preferredPaymentMethod` varchar(50),
	`notes` text,
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `customers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `paymentTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`userId` int,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL,
	`paymentMethod` enum('mpesa','paypal','card','bank_transfer') NOT NULL,
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`transactionId` varchar(100),
	`mpesaReference` varchar(100),
	`paypalTransactionId` varchar(100),
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paymentTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `paymentTransactions_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`type` enum('string','number','boolean','json') DEFAULT 'string',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `affiliateCommissions` MODIFY COLUMN `status` enum('pending','approved','paid','cancelled') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `affiliates` MODIFY COLUMN `rank` enum('bronze','silver','gold','platinum') DEFAULT 'bronze';--> statement-breakpoint
ALTER TABLE `affiliates` MODIFY COLUMN `status` enum('pending','approved','suspended','rejected') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `currencies` MODIFY COLUMN `exchangeRateToKES` decimal(10,4) NOT NULL;--> statement-breakpoint
ALTER TABLE `loyaltyHistory` MODIFY COLUMN `pointsEarned` int;--> statement-breakpoint
ALTER TABLE `loyaltyHistory` MODIFY COLUMN `pointsRedeemed` int;--> statement-breakpoint
ALTER TABLE `loyaltyPoints` MODIFY COLUMN `lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `paymentMethod` enum('mpesa','paypal','card','bank_transfer');--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `paymentStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `returns` MODIFY COLUMN `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `returns` MODIFY COLUMN `reason` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `returns` MODIFY COLUMN `status` enum('requested','approved','shipped_back','received','refunded','rejected') DEFAULT 'requested';--> statement-breakpoint
ALTER TABLE `supportTickets` MODIFY COLUMN `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `supportTickets` MODIFY COLUMN `status` enum('open','in_progress','waiting_customer','resolved','closed') DEFAULT 'open';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','affiliate') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `affiliateCommissions` ADD `referralCode` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliateCommissions` ADD `orderAmount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliateCommissions` ADD `commissionPercent` int NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliateCommissions` ADD `baseCommission` int NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliateCommissions` ADD `rankBonus` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `affiliateCommissions` ADD `totalCommission` int NOT NULL;--> statement-breakpoint
ALTER TABLE `affiliateCommissions` ADD `paidDate` timestamp;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `totalReferrals` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `totalCommissions` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `currentBalance` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `bankAccount` json;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `payoutEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `affiliates` ADD `lastPayoutDate` timestamp;--> statement-breakpoint
ALTER TABLE `affiliates` ADD `approvedAt` timestamp;--> statement-breakpoint
ALTER TABLE `analytics` ADD `newCustomers` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `analytics` ADD `pageViews` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `analytics` ADD `uniqueVisitors` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `analytics` ADD `conversionRate` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `analytics` ADD `topProduct` int;--> statement-breakpoint
ALTER TABLE `analytics` ADD `topAffiliate` int;--> statement-breakpoint
ALTER TABLE `loyaltyHistory` ADD `pointsExpired` int;--> statement-breakpoint
ALTER TABLE `loyaltyHistory` ADD `type` enum('earned','redeemed','expired','adjusted') NOT NULL;--> statement-breakpoint
ALTER TABLE `loyaltyPoints` ADD `totalPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `loyaltyPoints` ADD `availablePoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `loyaltyPoints` ADD `expiredPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orderItems` ADD `unitPrice` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orderItems` ADD `totalPrice` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingCost` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `orders` ADD `discountAmount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `orders` ADD `taxAmount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `orders` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingAddress` json NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `billingAddress` json;--> statement-breakpoint
ALTER TABLE `orders` ADD `trackingNumber` varchar(100);--> statement-breakpoint
ALTER TABLE `orders` ADD `estimatedDelivery` timestamp;--> statement-breakpoint
ALTER TABLE `products` ADD `shortDescription` varchar(500);--> statement-breakpoint
ALTER TABLE `products` ADD `originalPrice` int;--> statement-breakpoint
ALTER TABLE `products` ADD `sku` varchar(100);--> statement-breakpoint
ALTER TABLE `products` ADD `images` json;--> statement-breakpoint
ALTER TABLE `products` ADD `isActive` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `products` ADD `healthBenefits` text;--> statement-breakpoint
ALTER TABLE `products` ADD `ingredients` text;--> statement-breakpoint
ALTER TABLE `products` ADD `nutritionFacts` json;--> statement-breakpoint
ALTER TABLE `returns` ADD `description` text;--> statement-breakpoint
ALTER TABLE `returns` ADD `refundStatus` enum('pending','processed','completed','failed');--> statement-breakpoint
ALTER TABLE `spinWheelRecords` ADD `eligibilityTier` enum('5_purchases','10_purchases','20_purchases','30_purchases') NOT NULL;--> statement-breakpoint
ALTER TABLE `spinWheelRecords` ADD `isFestiveMode` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `spinWheelRecords` ADD `festiveBonus` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `spinWheelRecords` ADD `finalAmount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `spinWheelRecords` ADD `status` enum('pending','credited','claimed') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `supportMessages` ADD `senderType` enum('customer','admin','system') NOT NULL;--> statement-breakpoint
ALTER TABLE `supportMessages` ADD `senderId` int;--> statement-breakpoint
ALTER TABLE `supportMessages` ADD `attachments` json;--> statement-breakpoint
ALTER TABLE `supportTickets` ADD `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `supportTickets` ADD `category` enum('product','order','payment','delivery','return','general') NOT NULL;--> statement-breakpoint
ALTER TABLE `supportTickets` ADD `assignedTo` int;--> statement-breakpoint
ALTER TABLE `supportTickets` ADD `resolvedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_sku_unique` UNIQUE(`sku`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `affiliateCommissions` DROP COLUMN `commissionAmount`;--> statement-breakpoint
ALTER TABLE `affiliateCommissions` DROP COLUMN `payoutDate`;--> statement-breakpoint
ALTER TABLE `affiliates` DROP COLUMN `totalEarnings`;--> statement-breakpoint
ALTER TABLE `affiliates` DROP COLUMN `monthlyEarnings`;--> statement-breakpoint
ALTER TABLE `affiliates` DROP COLUMN `referralCount`;--> statement-breakpoint
ALTER TABLE `loyaltyPoints` DROP COLUMN `points`;--> statement-breakpoint
ALTER TABLE `loyaltyPoints` DROP COLUMN `totalEarned`;--> statement-breakpoint
ALTER TABLE `orderItems` DROP COLUMN `price`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `deliveryAddress`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `guestPhone`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `guestEmail`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `guestPin`;--> statement-breakpoint
ALTER TABLE `spinWheelRecords` DROP COLUMN `purchaseCount`;--> statement-breakpoint
ALTER TABLE `spinWheelRecords` DROP COLUMN `rewardStatus`;--> statement-breakpoint
ALTER TABLE `supportMessages` DROP COLUMN `userId`;--> statement-breakpoint
ALTER TABLE `supportMessages` DROP COLUMN `isAdmin`;--> statement-breakpoint
ALTER TABLE `supportTickets` DROP COLUMN `guestEmail`;--> statement-breakpoint
ALTER TABLE `supportTickets` DROP COLUMN `guestPhone`;