# Asset Download Scripts

This directory contains scripts to download Figma assets and update the codebase to use local paths.

## Status

✅ **46 assets successfully downloaded** and updated in `App.tsx`  
⚠️ **32 assets still need manual download** (Figma URLs returned 404 - may have expired)

## Scripts

### 1. `download-all-assets.js`
Downloads all Figma assets to local files.

```bash
node scripts/download-all-assets.js
```

**Output:**
- Downloads assets to `public/assets/icons/` and `public/assets/images/`
- Creates `scripts/asset-mapping.json` with URL → local path mappings

### 2. `update-asset-paths.js`
Updates `App.tsx` to use local asset paths instead of Figma URLs.

```bash
node scripts/update-asset-paths.js
```

**Requires:** `scripts/asset-mapping.json` (created by download script)

### 3. `find-missing-assets.js`
Identifies assets still using Figma URLs.

```bash
node scripts/find-missing-assets.js
```

**Output:**
- Lists all assets still using Figma URLs
- Creates `scripts/missing-assets.json` with details

## Manual Download for Missing Assets

For the 32 assets that failed to download (see `scripts/missing-assets.json`):

1. Open your Figma file: `uKoCerq5o10oACndFqsyPw`
2. Use the asset IDs from `missing-assets.json`
3. Export the assets from Figma:
   - Select the element in Figma
   - Use the Export panel (right side)
   - Export as SVG (for icons) or PNG (for images)
4. Save to appropriate folder:
   - Icons → `public/assets/icons/[name].svg`
   - Images → `public/assets/images/[name].png`
5. Update the constant in `App.tsx`:
   ```typescript
   const CHECK_ICON = '/assets/icons/check.svg'
   ```

## Asset Organization

- **Icons**: `public/assets/icons/` - Small SVG icons for UI elements
- **Images**: `public/assets/images/` - Larger PNG/JPG images, photos, illustrations

## Using Local Assets

In your code, reference assets like this:
```typescript
const CHECK_ICON = '/assets/icons/check.svg'
const CITY_IMAGE = '/assets/images/city.png'
```

In Vite, files in the `public` folder are served from the root, so `/assets/icons/check.svg` works directly.

## Next Steps

1. Review `scripts/missing-assets.json` for assets that need manual download
2. Download missing assets from Figma
3. Update the constants in `App.tsx` with local paths
4. Test that all assets load correctly

