# Downloading Figma Assets

This guide explains how to download graphics from Figma and use them locally instead of the temporary Figma URLs.

## Why Download Assets?

- Figma asset URLs expire after 7 days
- Better performance (local assets load faster)
- Works offline
- Version control friendly

## Steps to Download Assets

### Option 1: Using Figma MCP Tool (Recommended)

You can use the Figma MCP tool to fetch and save assets directly. The tool can download assets from the Figma API and save them to your project.

### Option 2: Manual Download from Figma

1. Open your Figma file: `uKoCerq5o10oACndFqsyPw`
2. Select the frame/element with the image you need
3. Right-click → "Copy/Paste as" → "Copy as PNG/SVG" or use "Export" in the right panel
4. Save to `public/assets/icons/` or `public/assets/images/` with a descriptive name

### Option 3: Bulk Download Script

You can create a script to download all assets at once using the Figma API.

## Asset Organization

- **Icons**: `public/assets/icons/` - Small icons and UI elements
- **Images**: `public/assets/images/` - Larger images, photos, illustrations

## Using Local Assets in Code

Instead of:
```typescript
const CHECK_ICON = 'https://www.figma.com/api/mcp/asset/f75d41e3-eb12-4b48-ad04-3324c2f76beb'
```

Use:
```typescript
const CHECK_ICON = '/assets/icons/check.svg'
```

In Vite, files in the `public` folder are served from the root, so `/assets/icons/check.svg` will work directly.











