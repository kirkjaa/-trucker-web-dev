import jwt from "jsonwebtoken";

import { config } from "../config";

type TokenPayload = {
  id: string;
  role: string;
  organizationType?: string | null;
};

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.accessTokenTtl,
  });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenTtl,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.refreshTokenSecret) as TokenPayload;
}
