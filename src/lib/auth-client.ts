import { createAuthClient } from "better-auth/react";

function getAuthBaseURL() {
  const configuredURL =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL;

  if (typeof window === "undefined") {
    return configuredURL || "http://localhost:3000";
  }

  const currentOrigin = window.location.origin;
  const isCurrentLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
    currentOrigin
  );
  const isConfiguredLocalhost =
    configuredURL &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(configuredURL);

  if (isConfiguredLocalhost && !isCurrentLocalhost) {
    return currentOrigin;
  }

  return configuredURL || currentOrigin;
}

const authBaseURL = getAuthBaseURL();

export const authClient = createAuthClient({
  baseURL: authBaseURL.replace(/\/$/, ""),
});
