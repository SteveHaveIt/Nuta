import axios from "axios";

const LIPANA_API_URL = "https://api.lipana.dev/v1";
const LIPANA_SECRET_KEY = process.env.LIPANA_SECRET_KEY;
const LIPANA_PUBLISHABLE_KEY = process.env.LIPANA_PUBLISHABLE_KEY;

export interface STKPushPayload {
  phone_number: string;
  amount: number;
  account_reference: string;
  transaction_description: string;
  callback_url?: string;
}

export interface STKPushResponse {
  success: boolean;
  message: string;
  data?: {
    checkout_request_id: string;
    response_code: string;
    response_description: string;
    customer_message: string;
  };
}

/**
 * Initiate M-Pesa STK Push using Lipana.dev API
 */
export async function initiateSTKPush(payload: STKPushPayload): Promise<STKPushResponse> {
  try {
    console.log("=== STK PUSH INITIATION ===");
    console.log("[STK Push] Starting payment initiation...");
    console.log("[STK Push] Payload:", JSON.stringify(payload, null, 2));
    
    if (!LIPANA_SECRET_KEY) {
      console.error("[STK Push] LIPANA_SECRET_KEY not configured");
      throw new Error("LIPANA_SECRET_KEY not configured");
    }
    
    if (!LIPANA_PUBLISHABLE_KEY) {
      console.warn("[STK Push] LIPANA_PUBLISHABLE_KEY not configured (may not be required)");
    }
    
    console.log("[STK Push] API URL:", `${LIPANA_API_URL}/payments/mobile-money/stk-push`);
    console.log("[STK Push] Phone:", payload.phone_number);
    console.log("[STK Push] Amount:", payload.amount);
    console.log("[STK Push] Account Ref:", payload.account_reference);

    const response = await axios.post(
      `${LIPANA_API_URL}/payments/mobile-money/stk-push`,
      {
        phone_number: payload.phone_number,
        amount: payload.amount,
        account_reference: payload.account_reference,
        transaction_description: payload.transaction_description,
        callback_url: payload.callback_url,
      },
      {
        headers: {
          Authorization: `Bearer ${LIPANA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[STK Push] ✅ SUCCESS! Response:", JSON.stringify(response.data, null, 2));
    console.log("=== STK PUSH COMPLETE ===");
    
    return {
      success: true,
      message: "STK Push initiated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("=== STK PUSH ERROR ===");
    console.error("[STK Push] ERROR:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("[STK Push] Response data:", JSON.stringify(error.response?.data, null, 2));
      console.error("[STK Push] Response status:", error.response?.status);
      console.error("[STK Push] Response headers:", error.response?.headers);
      console.error("[STK Push] Request URL:", error.config?.url);
      console.error("[STK Push] Request method:", error.config?.method);
    }
    
    console.error("=== STK PUSH ERROR END ===");
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to initiate STK Push",
    };
  }
}

/**
 * Query payment status from Lipana
 */
export async function queryPaymentStatus(checkoutRequestId: string): Promise<any> {
  try {
    if (!LIPANA_SECRET_KEY) {
      throw new Error("LIPANA_SECRET_KEY not configured");
    }

    const response = await axios.get(
      `${LIPANA_API_URL}/payments/mobile-money/query/${checkoutRequestId}`,
      {
        headers: {
          Authorization: `Bearer ${LIPANA_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lipana Query Error:", error);
    throw error;
  }
}

/**
 * Verify Lipana webhook signature
 */
export function verifyWebhookSignature(payload: any, signature: string): boolean {
  // Implement signature verification based on Lipana documentation
  // This is a placeholder - update with actual verification logic
  return true;
}
