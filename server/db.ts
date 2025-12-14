import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  products,
  reviews,
  cartItems,
  orders,
  orderItems,
  promotions,
  subscribers,
  contactSubmissions,
  favorites,
  InsertProduct,
  InsertCategory,
  InsertReview,
  InsertCartItem,
  InsertOrder,
  InsertOrderItem,
  InsertPromotion,
  InsertSubscriber,
  InsertContactSubmission,
  InsertFavorite,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER MANAGEMENT =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== CATEGORY MANAGEMENT =====

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

// ===== PRODUCT MANAGEMENT =====

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .limit(6);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
    .orderBy(desc(products.createdAt));
}

// ===== REVIEW MANAGEMENT =====

export async function getApprovedReviewsByProduct(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt));
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reviews).values(review);
  return result;
}

// ===== CART MANAGEMENT =====

export async function getCartItems(userId?: number, sessionId?: string) {
  const db = await getDb();
  if (!db) return [];

  const condition = userId
    ? eq(cartItems.userId, userId)
    : sessionId
      ? eq(cartItems.sessionId, sessionId)
      : sql`1=0`;

  const items = await db
    .select({
      cartItem: cartItems,
      product: products,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(condition);

  return items;
}

export async function addToCart(item: InsertCartItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if item already exists in cart
  const condition = item.userId
    ? and(eq(cartItems.userId, item.userId), eq(cartItems.productId, item.productId))
    : and(eq(cartItems.sessionId, item.sessionId!), eq(cartItems.productId, item.productId));

  const existing = await db.select().from(cartItems).where(condition).limit(1);

  if (existing.length > 0) {
    // Update quantity
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + (item.quantity || 1) })
      .where(eq(cartItems.id, existing[0].id));
    return existing[0].id;
  } else {
    // Insert new item
    const result = await db.insert(cartItems).values(item);
    return result[0].insertId;
  }
}

export async function updateCartItemQuantity(itemId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
  }
}

export async function clearCart(userId?: number, sessionId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const condition = userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!);

  await db.delete(cartItems).where(condition);
}

// ===== ORDER MANAGEMENT =====

export async function createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId' | 'id' | 'createdAt'>[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const orderResult = await db.insert(orders).values(order);
  const orderId = orderResult[0].insertId;

  const itemsWithOrderId = items.map((item) => ({ ...item, orderId }));
  await db.insert(orderItems).values(itemsWithOrderId);

  return orderId;
}

export async function getOrdersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const orderData = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (orderData.length === 0) return undefined;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return {
    order: orderData[0],
    items,
  };
}

// ===== PROMOTION MANAGEMENT =====

export async function getActivePromotions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(promotions).where(eq(promotions.isActive, true));
}

export async function getPromotionByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(promotions).where(eq(promotions.code, code)).limit(1);
  return result[0];
}

// ===== NEWSLETTER MANAGEMENT =====

export async function addSubscriber(subscriber: InsertSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(subscribers).values(subscriber);
    return true;
  } catch (error) {
    // Email already exists
    return false;
  }
}

// ===== CONTACT FORM =====

export async function createContactSubmission(submission: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactSubmissions).values(submission);
  return result[0].insertId;
}

// ===== FAVORITES / WISHLIST =====

export async function toggleFavorite(
  productId: number,
  userId?: number,
  sessionId?: string
) {
  const db = await getDb();
  if (!db) return false;

  try {
    // Check if favorite already exists
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.productId, productId),
          userId ? eq(favorites.userId, userId) : eq(favorites.sessionId, sessionId!)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Remove favorite
      await db
        .delete(favorites)
        .where(eq(favorites.id, existing[0].id));
      return false; // Removed
    } else {
      // Add favorite
      await db.insert(favorites).values({
        productId,
        userId: userId || null,
        sessionId: sessionId || null,
      });
      return true; // Added
    }
  } catch (error) {
    console.error("[Database] Failed to toggle favorite:", error);
    throw error;
  }
}

export async function getFavoritesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user favorites:", error);
    return [];
  }
}

export async function getFavoritesBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(favorites)
      .where(eq(favorites.sessionId, sessionId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get session favorites:", error);
    return [];
  }
}

export async function isFavorite(
  productId: number,
  userId?: number,
  sessionId?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.productId, productId),
          userId ? eq(favorites.userId, userId) : eq(favorites.sessionId, sessionId!)
        )
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("[Database] Failed to check favorite:", error);
    return false;
  }
}
