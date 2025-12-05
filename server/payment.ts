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
    
    // Correct endpoint: /transactions/push-stk
    const endpoint = `${LIPANA_API_URL}/transactions/push-stk`;
    console.log("[STK Push] API Endpoint:", endpoint);
    console.log("[STK Push] Phone:", payload.phone_number);
    console.log("[STK Push] Amount:", payload.amount);
    console.log("[STK Push] Account Ref:", payload.account_reference);

    // Lipana API expects: phone, amount (and optional callback_url)
    const requestBody: { phone: string; amount: number; callback_url?: string } = {
      phone: payload.phone_number,
      amount: payload.amount,
    };

    if (payload.callback_url) {
      requestBody.callback_url = payload.callback_url;
    }

    console.log("[STK Push] Request body:", JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      endpoint,
      requestBody,
      {
        headers: {
          "x-api-key": LIPANA_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[STK Push] ✅ SUCCESS! Response:", JSON.stringify(response.data, null, 2));
    console.log("=== STK PUSH COMPLETE ===");
    
    return {
      success: true,
      message: response.data.message || "STK Push initiated successfully",
      data: {
        checkout_request_id: response.data.data?.checkoutRequestID || response.data.data?.transactionId,
        response_code: "0",
        response_description: response.data.message || "Success",
        customer_message: response.data.data?.message || "STK push sent to your phone. Please complete the payment on your phone.",
      },
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
      
      const errorMessage = error.response?.data?.message || error.message;
      console.error("=== STK PUSH ERROR END ===");
      
      return {
        success: false,
        message: errorMessage,
      };
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
      `${LIPANA_API_URL}/transactions/${checkoutRequestId}`,
      {
        headers: {
          "x-api-key": LIPANA_SECRET_KEY,
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
