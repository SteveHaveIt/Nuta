CREATE TABLE `orderTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`trackingNumber` varchar(100) NOT NULL,
	`carrier` varchar(100),
	`status` enum('pending','in_transit','out_for_delivery','delivered','failed') NOT NULL DEFAULT 'pending',
	`estimatedDeliveryDate` timestamp,
	`actualDeliveryDate` timestamp,
	`lastUpdate` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orderTracking_id` PRIMARY KEY(`id`),
	CONSTRAINT `orderTracking_trackingNumber_unique` UNIQUE(`trackingNumber`)
);
--> statement-breakpoint
ALTER TABLE `orderTracking` ADD CONSTRAINT `orderTracking_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;