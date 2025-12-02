import dotenv from "dotenv";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Get __dirname for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load .env.local in development, in production Docker will use environment variables
if (process.env.NODE_ENV !== "production") {
  try {
    dotenv.config({ path: path.resolve(__dirname, "./env/.env.local") });
  } catch (error) {
    // Silently fail if .env.local doesn't exist (e.g., in Docker build)
    // This is expected in production Docker builds
  }
}

const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ssl-new-trucker.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:5002",
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5300",
    JWT_SECRET: process.env.JWT_SECRET || "",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
    NEXT_PUBLIC_FIREBASE_API_KEY_PLACEHOLDER_DEV:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY_PLACEHOLDER_DEV,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PLACEHOLDER_DEV:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PLACEHOLDER_DEV,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID_PLACEHOLDER_DEV:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_PLACEHOLDER_DEV,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PLACEHOLDER_DEV:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PLACEHOLDER_DEV,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER_DEV:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER_DEV,
    NEXT_PUBLIC_FIREBASE_APP_ID_PLACEHOLDER_DEV:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID_PLACEHOLDER_DEV,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PLACEHOLDER_DEV:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PLACEHOLDER_DEV,
  },
  webpack(config: { module: { rules: { test: RegExp; use: string[] }[] } }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
