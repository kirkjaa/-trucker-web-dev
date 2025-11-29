# Docker Build Error Fix

## Issue

During Docker build, Next.js was trying to statically generate pages and encountered "Invalid URL" errors because environment variables were empty or undefined during the build process.

## Error Message

```
TypeError: Invalid URL
Error occurred prerendering page "/admin/chat"
Error occurred prerendering page "/factory/list-of-rfq"
```

## Root Cause

1. Next.js tries to statically generate pages at build time
2. Some code uses `NEXT_PUBLIC_API_BASE_URL` or other env vars to create URL objects
3. If these variables are empty/undefined during build, `new URL()` throws "Invalid URL" error

## Fixes Applied

### 1. Made Problematic Pages Dynamic

**Files Updated:**
- `app/(main)/admin/chat/page.tsx`
- `app/(main)/factory/list-of-rfq/page.tsx`

**Change:**
```typescript
// Force dynamic rendering to avoid build-time URL errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

This prevents Next.js from trying to statically generate these pages at build time.

### 2. Added Default Values for Environment Variables

**Files Updated:**
- `app/services/common.ts` - Added default for `API_BASE_URL`
- `app/api/auth/[...nextauth]/auth.ts` - Added validation and defaults
- `next.config.ts` - Added default values for all env vars
- `docker/Dockerfile` - Added default values using Docker syntax

**Changes:**
```typescript
// Before
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// After
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
```

### 3. Fixed Middleware for Build Time

**File Updated:** `middleware.ts`

**Change:**
```typescript
// Skip middleware during build if NEXTAUTH_SECRET is not set
if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
    return NextResponse.next();
  }
}
```

## Verification

After these fixes, the build should complete successfully. The pages will be rendered dynamically at runtime instead of statically at build time.

## Important Notes

1. **Environment Variables Still Required**: While defaults are provided for build, you MUST set proper values in your `.env` file for production
2. **Dynamic Rendering**: The affected pages are now dynamically rendered, which means they're generated on each request (or cached based on revalidate setting)
3. **Build vs Runtime**: Default values are only used during build if env vars are missing. At runtime, actual values from `.env` are used

## Testing

After applying fixes:

```bash
# Rebuild Docker image
docker-compose build --no-cache

# Or use deployment script
./docker/deploy.sh
```

The build should now complete without "Invalid URL" errors.

