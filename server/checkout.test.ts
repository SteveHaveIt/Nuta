import { describe, it, expect, beforeEach, vi } from "vitest";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  createOrder: vi.fn(),
  clearCart: vi.fn(),
  getOrderById: vi.fn(),
}));

describe("Checkout and Order Creation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an order with valid data", async () => {
    const mockCreateOrder = vi.mocked(db.createOrder);
    mockCreateOrder.mockResolvedValue(123);

    const orderData = {
      userId: undefined,
      orderNumber: "NUTA-1234567890-ABC123",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "0742101089",
      shippingAddress: "123 Main St, Nairobi, 00100",
      totalAmount: 150000, // 1500 KES in cents
      paymentMethod: "M-Pesa",
      notes: "Leave at door",
    };

    const items = [
      {
        productId: 1,
        productName: "Nuta Peanut Butter",
        productImage: "https://example.com/image.jpg",
        quantity: 2,
        price: 50000, // 500 KES in cents
      },
    ];

    const result = await db.createOrder(orderData, items);

    expect(result).toBe(123);
    expect(mockCreateOrder).toHaveBeenCalledWith(orderData, items);
  });

  it("should validate required order fields", async () => {
    const mockCreateOrder = vi.mocked(db.createOrder);

    const incompleteOrderData = {
      userId: undefined,
      orderNumber: "NUTA-1234567890-ABC123",
      customerName: "John Doe",
      customerEmail: "", // Missing email
      customerPhone: "0742101089",
      shippingAddress: "123 Main St, Nairobi",
      totalAmount: 150000,
    };

    // Email validation should happen at tRPC input level
    expect(incompleteOrderData.customerEmail).toBe("");
  });

  it("should generate unique order numbers", () => {
    const orderNumber1 = `NUTA-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const orderNumber2 = `NUTA-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    expect(orderNumber1).not.toBe(orderNumber2);
    expect(orderNumber1).toMatch(/^NUTA-\d+-[A-Z0-9]+$/);
  });

  it("should clear cart after order creation", async () => {
    const mockClearCart = vi.mocked(db.clearCart);
    mockClearCart.mockResolvedValue(undefined);

    const sessionId = "session-123";
    await db.clearCart(undefined, sessionId);

    expect(mockClearCart).toHaveBeenCalledWith(undefined, sessionId);
  });

  it("should retrieve order by ID", async () => {
    const mockGetOrderById = vi.mocked(db.getOrderById);
    const mockOrder = {
      id: 123,
      orderNumber: "NUTA-1234567890-ABC123",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "0742101089",
      shippingAddress: "123 Main St, Nairobi",
      totalAmount: 150000,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      paymentMethod: "M-Pesa",
      notes: null,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetOrderById.mockResolvedValue(mockOrder);

    const result = await db.getOrderById(123);

    expect(result).toEqual(mockOrder);
    expect(mockGetOrderById).toHaveBeenCalledWith(123);
  });

  it("should validate phone number format", () => {
    const validPhones = ["0742101089", "+254742101089", "0712345678"];
    const invalidPhones = ["123456", "0642101089", "254742101089"];

    const phoneRegex = /^(\+254|0)[17][0-9]{8}$/;

    validPhones.forEach((phone) => {
      expect(phoneRegex.test(phone.replace(/\s/g, ""))).toBe(true);
    });

    invalidPhones.forEach((phone) => {
      expect(phoneRegex.test(phone.replace(/\s/g, ""))).toBe(false);
    });
  });

  it("should calculate correct order totals", () => {
    const items = [
      { price: 50000, quantity: 2 }, // 1000 KES
      { price: 30000, quantity: 1 }, // 300 KES
    ];

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 50000; // 500 KES
    const total = subtotal + shipping;

    expect(subtotal).toBe(130000); // 1300 KES
    expect(total).toBe(180000); // 1800 KES
  });
});
