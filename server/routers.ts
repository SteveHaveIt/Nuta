import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { initiateSTKPush } from "./payment";
import nodemailer from "nodemailer";

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

  products: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),
    getFeatured: publicProcedure.query(async () => {
      return await db.getFeaturedProducts();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await db.getProductBySlug(input.slug);
        if (!product) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        }
        return product;
      }),
    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductsByCategory(input.categoryId);
      }),
  }),

  categories: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const category = await db.getCategoryBySlug(input.slug);
        if (!category) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });
        }
        return category;
      }),
  }),

  reviews: router({
    getByProduct: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await db.getApprovedReviewsByProduct(input.productId);
      }),
    create: publicProcedure
      .input(
        z.object({
          productId: z.number(),
          name: z.string(),
          email: z.string().email().optional(),
          rating: z.number().min(1).max(5),
          comment: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await db.createReview({
          ...input,
          userId: ctx.user?.id,
          isApproved: false, // Reviews need approval
        });
        return { success: true };
      }),
  }),

  cart: router({
    get: publicProcedure
      .input(z.object({ sessionId: z.string().optional() }))
      .query(async ({ input, ctx }) => {
        return await db.getCartItems(ctx.user?.id, input.sessionId);
      }),
    add: publicProcedure
      .input(
        z.object({
          productId: z.number(),
          quantity: z.number().min(1).default(1),
          sessionId: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const itemId = await db.addToCart({
          userId: ctx.user?.id,
          sessionId: input.sessionId,
          productId: input.productId,
          quantity: input.quantity,
        });
        return { success: true, itemId };
      }),
    updateQuantity: publicProcedure
      .input(
        z.object({
          itemId: z.number(),
          quantity: z.number().min(0),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateCartItemQuantity(input.itemId, input.quantity);
        return { success: true };
      }),
    clear: publicProcedure
      .input(z.object({ sessionId: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        await db.clearCart(ctx.user?.id, input.sessionId);
        return { success: true };
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string(),
          customerEmail: z.string().email(),
          customerPhone: z.string(),
          shippingAddress: z.string(),
          items: z.array(
            z.object({
              productId: z.number(),
              productName: z.string(),
              productImage: z.string().optional(),
              quantity: z.number(),
              price: z.number(),
            })
          ),
          totalAmount: z.number(),
          paymentMethod: z.string().optional(),
          notes: z.string().optional(),
          sessionId: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Generate order number
        const orderNumber = `NUTA-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        const orderId = await db.createOrder(
          {
            userId: ctx.user?.id,
            orderNumber,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            shippingAddress: input.shippingAddress,
            totalAmount: input.totalAmount,
            paymentMethod: input.paymentMethod,
            notes: input.notes,
          },
          input.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage || null,
            quantity: item.quantity,
            price: item.price,
          }))
        );

        // Clear cart after order
        await db.clearCart(ctx.user?.id, input.sessionId);

        return { success: true, orderId, orderNumber };
      }),
    getByUser: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrdersByUser(ctx.user.id);
    }),
    getById: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const orderData = await db.getOrderById(input.orderId);
        if (!orderData) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        }
        return orderData;
      }),
  }),

  promotions: router({
    getActive: publicProcedure.query(async () => {
      return await db.getActivePromotions();
    }),
    validateCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const promotion = await db.getPromotionByCode(input.code);
        if (!promotion || !promotion.isActive) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Invalid or expired promo code" });
        }
        return promotion;
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const success = await db.addSubscriber(input);
        if (!success) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already subscribed" });
        }
        return { success: true };
      }),
  }),

  payment: router({
    initiateSTKPush: publicProcedure
      .input(
        z.object({
          phoneNumber: z.string().regex(/^254\d{9}$/, "Invalid Kenyan phone number"),
          amount: z.number().min(1),
          orderId: z.number(),
          orderNumber: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await initiateSTKPush({
            phone_number: input.phoneNumber,
            amount: input.amount,
            account_reference: input.orderNumber,
            transaction_description: `Nuta Order ${input.orderNumber}`,
          });

          if (!result.success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: result.message,
            });
          }

          return {
            success: true,
            checkoutRequestId: result.data?.checkout_request_id,
            message: result.data?.customer_message || "STK Push sent to your phone",
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Payment initiation failed",
          });
        }
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email(),
          phone: z.string().optional(),
          subject: z.string().optional(),
          message: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Save to database
        const submissionId = await db.createContactSubmission(input);

        // Send email notification
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to yourself
            subject: `New Contact Form Submission: ${input.subject || "No Subject"}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${input.name}</p>
              <p><strong>Email:</strong> ${input.email}</p>
              <p><strong>Phone:</strong> ${input.phone || "N/A"}</p>
              <p><strong>Subject:</strong> ${input.subject || "N/A"}</p>
              <p><strong>Message:</strong></p>
              <p>${input.message}</p>
            `,
          });
        } catch (error) {
          console.error("Failed to send email:", error);
          // Don't fail the request if email fails
        }

         return { success: true, submissionId };
      }),
  }),

  favorites: router({
    toggle: publicProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        const sessionId = ctx.req.headers.cookie
          ?.split('; ')
          .find(c => c.startsWith('cart_session_id='))
          ?.split('=')?.[1];

        const isFav = await db.toggleFavorite(input.productId, userId, sessionId);
        return { isFavorite: isFav };
      }),

    check: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        const sessionId = ctx.req.headers.cookie
          ?.split('; ')
          .find(c => c.startsWith('cart_session_id='))
          ?.split('=')?.[1];

        const isFav = await db.isFavorite(input.productId, userId, sessionId);
        return { isFavorite: isFav };
      }),

    getByUser: protectedProcedure.query(async ({ ctx }) => {
      return await db.getFavoritesByUser(ctx.user.id);
    }),
  }),
});
export type AppRouter = typeof appRouter;
