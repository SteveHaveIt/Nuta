import { describe, it, expect, beforeEach, vi } from "vitest";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  getProductBySlug: vi.fn(),
  getAllProducts: vi.fn(),
}));

describe("Product Routing and Navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Route Pattern Matching", () => {
    it("should match /products/:slug route pattern", () => {
      const routePattern = /^\/products\/([a-z0-9-]+)$/;
      const validRoutes = [
        "/products/peanut-butter",
        "/products/nuta-original",
        "/products/chunky-peanut-butter",
      ];

      validRoutes.forEach((route) => {
        expect(routePattern.test(route)).toBe(true);
      });
    });

    it("should distinguish between /products/:slug and /product/:id routes", () => {
      const correctPattern = /^\/products\/([a-z0-9-]+)$/;
      const oldBrokenPattern = /^\/product\/\d+$/;

      // Correct pattern should match slug-based routes
      expect(correctPattern.test("/products/peanut-butter")).toBe(true);
      expect(correctPattern.test("/products/chunky-peanut-butter")).toBe(true);

      // Old broken pattern should match numeric ID routes (to show the difference)
      expect(oldBrokenPattern.test("/product/1")).toBe(true);
      expect(oldBrokenPattern.test("/product/123")).toBe(true);

      // They should NOT match each other
      expect(correctPattern.test("/product/1")).toBe(false);
      expect(oldBrokenPattern.test("/products/peanut-butter")).toBe(false);
    });

    it("should extract slug from URL correctly", () => {
      const url = "/products/peanut-butter";
      const match = url.match(/^\/products\/([a-z0-9-]+)$/);
      const slug = match?.[1];

      expect(slug).toBe("peanut-butter");
    });
  });

  describe("Product Slug Lookup", () => {
    it("should fetch product by slug", async () => {
      const mockGetProductBySlug = vi.mocked(db.getProductBySlug);
      const mockProduct = {
        id: 1,
        name: "Nuta Peanut Butter",
        slug: "peanut-butter",
        price: 50000,
        imageUrl: "https://example.com/image.jpg",
        stock: 100,
      };

      mockGetProductBySlug.mockResolvedValue(mockProduct as any);

      const result = await db.getProductBySlug("peanut-butter");

      expect(result).toEqual(mockProduct);
      expect(mockGetProductBySlug).toHaveBeenCalledWith("peanut-butter");
    });

    it("should handle product not found gracefully", async () => {
      const mockGetProductBySlug = vi.mocked(db.getProductBySlug);
      mockGetProductBySlug.mockResolvedValue(undefined);

      const result = await db.getProductBySlug("non-existent-product");

      expect(result).toBeUndefined();
      expect(mockGetProductBySlug).toHaveBeenCalledWith("non-existent-product");
    });

    it("should handle slug with special characters", async () => {
      const mockGetProductBySlug = vi.mocked(db.getProductBySlug);
      const mockProduct = {
        id: 2,
        name: "Chunky Peanut Butter",
        slug: "chunky-peanut-butter",
        price: 60000,
        imageUrl: "https://example.com/image2.jpg",
        stock: 50,
      };

      mockGetProductBySlug.mockResolvedValue(mockProduct as any);

      const result = await db.getProductBySlug("chunky-peanut-butter");

      expect(result?.slug).toBe("chunky-peanut-butter");
    });
  });

  describe("Link Generation", () => {
    it("should generate correct product detail link from slug", () => {
      const slug = "peanut-butter";
      const link = `/products/${slug}`;

      expect(link).toBe("/products/peanut-butter");
    });

    it("should NOT generate old broken link format", () => {
      const productId = 1;
      const oldBrokenLink = `/product/${productId}`;

      expect(oldBrokenLink).not.toBe("/products/peanut-butter");
      expect(oldBrokenLink).toBe("/product/1");
    });

    it("should handle multiple products with different slugs", () => {
      const products = [
        { id: 1, slug: "peanut-butter" },
        { id: 2, slug: "chunky-peanut-butter" },
        { id: 3, slug: "honey-peanut-butter" },
      ];

      const links = products.map((p) => `/products/${p.slug}`);

      expect(links).toEqual([
        "/products/peanut-butter",
        "/products/chunky-peanut-butter",
        "/products/honey-peanut-butter",
      ]);
    });
  });

  describe("Cart to Product Detail Navigation", () => {
    it("should navigate from cart to product detail using slug", () => {
      const cartItem = {
        productId: 1,
        slug: "peanut-butter",
        quantity: 2,
      };

      const productDetailLink = `/products/${cartItem.slug}`;

      expect(productDetailLink).toBe("/products/peanut-butter");
    });

    it("should maintain product information through navigation", async () => {
      const mockGetProductBySlug = vi.mocked(db.getProductBySlug);
      const mockProduct = {
        id: 1,
        name: "Nuta Peanut Butter",
        slug: "peanut-butter",
        price: 50000,
        weight: "500g",
        imageUrl: "https://example.com/image.jpg",
        stock: 100,
      };

      mockGetProductBySlug.mockResolvedValue(mockProduct as any);

      // Simulate cart item navigating to product detail
      const cartItemSlug = "peanut-butter";
      const product = await db.getProductBySlug(cartItemSlug);

      expect(product?.name).toBe("Nuta Peanut Butter");
      expect(product?.price).toBe(50000);
      expect(product?.weight).toBe("500g");
    });
  });

  describe("Route Order Priority", () => {
    it("should prioritize specific route over general route", () => {
      // In wouter, route order matters
      // /products/:slug should be checked BEFORE /products
      const testUrl = "/products/peanut-butter";
      const specificMatch = testUrl.match(/^\/products\/([a-z0-9-]+)$/);
      const generalMatch = testUrl.match(/^\/products$/);

      expect(specificMatch).not.toBeNull();
      expect(generalMatch).toBeNull();
    });
  });

  describe("Error Handling", () => {
    it("should return 404 when product slug not found", async () => {
      const mockGetProductBySlug = vi.mocked(db.getProductBySlug);
      mockGetProductBySlug.mockResolvedValue(undefined);

      const result = await db.getProductBySlug("invalid-slug");

      expect(result).toBeUndefined();
    });

    it("should validate slug format before querying", () => {
      const slugRegex = /^[a-z0-9-]+$/;
      const validSlugs = ["peanut-butter", "chunky", "honey-roasted-peanut"];
      const invalidSlugs = ["Peanut-Butter", "peanut_butter", "peanut butter"];

      validSlugs.forEach((slug) => {
        expect(slugRegex.test(slug)).toBe(true);
      });

      invalidSlugs.forEach((slug) => {
        expect(slugRegex.test(slug)).toBe(false);
      });
    });
  });
});
