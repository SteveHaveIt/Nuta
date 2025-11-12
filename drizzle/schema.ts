import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Nuta E-Commerce Platform - Complete Database Schema
 * Includes: Products, Orders, Customers, CRM, Marketing, Analytics, Payments
 */

// ===== USERS & AUTHENTICATION =====
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "affiliate"]).default("user").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ===== PRODUCTS =====
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  price: int("price").notNull(), // Price in KES (as cents)
  originalPrice: int("originalPrice"), // For discounts
  quantity: int("quantity").notNull().default(0),
  category: varchar("category", { length: 100 }),
  sku: varchar("sku", { length: 100 }).unique(),
  imageUrl: text("imageUrl"),
  images: json("images"), // Array of image URLs
  featured: boolean("featured").default(false),
  isActive: boolean("isActive").default(true),
  healthBenefits: text("healthBenefits"), // JSON array of benefits
  ingredients: text("ingredients"), // JSON array
  nutritionFacts: json("nutritionFacts"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ===== ORDERS =====
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  orderNumber: varchar("orderNumber", { length: 50 }).unique().notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["mpesa", "paypal", "card", "bank_transfer"]),
  totalAmount: int("totalAmount").notNull(),
  shippingCost: int("shippingCost").default(0),
  discountAmount: int("discountAmount").default(0),
  taxAmount: int("taxAmount").default(0),
  notes: text("notes"),
  shippingAddress: json("shippingAddress").notNull(),
  billingAddress: json("billingAddress"),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  estimatedDelivery: timestamp("estimatedDelivery"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ===== ORDER ITEMS =====
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: int("unitPrice").notNull(),
  totalPrice: int("totalPrice").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// ===== CUSTOMERS (CRM) =====
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").unique(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  segment: mysqlEnum("segment", ["vip", "regular", "inactive", "at_risk"]).default("regular"),
  totalOrders: int("totalOrders").default(0),
  totalSpent: int("totalSpent").default(0),
  lastOrderDate: timestamp("lastOrderDate"),
  preferredPaymentMethod: varchar("preferredPaymentMethod", { length: 50 }),
  notes: text("notes"),
  tags: json("tags"), // Array of tags
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// ===== CUSTOMER COMMUNICATION (CRM) =====
export const customerCommunications = mysqlTable("customerCommunications", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  type: mysqlEnum("type", ["email", "sms", "whatsapp", "call", "note"]).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  sentBy: varchar("sentBy", { length: 100 }), // admin, system, customer
  status: mysqlEnum("status", ["sent", "delivered", "read", "failed"]).default("sent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomerCommunication = typeof customerCommunications.$inferSelect;
export type InsertCustomerCommunication = typeof customerCommunications.$inferInsert;

// ===== LOYALTY POINTS =====
export const loyaltyPoints = mysqlTable("loyaltyPoints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalPoints: int("totalPoints").default(0).notNull(),
  availablePoints: int("availablePoints").default(0).notNull(),
  redeemedPoints: int("redeemedPoints").default(0).notNull(),
  expiredPoints: int("expiredPoints").default(0).notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoints = typeof loyaltyPoints.$inferInsert;

// ===== LOYALTY HISTORY =====
export const loyaltyHistory = mysqlTable("loyaltyHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderId: int("orderId"),
  pointsEarned: int("pointsEarned"),
  pointsRedeemed: int("pointsRedeemed"),
  pointsExpired: int("pointsExpired"),
  type: mysqlEnum("type", ["earned", "redeemed", "expired", "adjusted"]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyHistory = typeof loyaltyHistory.$inferSelect;
export type InsertLoyaltyHistory = typeof loyaltyHistory.$inferInsert;

// ===== SPIN WHEEL RECORDS =====
export const spinWheelRecords = mysqlTable("spinWheelRecords", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eligibilityTier: mysqlEnum("eligibilityTier", ["5_purchases", "10_purchases", "20_purchases", "30_purchases"]).notNull(),
  rewardAmount: int("rewardAmount").notNull(),
  isFestiveMode: boolean("isFestiveMode").default(false),
  festiveBonus: int("festiveBonus").default(0),
  finalAmount: int("finalAmount").notNull(),
  status: mysqlEnum("status", ["pending", "credited", "claimed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SpinWheelRecord = typeof spinWheelRecords.$inferSelect;
export type InsertSpinWheelRecord = typeof spinWheelRecords.$inferInsert;

// ===== AFFILIATES =====
export const affiliates = mysqlTable("affiliates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  referralCode: varchar("referralCode", { length: 50 }).unique().notNull(),
  status: mysqlEnum("status", ["pending", "approved", "suspended", "rejected"]).default("pending").notNull(),
  rank: mysqlEnum("rank", ["bronze", "silver", "gold", "platinum"]).default("bronze"),
  totalReferrals: int("totalReferrals").default(0),
  totalCommissions: int("totalCommissions").default(0),
  currentBalance: int("currentBalance").default(0),
  bankAccount: json("bankAccount"), // Bank details for payouts
  payoutEmail: varchar("payoutEmail", { length: 320 }),
  lastPayoutDate: timestamp("lastPayoutDate"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = typeof affiliates.$inferInsert;

// ===== AFFILIATE COMMISSIONS =====
export const affiliateCommissions = mysqlTable("affiliateCommissions", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  orderId: int("orderId").notNull(),
  referralCode: varchar("referralCode", { length: 50 }).notNull(),
  orderAmount: int("orderAmount").notNull(),
  commissionPercent: int("commissionPercent").notNull(),
  baseCommission: int("baseCommission").notNull(),
  rankBonus: int("rankBonus").default(0),
  totalCommission: int("totalCommission").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "paid", "cancelled"]).default("pending"),
  paidDate: timestamp("paidDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AffiliateCommission = typeof affiliateCommissions.$inferSelect;
export type InsertAffiliateCommission = typeof affiliateCommissions.$inferInsert;

// ===== SUPPORT TICKETS (CRM) =====
export const supportTickets = mysqlTable("supportTickets", {
  id: int("id").autoincrement().primaryKey(),
  ticketNumber: varchar("ticketNumber", { length: 50 }).unique().notNull(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["product", "order", "payment", "delivery", "return", "general"]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  status: mysqlEnum("status", ["open", "in_progress", "waiting_customer", "resolved", "closed"]).default("open"),
  assignedTo: int("assignedTo"), // Admin user ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

// ===== SUPPORT MESSAGES (CRM) =====
export const supportMessages = mysqlTable("supportMessages", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  senderType: mysqlEnum("senderType", ["customer", "admin", "system"]).notNull(),
  senderId: int("senderId"),
  message: text("message").notNull(),
  attachments: json("attachments"), // Array of attachment URLs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = typeof supportMessages.$inferInsert;

// ===== RETURNS & REFUNDS =====
export const returns = mysqlTable("returns", {
  id: int("id").autoincrement().primaryKey(),
  returnNumber: varchar("returnNumber", { length: 50 }).unique().notNull(),
  orderId: int("orderId").notNull(),
  userId: int("userId").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["requested", "approved", "shipped_back", "received", "refunded", "rejected"]).default("requested"),
  refundAmount: int("refundAmount"),
  refundStatus: mysqlEnum("refundStatus", ["pending", "processed", "completed", "failed"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Return = typeof returns.$inferSelect;
export type InsertReturn = typeof returns.$inferInsert;

// ===== GUEST ORDERS =====
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

// ===== ADDRESSES =====
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

// ===== SUBSCRIPTIONS =====
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  frequency: mysqlEnum("frequency", ["weekly", "biweekly", "monthly", "quarterly"]).notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled"]).default("active").notNull(),
  nextBillingDate: timestamp("nextBillingDate").notNull(),
  totalBillings: int("totalBillings").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ===== SUBSCRIPTION BILLINGS =====
export const subscriptionBillings = mysqlTable("subscriptionBillings", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId").notNull(),
  orderId: int("orderId"),
  amount: int("amount").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  billingDate: timestamp("billingDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubscriptionBilling = typeof subscriptionBillings.$inferSelect;
export type InsertSubscriptionBilling = typeof subscriptionBillings.$inferInsert;

// ===== MARKETING CAMPAIGNS =====
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["flash_sale", "seasonal", "email", "whatsapp", "affiliate_bonus", "giveaway"]).notNull(),
  description: text("description"),
  discountPercent: int("discountPercent"),
  discountAmount: int("discountAmount"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  status: mysqlEnum("status", ["draft", "active", "paused", "ended"]).default("draft"),
  targetAudience: json("targetAudience"), // Segments, tags, etc.
  products: json("products"), // Product IDs
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

// ===== COUPONS =====
export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  campaignId: int("campaignId"),
  discountType: mysqlEnum("discountType", ["percent", "fixed"]).notNull(),
  discountValue: int("discountValue").notNull(),
  maxUses: int("maxUses"),
  usedCount: int("usedCount").default(0),
  minOrderAmount: int("minOrderAmount"),
  validFrom: timestamp("validFrom").notNull(),
  validUntil: timestamp("validUntil").notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

// ===== ANALYTICS =====
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  totalOrders: int("totalOrders").default(0).notNull(),
  totalRevenue: int("totalRevenue").default(0).notNull(),
  totalCustomers: int("totalCustomers").default(0).notNull(),
  newCustomers: int("newCustomers").default(0),
  averageOrderValue: int("averageOrderValue").default(0).notNull(),
  pageViews: int("pageViews").default(0),
  uniqueVisitors: int("uniqueVisitors").default(0),
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }).default("0"),
  loyaltyPointsDistributed: int("loyaltyPointsDistributed").default(0).notNull(),
  affiliateCommissionsDistributed: int("affiliateCommissionsDistributed").default(0).notNull(),
  topProduct: int("topProduct"),
  topAffiliate: int("topAffiliate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// ===== CURRENCIES =====
export const currencies = mysqlTable("currencies", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(),
  symbol: varchar("symbol", { length: 5 }).notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  exchangeRateToKES: decimal("exchangeRateToKES", { precision: 10, scale: 4 }).notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Currency = typeof currencies.$inferSelect;
export type InsertCurrency = typeof currencies.$inferInsert;

// ===== PAYMENT TRANSACTIONS =====
export const paymentTransactions = mysqlTable("paymentTransactions", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  userId: int("userId"),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["mpesa", "paypal", "card", "bank_transfer"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  transactionId: varchar("transactionId", { length: 100 }).unique(),
  mpesaReference: varchar("mpesaReference", { length: 100 }),
  paypalTransactionId: varchar("paypalTransactionId", { length: 100 }),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;

// ===== BLOG POSTS =====
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  featuredImage: text("featuredImage"),
  author: varchar("author", { length: 100 }),
  category: varchar("category", { length: 100 }),
  tags: json("tags"),
  isPublished: boolean("isPublished").default(false),
  viewCount: int("viewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ===== ADMIN LOGS =====
export const adminLogs = mysqlTable("adminLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }),
  entityId: int("entityId"),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;

// ===== SETTINGS =====
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: text("value").notNull(),
  type: mysqlEnum("type", ["string", "number", "boolean", "json"]).default("string"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;
