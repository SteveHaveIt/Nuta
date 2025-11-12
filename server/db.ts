import { eq, and, desc, asc, like, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, products, orders, orderItems, loyaltyPoints, loyaltyHistory,
  affiliates, affiliateCommissions, supportTickets, supportMessages, returns,
  spinWheelRecords, guestOrders, addresses, subscriptions, subscriptionBillings,
  analytics, currencies, InsertProduct, InsertOrder, InsertOrderItem,
  InsertLoyaltyPoints, InsertAffiliate, InsertSupportTicket, InsertAddress,
  InsertSubscription, InsertSubscriptionBilling, InsertAnalytics, InsertCurrency
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
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
      values.role = 'admin';
      updateSet.role = 'admin';
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

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== PRODUCTS =====
export async function getProducts(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).limit(limit).offset(offset).orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.category, category));
}

export async function searchProducts(query: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(like(products.name, `%${query}%`));
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(product);
  return result;
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(updates).where(eq(products.id, id));
}

// ===== ORDERS =====
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
}

export async function updateOrderPaymentStatus(orderId: number, paymentStatus: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(orders).set({ paymentStatus: paymentStatus as any }).where(eq(orders.id, orderId));
}

// ===== ORDER ITEMS =====
export async function addOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(orderItems).values(item);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// ===== LOYALTY POINTS =====
export async function getLoyaltyPoints(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLoyaltyPoints(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(loyaltyPoints).values({ userId, points: 0, redeemedPoints: 0, totalEarned: 0 });
}

export async function addLoyaltyPoints(userId: number, pointsToAdd: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const current = await getLoyaltyPoints(userId);
  if (!current) {
    await createLoyaltyPoints(userId);
  }
  
  return db.update(loyaltyPoints)
    .set({ 
      points: (current?.points || 0) + pointsToAdd,
      totalEarned: (current?.totalEarned || 0) + pointsToAdd
    })
    .where(eq(loyaltyPoints.userId, userId));
}

export async function redeemLoyaltyPoints(userId: number, pointsToRedeem: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const current = await getLoyaltyPoints(userId);
  if (!current || current.points < pointsToRedeem) {
    throw new Error("Insufficient loyalty points");
  }
  
  return db.update(loyaltyPoints)
    .set({ 
      points: current.points - pointsToRedeem,
      redeemedPoints: current.redeemedPoints + pointsToRedeem
    })
    .where(eq(loyaltyPoints.userId, userId));
}

export async function addLoyaltyHistory(userId: number, orderId: number | undefined, pointsEarned: number, description: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(loyaltyHistory).values({ userId, orderId, pointsEarned, description });
}

// ===== SPIN WHEEL =====
export async function createSpinWheelRecord(userId: number, purchaseCount: number, rewardAmount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(spinWheelRecords).values({ userId, purchaseCount, rewardAmount });
}

export async function getUserSpinWheelRecords(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(spinWheelRecords).where(eq(spinWheelRecords.userId, userId));
}

// ===== AFFILIATES =====
export async function createAffiliate(affiliate: InsertAffiliate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(affiliates).values(affiliate);
}

export async function getAffiliateByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliates).where(eq(affiliates.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAffiliateByReferralCode(referralCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliates).where(eq(affiliates.referralCode, referralCode)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAffiliateEarnings(affiliateId: number, commissionAmount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const affiliate = await db.select().from(affiliates).where(eq(affiliates.id, affiliateId)).limit(1);
  if (!affiliate.length) throw new Error("Affiliate not found");
  
  return db.update(affiliates)
    .set({
      totalEarnings: affiliate[0].totalEarnings + commissionAmount,
      monthlyEarnings: affiliate[0].monthlyEarnings + commissionAmount
    })
    .where(eq(affiliates.id, affiliateId));
}

export async function getAffiliateCommissions(affiliateId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateCommissions).where(eq(affiliateCommissions.affiliateId, affiliateId));
}

export async function createAffiliateCommission(affiliateId: number, orderId: number, commissionAmount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(affiliateCommissions).values({ affiliateId, orderId, commissionAmount });
}

// ===== SUPPORT TICKETS =====
export async function createSupportTicket(ticket: InsertSupportTicket) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(supportTickets).values(ticket);
}

export async function getSupportTicketById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSupportTickets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
}

export async function getAllSupportTickets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
}

export async function updateTicketStatus(ticketId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(supportTickets).set({ status: status as any }).where(eq(supportTickets.id, ticketId));
}

export async function addSupportMessage(ticketId: number, userId: number | undefined, message: string, isAdmin: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(supportMessages).values({ ticketId, userId, message, isAdmin });
}

export async function getSupportMessages(ticketId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(supportMessages).where(eq(supportMessages.ticketId, ticketId)).orderBy(asc(supportMessages.createdAt));
}

// ===== RETURNS =====
export async function createReturn(orderId: number, userId: number | undefined, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const returnNumber = `RET-${Date.now()}`;
  return db.insert(returns).values({ orderId, userId, returnNumber, reason });
}

export async function getReturnsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(returns).where(eq(returns.userId, userId));
}

export async function updateReturnStatus(returnId: number, status: string, refundAmount?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updates: any = { status };
  if (refundAmount !== undefined) updates.refundAmount = refundAmount;
  return db.update(returns).set(updates).where(eq(returns.id, returnId));
}

// ===== GUEST ORDERS =====
export async function createGuestOrder(phone: string, email: string, orderPin: string, orderNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  return db.insert(guestOrders).values({ phone, email, orderPin, orderNumber, expiresAt });
}

export async function getGuestOrderByPin(orderPin: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(guestOrders).where(eq(guestOrders.orderPin, orderPin)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== ADDRESSES =====
export async function createAddress(address: InsertAddress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(addresses).values(address);
}

export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(addresses).where(eq(addresses.userId, userId));
}

export async function getDefaultAddress(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(addresses).where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAddress(addressId: number, updates: Partial<typeof addresses.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(addresses).set(updates).where(eq(addresses.id, addressId));
}


// ===== SUBSCRIPTION HELPERS =====
export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(subscriptions).values(data);
  return result;
}

export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
}

export async function getSubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSubscription(subscriptionId: number, updates: Partial<typeof subscriptions.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(subscriptions).set(updates).where(eq(subscriptions.id, subscriptionId));
}

export async function getActiveSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.status, "active"));
}

export async function createSubscriptionBilling(data: InsertSubscriptionBilling) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(subscriptionBillings).values(data);
}

export async function getSubscriptionBillings(subscriptionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptionBillings).where(eq(subscriptionBillings.subscriptionId, subscriptionId));
}

// ===== ANALYTICS HELPERS =====
export async function recordAnalytics(data: InsertAnalytics) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(analytics).values(data);
}

export async function getAnalyticsByDate(date: Date) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(analytics).where(eq(analytics.date, date)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAnalyticsRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(analytics).where(and(gte(analytics.date, startDate), lte(analytics.date, endDate))).orderBy(asc(analytics.date));
}

export async function updateAnalytics(analyticsId: number, updates: Partial<typeof analytics.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(analytics).set(updates).where(eq(analytics.id, analyticsId));
}

// ===== CURRENCY HELPERS =====
export async function createCurrency(data: InsertCurrency) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(currencies).values(data);
}

export async function getCurrency(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(currencies).where(eq(currencies.code, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllCurrencies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(currencies).where(eq(currencies.isActive, true));
}

export async function updateCurrency(currencyId: number, updates: Partial<typeof currencies.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(currencies).set(updates).where(eq(currencies.id, currencyId));
}

export async function updateExchangeRate(code: string, rate: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(currencies).set({ exchangeRateToKES: rate }).where(eq(currencies.code, code));
}
