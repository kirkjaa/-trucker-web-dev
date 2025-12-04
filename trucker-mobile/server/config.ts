// ============================================================================
// Mobile API Configuration
// Configure the desktop API endpoint for data sharing
// ============================================================================

// Desktop API URL - the mobile backend will proxy/adapt requests to this API
export const DESKTOP_API_URL = process.env.DESKTOP_API_URL || 'https://api.trw.q9.quest';

// JWT Secret - should match desktop for token validation
export const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Server configuration
export const PORT = parseInt(process.env.PORT || '5003', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';

// API mode: 'standalone' uses local DB, 'proxy' uses desktop API
export const API_MODE = process.env.API_MODE || 'proxy';

export default {
  DESKTOP_API_URL,
  JWT_SECRET,
  PORT,
  NODE_ENV,
  API_MODE,
};

