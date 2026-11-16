import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

const isProduction = process.env.NODE_ENV === "production";

// Helper: apakah URL mengarah ke localhost/127.0.0.1
const isLocalURL = (url?: string) =>
  !!url && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(url);

// Di production, JANGAN gunakan localhost-based URL sebagai baseURL.
// Prioritas: SITE_URL > BETTER_AUTH_URL (hanya jika bukan localhost) > fallback hardcoded.
const authBaseURL = isProduction
  ? process.env.SITE_URL ||
    (!isLocalURL(process.env.BETTER_AUTH_URL)
      ? process.env.BETTER_AUTH_URL
      : undefined) ||
    "https://tardamuairport.id"
  : process.env.BETTER_AUTH_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

const trustedOrigins = Array.from(
  new Set(
    [
      authBaseURL,
      "https://tardamuairport.id",
      "https://www.tardamuairport.id",
      process.env.SITE_URL,
      process.env.FRONTEND_URL,
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.NEXT_PUBLIC_API_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ]
      .filter(Boolean)
      .map((origin) => origin!.replace(/\/$/, ""))
  )
);

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "my-super-secret-key-at-least-32-characters-long",
  baseURL: authBaseURL.replace(/\/$/, ""),
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // Registrasi publik dimatikan: akun admin hanya dibuat lewat
    // script seed / server-side, bukan endpoint publik sign-up.
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  advanced: {
    useSecureCookies: isProduction,
  },
});
