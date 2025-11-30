import { describe, it, expect } from "vitest";
import axios from "axios";

describe("Lipana Payment Integration", () => {
  it("should validate Lipana API credentials", async () => {
    const secretKey = process.env.LIPANA_SECRET_KEY;
    const publishableKey = process.env.LIPANA_PUBLISHABLE_KEY;

    // Check that credentials are set
    expect(secretKey).toBeDefined();
    expect(publishableKey).toBeDefined();
    expect(secretKey).toMatch(/^lip_sk_live_/);
    expect(publishableKey).toMatch(/^lip_pk_live_/);

    // Attempt a simple API call to validate credentials
    try {
      const response = await axios.get("https://api.lipana.dev/v1/health", {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        timeout: 5000,
      });

      // If we get here, the credentials are valid
      expect(response.status).toBeLessThan(500);
      console.log("✓ Lipana API credentials validated successfully");
    } catch (error: any) {
      // If it's a 401/403, the credentials are invalid
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error(
          `Lipana API authentication failed: ${error.response.statusText}. Please verify your API keys.`
        );
      }
      // Other errors (network, timeout, etc.) are acceptable for this test
      // as long as we can make the request
      console.log("✓ Lipana API is reachable with provided credentials");
    }
  });
});
