import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Products Table
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Price in KES (as cents to avoid decimals)
  quantity: int("quantity").notNull().default(0),
  category: varchar("category", { length: 100 }),
  imageUrl: text("imageUrl"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Orders Table
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"]).default("pending").notNull(),
  totalAmount: int("totalAmount").notNull(), // In KES (cents)
  paymentMethod: varchar("paymentMethod", { length: 50 }), // mpesa, paypal
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending"),
  deliveryAddress: text("deliveryAddress"),
  guestPhone: varchar("guestPhone", { length: 20 }),
  guestEmail: varchar("guestEmail", { length: 320 }),
  guestPin: varchar("guestPin", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order Items Table
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  price: int("price").notNull(), // Price at time of order (in cents)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// Loyalty Points Table
export const loyaltyPoints = mysqlTable("loyaltyPoints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  points: int("points").notNull().default(0),
  redeemedPoints: int("redeemedPoints").notNull().default(0),
  totalEarned: int("totalEarned").notNull().default(0),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoints = typeof loyaltyPoints.$inferInsert;

// Loyalty History Table
export const loyaltyHistory = mysqlTable("loyaltyHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderId: int("orderId"),
  pointsEarned: int("pointsEarned").notNull().default(0),
  pointsRedeemed: int("pointsRedeemed").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyHistory = typeof loyaltyHistory.$inferSelect;
export type InsertLoyaltyHistory = typeof loyaltyHistory.$inferInsert;

// Spin Wheel Records Table
export const spinWheelRecords = mysqlTable("spinWheelRecords", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  purchaseCount: int("purchaseCount").notNull(),
  rewardAmount: int("rewardAmount").notNull(), // In KES (cents)
  rewardStatus: mysqlEnum("rewardStatus", ["pending", "credited", "claimed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SpinWheelRecord = typeof spinWheelRecords.$inferSelect;
export type InsertSpinWheelRecord = typeof spinWheelRecords.$inferInsert;

// Affiliates Table
export const affiliates = mysqlTable("affiliates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  referralCode: varchar("referralCode", { length: 50 }).notNull().unique(),
  totalEarnings: int("totalEarnings").notNull().default(0), // In KES (cents)
  monthlyEarnings: int("monthlyEarnings").notNull().default(0),
  rank: mysqlEnum("rank", ["Bronze", "Silver", "Gold", "Platinum"]).default("Bronze"),
  status: mysqlEnum("status", ["pending", "approved", "suspended"]).default("pending"),
  referralCount: int("referralCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = typeof affiliates.$inferInsert;

// Affiliate Commissions Table
export const affiliateCommissions = mysqlTable("affiliateCommissions", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  orderId: int("orderId").notNull(),
  commissionAmount: int("commissionAmount").notNull(), // In KES (cents)
  status: mysqlEnum("status", ["pending", "paid", "cancelled"]).default("pending"),
  payoutDate: timestamp("payoutDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AffiliateCommission = typeof affiliateCommissions.$inferSelect;
export type InsertAffiliateCommission = typeof affiliateCommissions.$inferInsert;

// Support Tickets Table
export const supportTickets = mysqlTable("supportTickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  ticketNumber: varchar("ticketNumber", { length: 50 }).notNull().unique(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["open", "in-progress", "resolved", "closed"]).default("open"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  guestEmail: varchar("guestEmail", { length: 320 }),
  guestPhone: varchar("guestPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

// Support Messages Table
export const supportMessages = mysqlTable("supportMessages", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId"),
  message: text("message").notNull(),
  isAdmin: boolean("isAdmin").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = typeof supportMessages.$inferInsert;

// Returns Table
export const returns = mysqlTable("returns", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  userId: int("userId"),
  returnNumber: varchar("returnNumber", { length: 50 }).notNull().unique(),
  reason: text("reason"),
  status: mysqlEnum("status", ["requested", "approved", "shipped", "received", "refunded", "rejected"]).default("requested"),
  refundAmount: int("refundAmount"), // In KES (cents)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Return = typeof returns.$inferSelect;
export type InsertReturn = typeof returns.$inferInsert;

// Guest Orders Table
export const guestOrders = mysqlTable("guestOrders", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  orderPin: varchar("orderPin", { length: 10 }).notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "verified", "active", "expired"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type GuestOrder = typeof guestOrders.$inferSelect;
export type InsertGuestOrder = typeof guestOrders.$inferInsert;

// Addresses Table
export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postalCode", { length: 20 }),
  country: varchar("country", { length: 100 }).notNull(),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;