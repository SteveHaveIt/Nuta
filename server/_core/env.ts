import { z } from "zod";

const envSchema = z.object({
  // Core
  VITE_APP_ID: z.string().optional(),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  OAUTH_SERVER_URL: z.string().optional(),
  OWNER_OPEN_ID: z.string().optional(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  BUILT_IN_FORGE_API_URL: z.string().optional(),
  BUILT_IN_FORGE_API_KEY: z.string().optional(),

  // Email
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.string().transform(v => parseInt(v, 10)).optional(),
  MAIL_USERNAME: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_FROM_ADDRESS: z.string().optional(),
  MAIL_FROM_NAME: z.string().optional(),

  // Twilio (SMS/WhatsApp)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

const env = parsedEnv.data;

export const ENV = {
  appId: env.VITE_APP_ID ?? "",
  cookieSecret: env.JWT_SECRET,
  databaseUrl: env.DATABASE_URL,
  oAuthServerUrl: env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: env.OWNER_OPEN_ID ?? "",
  isProduction: env.NODE_ENV === "production",
  forgeApiUrl: env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: env.BUILT_IN_FORGE_API_KEY ?? "",

  // Email
  mailHost: env.MAIL_HOST ?? "",
  mailPort: env.MAIL_PORT ?? 587,
  mailUsername: env.MAIL_USERNAME ?? "",
  mailPassword: env.MAIL_PASSWORD ?? "",
  mailFromAddress: env.MAIL_FROM_ADDRESS ?? "",
  mailFromName: env.MAIL_FROM_NAME ?? "",

  // Twilio
  twilioAccountSid: env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: env.TWILIO_AUTH_TOKEN ?? "",
  twilioPhoneNumber: env.TWILIO_PHONE_NUMBER ?? "",
};
