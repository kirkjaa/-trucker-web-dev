import axios from "axios";
import jwt from "jsonwebtoken";
import { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import "dotenv/config";

interface IUser extends NextAuthUser {
  id: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  type?: string;
  is_remembered?: boolean;
}

interface JWTToken {
  id?: string;
  email?: string;
  role?: string;
  type?: string;
  accessToken?: string;
  refreshToken?: string;
  is_remembered?: boolean;
  exp?: number;
  error?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        is_remembered: {
          label: "Is Remembered",
          type: "text",
        },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }
        const is_remembered =
          String(credentials.is_remembered).toLowerCase() === "true";

        try {
          const apiBaseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5300";
          if (!apiBaseUrl) {
            throw new Error("API base URL is not configured");
          }
          const response = await axios.post(`${apiBaseUrl}/v1/auth/login`, {
            username: credentials.username,
            password: credentials.password,
            is_remembered,
          });

          const { data: responseData } = response.data;

          if (!responseData || !responseData.accessToken) {
            return null;
          }

          const decoded = jwt.decode(responseData.accessToken) as Record<
            string,
            any
          > | null;

          return {
            id: decoded?.id ?? "",
            role: decoded?.role,
            type: decoded?.type ?? undefined,
            accessToken: responseData.accessToken,
            refreshToken: is_remembered ? responseData.refreshToken : undefined,
          } as IUser;
        } catch (err) {
          console.error("Login Error:", err);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      const t = token as JWTToken;
      if (user) {
        const u = user as IUser;

        t.id = u.id;
        t.email = u.email;
        t.role = u.role;
        t.type = u.type;
        t.accessToken = u.accessToken;
        t.refreshToken = u.is_remembered ? u.refreshToken : undefined;
        t.is_remembered = u.is_remembered;

        if (u.accessToken) {
          const decoded = jwt.decode(u.accessToken as string);
          if (decoded && typeof decoded === "object") {
            t.exp = decoded.exp;
          }
        }
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExp = t.exp as number | undefined;

      if (
        t.is_remembered &&
        t.refreshToken &&
        tokenExp &&
        currentTime >= tokenExp - 5 * 60
      ) {
        try {
          const newAccessToken = await refreshAccessToken(
            t.refreshToken as string
          );
          t.accessToken = newAccessToken;

          const decoded = jwt.decode(newAccessToken);
          if (decoded && typeof decoded === "object") {
            t.exp = decoded.exp;
          }
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          t.accessToken = undefined;
          t.refreshToken = undefined;
          t.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },

    session: async ({ session, token }) => {
      if (token.error === "RefreshAccessTokenError") {
        return {
          ...session,
          error: "RefreshAccessTokenError",
        };
      }

      if (token.refreshToken) {
        const decoded = jwt.decode(token.refreshToken as string);
        if (decoded && typeof decoded === "object" && decoded.exp) {
          session.expires = new Date(decoded.exp * 1000).toISOString();
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          type: token.type,
        },
        accessToken: token.accessToken as string,
        refreshToken: token.is_remembered ? token.refreshToken : undefined,
      };
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5300";
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured");
    }
    const response = await axios.post(`${apiBaseUrl}/v1/auth/refresh`, {
      refreshToken,
    });

    const newAccessToken = response.data.accessToken;
    return newAccessToken;
  } catch (error: any) {
    console.error(
      "Error refreshing access token:",
      error.response?.data || error.message
    );
    throw error;
  }
};
