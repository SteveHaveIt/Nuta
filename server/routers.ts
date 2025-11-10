import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Helper function to generate order number
function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Helper function to generate referral code
function generateReferralCode() {
  return `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Helper function to generate PIN
function generatePin() {
  return Math.random().toString().slice(2, 8);
}

// Helper function to calculate loyalty points (KES 500 = 9 points)
function calculateLoyaltyPoints(amountInCents: number) {
  const amountInKES = amountInCents / 100;
  return Math.floor((amountInKES / 500) * 9);
}

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== PRODUCTS =====
  products: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        const { limit = 50, offset = 0 } = input || {};
        return db.getProducts(limit, offset);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) throw new TRPCError({ code: "NOT_FOUND" });
        return product;
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return db.searchProducts(input.query);
      }),

    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getProductsByCategory(input.category);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        quantity: z.number(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createProduct({
          name: input.name,
          description: input.description,
          price: Math.round(input.price * 100), // Convert to cents
          quantity: input.quantity,
          category: input.category,
          imageUrl: input.imageUrl,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...updates } = input;
        const updateData: any = {};
        if (updates.price !== undefined) updateData.price = Math.round(updates.price * 100);
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
        if (updates.category !== undefined) updateData.category = updates.category;
        if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;
        return db.updateProduct(id, updateData);
      }),
  }),

  // ===== ORDERS =====
  orders: router({
    create: publicProcedure
      .input(z.object({
        items: z.array(z.object({ productId: z.number(), quantity: z.number() })),
        deliveryAddress: z.string(),
        paymentMethod: z.enum(["mpesa", "paypal"]),
        guestPhone: z.string().optional(),
        guestEmail: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const orderNumber = generateOrderNumber();
        const orderPin = generatePin();
        let totalAmount = 0;

        // Calculate total and validate products
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (!product) throw new TRPCError({ code: "NOT_FOUND", message: `Product ${item.productId} not found` });
          totalAmount += product.price * item.quantity;
        }

        // Create order
        const order = await db.createOrder({
          userId: ctx.user?.id,
          orderNumber,
          status: "pending",
          totalAmount,
          paymentMethod: input.paymentMethod,
          paymentStatus: "pending",
          deliveryAddress: input.deliveryAddress,
          guestPhone: input.guestPhone,
          guestEmail: input.guestEmail,
          guestPin: input.guestPhone ? orderPin : undefined,
        });

        // Add order items
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (product) {
            await db.addOrderItem({
              orderId: (order as any).insertId,
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            });
          }
        }

        // Create guest order record if guest
        if (input.guestPhone) {
          await db.createGuestOrder(input.guestPhone, input.guestEmail || "", orderPin, orderNumber);
        }

        return { orderNumber, orderPin, totalAmount };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.id);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        if (order.userId !== ctx.user?.id && ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const items = await db.getOrderItems(input.id);
        return { ...order, items };
      }),

    getByNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        const order = await db.getOrderByNumber(input.orderNumber);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        const items = await db.getOrderItems(order.id);
        return { ...order, items };
      }),

    myOrders: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const orders = await db.getUserOrders(ctx.user.id);
      return orders;
    }),

    updateStatus: protectedProcedure
      .input(z.object({ orderId: z.number(), status: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.updateOrderStatus(input.orderId, input.status);
      }),

    trackByPin: publicProcedure
      .input(z.object({ orderPin: z.string() }))
      .query(async ({ input }) => {
        const guestOrder = await db.getGuestOrderByPin(input.orderPin);
        if (!guestOrder) throw new TRPCError({ code: "NOT_FOUND" });
        const order = await db.getOrderByNumber(guestOrder.orderNumber);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        const items = await db.getOrderItems(order.id);
        return { ...order, items };
      }),
  }),

  // ===== PAYMENTS =====
  payments: router({
    initiateMpesa: publicProcedure
      .input(z.object({ orderId: z.number(), phone: z.string() }))
      .mutation(async ({ input }) => {
        // TODO: Integrate with M-PESA API
        // This is a placeholder for M-PESA STK Push integration
        return { success: true, message: "M-PESA prompt sent" };
      }),

    mpesaCallback: publicProcedure
      .input(z.object({ orderId: z.number(), status: z.string(), transactionId: z.string() }))
      .mutation(async ({ input }) => {
        if (input.status === "success") {
          await db.updateOrderPaymentStatus(input.orderId, "completed");
          await db.updateOrderStatus(input.orderId, "confirmed");
        } else {
          await db.updateOrderPaymentStatus(input.orderId, "failed");
        }
        return { success: true };
      }),

    initiatePaypal: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input }) => {
        // TODO: Integrate with PayPal API
        return { success: true, message: "PayPal redirect URL" };
      }),

    paypalCallback: publicProcedure
      .input(z.object({ orderId: z.number(), status: z.string() }))
      .mutation(async ({ input }) => {
        if (input.status === "success") {
          await db.updateOrderPaymentStatus(input.orderId, "completed");
          await db.updateOrderStatus(input.orderId, "confirmed");
        } else {
          await db.updateOrderPaymentStatus(input.orderId, "failed");
        }
        return { success: true };
      }),
  }),

  // ===== LOYALTY POINTS =====
  loyalty: router({
    getPoints: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      let points = await db.getLoyaltyPoints(ctx.user.id);
      if (!points) {
        await db.createLoyaltyPoints(ctx.user.id);
        points = await db.getLoyaltyPoints(ctx.user.id);
      }
      return points;
    }),

    addPoints: protectedProcedure
      .input(z.object({ orderId: z.number(), amount: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const pointsToAdd = calculateLoyaltyPoints(input.amount);
        // TODO: Get userId from order
        return { success: true, pointsAdded: pointsToAdd };
      }),

    redeem: protectedProcedure
      .input(z.object({ points: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        await db.redeemLoyaltyPoints(ctx.user.id, input.points);
        const kesValue = (input.points * 3); // 1 point = KES 3
        return { success: true, kesValue };
      }),

    history: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      // TODO: Implement history query
      return [];
    }),
  }),

  // ===== SPIN WHEEL =====
  spinWheel: router({
    checkEligibility: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const orders = await db.getUserOrders(ctx.user.id);
      const purchaseCount = orders.length;
      const eligible = purchaseCount >= 5;
      const nextMilestone = [5, 10, 20, 30].find(m => m > purchaseCount) || 30;
      return { eligible, purchaseCount, nextMilestone };
    }),

    spin: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      
      const orders = await db.getUserOrders(ctx.user.id);
      const purchaseCount = orders.length;
      
      let rewardAmount = 0;
      if (purchaseCount >= 30) rewardAmount = 100000; // KES 1000 in cents
      else if (purchaseCount >= 20) rewardAmount = 50000; // KES 500
      else if (purchaseCount >= 10) rewardAmount = 20000; // KES 200
      else if (purchaseCount >= 5) rewardAmount = 10000; // KES 100
      else throw new TRPCError({ code: "FORBIDDEN", message: "Not eligible for spin" });

      await db.createSpinWheelRecord(ctx.user.id, purchaseCount, rewardAmount);
      return { success: true, rewardAmount, message: `You won KES ${rewardAmount / 100}!` };
    }),
  }),

  // ===== AFFILIATES =====
  affiliates: router({
    register: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      
      const existing = await db.getAffiliateByUserId(ctx.user.id);
      if (existing) throw new TRPCError({ code: "BAD_REQUEST", message: "Already registered as affiliate" });

      const referralCode = generateReferralCode();
      const result = await db.createAffiliate({
        userId: ctx.user.id,
        referralCode,
        status: "pending",
      });

      return { success: true, referralCode };
    }),

    getStatus: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const affiliate = await db.getAffiliateByUserId(ctx.user.id);
      if (!affiliate) return null;
      const commissions = await db.getAffiliateCommissions(affiliate.id);
      return { ...affiliate, commissions };
    }),

    getEarnings: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const affiliate = await db.getAffiliateByUserId(ctx.user.id);
      if (!affiliate) throw new TRPCError({ code: "NOT_FOUND" });
      return {
        totalEarnings: affiliate.totalEarnings,
        monthlyEarnings: affiliate.monthlyEarnings,
        rank: affiliate.rank,
      };
    }),

    approve: protectedProcedure
      .input(z.object({ affiliateId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        // TODO: Update affiliate status to approved
        return { success: true };
      }),
  }),

  // ===== SUPPORT =====
  support: router({
    createTicket: publicProcedure
      .input(z.object({
        subject: z.string(),
        description: z.string(),
        guestEmail: z.string().optional(),
        guestPhone: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ticketNumber = `TKT-${Date.now()}`;
        const result = await db.createSupportTicket({
          userId: ctx.user?.id,
          ticketNumber,
          subject: input.subject,
          description: input.description,
          guestEmail: input.guestEmail,
          guestPhone: input.guestPhone,
        });
        return { success: true, ticketNumber };
      }),

    getTicket: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const ticket = await db.getSupportTicketById(input.id);
        if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
        const messages = await db.getSupportMessages(input.id);
        return { ...ticket, messages };
      }),

    myTickets: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      return db.getUserSupportTickets(ctx.user.id);
    }),

    addMessage: protectedProcedure
      .input(z.object({ ticketId: z.number(), message: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const ticket = await db.getSupportTicketById(input.ticketId);
        if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
        
        const isAdmin = ctx.user?.role === "admin";
        await db.addSupportMessage(input.ticketId, ctx.user?.id, input.message, isAdmin);
        return { success: true };
      }),

    allTickets: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getAllSupportTickets();
    }),
  }),

  // ===== RETURNS =====
  returns: router({
    create: protectedProcedure
      .input(z.object({ orderId: z.number(), reason: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
        const result = await db.createReturn(input.orderId, ctx.user.id, input.reason);
        return { success: true };
      }),

    myReturns: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      return db.getReturnsByUserId(ctx.user.id);
    }),
  }),

  // ===== ADMIN =====
  admin: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      // TODO: Implement dashboard stats
      return { totalOrders: 0, totalRevenue: 0, activeUsers: 0 };
    }),

    allOrders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      // TODO: Implement all orders query
      return [];
    }),

    allTickets: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getAllSupportTickets();
    }),
  }),
});

export type AppRouter = typeof appRouter;
