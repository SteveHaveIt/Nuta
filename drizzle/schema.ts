import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Product categories
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products table
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").references(() => categories.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  price: int("price").notNull(), // Price in cents to avoid decimal issues
  compareAtPrice: int("compareAtPrice"), // Original price for showing discounts
  imageUrl: text("imageUrl").notNull(),
  images: text("images"), // JSON array of additional image URLs
  weight: varchar("weight", { length: 50 }), // e.g., "250g", "500g", "1kg"
  ingredients: text("ingredients"),
  nutritionalInfo: text("nutritionalInfo"), // JSON object
  stock: int("stock").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  tags: text("tags"), // JSON array of tags
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product reviews
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().references(() => products.id),
  userId: int("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  isApproved: boolean("isApproved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Shopping cart items
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  sessionId: varchar("sessionId", { length: 255 }), // For guest users
  productId: int("productId").notNull().references(() => products.id),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  totalAmount: int("totalAmount").notNull(), // In cents
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().references(() => orders.id),
  productId: int("productId").notNull().references(() => products.id),
  productName: varchar("productName", { length: 255 }).notNull(),
  productImage: text("productImage"),
  quantity: int("quantity").notNull(),
  price: int("price").notNull(), // Price at time of order, in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Promotions and spin wheel prizes
 */
export const promotions = mysqlTable("promotions", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["discount", "freebie", "spin_prize"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]),
  discountValue: int("discountValue"), // Percentage or cents
  code: varchar("code", { length: 50 }).unique(),
  isActive: boolean("isActive").default(true).notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  usageLimit: int("usageLimit"),
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = typeof promotions.$inferInsert;

/**
 * Newsletter subscribers
 */
export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

/**
 * Order tracking and shipment information
 */
export const orderTracking = mysqlTable("orderTracking", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().references(() => orders.id),
  trackingNumber: varchar("trackingNumber", { length: 100 }).notNull().unique(),
  carrier: varchar("carrier", { length: 100 }), // e.g., "DHL", "FedEx", "Local Courier"
  status: mysqlEnum("status", ["pending", "in_transit", "out_for_delivery", "delivered", "failed"]).default("pending").notNull(),
  estimatedDeliveryDate: timestamp("estimatedDeliveryDate"),
  actualDeliveryDate: timestamp("actualDeliveryDate"),
  lastUpdate: text("lastUpdate"), // Latest tracking update message
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OrderTracking = typeof orderTracking.$inferSelect;
export type InsertOrderTracking = typeof orderTracking.$inferInsert;

/**
 * Contact form submissions
 */
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * User favorites / wishlist
 */
export const favorites = mysqlTable(
  "favorites",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").references(() => users.id),
    productId: int("productId").notNull().references(() => products.id),
    sessionId: varchar("sessionId", { length: 255 }), // For guest users
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userProductIndex: index("idx_user_product").on(table.userId, table.productId),
    sessionProductIndex: index("idx_session_product").on(table.sessionId, table.productId),
  })
);

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;
