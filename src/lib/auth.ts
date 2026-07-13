import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

const authBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://127.0.0.1:3000";

const trustedOrigins = Array.from(
  new Set(
    [
      authBaseURL,
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ]
      .filter(Boolean)
      .map((origin) => origin!.replace(/\/$/, ""))
  )
);

export const auth = betterAuth({
  baseURL: authBaseURL.replace(/\/$/, ""),
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
