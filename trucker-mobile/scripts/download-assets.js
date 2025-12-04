/**
 * Script to download Figma assets and save them locally
 * 
 * Usage:
 * 1. Extract all Figma asset URLs from App.tsx
 * 2. Run: node scripts/download-assets.js
 * 
 * This script will:
 * - Download each asset from Figma
 * - Save it to public/assets/icons/ or public/assets/images/
 * - Generate a mapping file for updating App.tsx
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Asset mappings: URL -> local path
const assets = [
  // Icons
  { url: 'https://www.figma.com/api/mcp/asset/f75d41e3-eb12-4b48-ad04-3324c2f76beb', name: 'check.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/8b346984-2039-491c-a9f7-062556f14acd', name: 'current-jobs.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/0562a504-935f-48a2-be75-73df57c6b04a', name: 'bid.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/ccd02ee9-de64-4e63-ae1b-f465ea7a924e', name: 'revenue.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/0fb0bfc5-7fcd-4940-92f8-2848dc25712f', name: 'history.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/3ec529c7-bd38-418f-9631-14876af1286f', name: 'search.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/0a6b0846-f9c6-4499-a416-364395381992', name: 'clock.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/a1b71ec0-5eca-47ed-9e61-b2545fa999a4', name: 'route-start.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/7b36cda2-8cc5-4e7f-9e4f-e0a439ebb7ad', name: 'route-stops.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/c3bc2d9c-a88e-4d2f-91f6-0b44353267ab', name: 'route-dest.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/cbe49b46-8559-4750-b4c2-fbb6d3fb8d9d', name: 'price.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/25ac085f-fc0e-4a8a-99da-83bec1c9c5e8', name: 'nav-home.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/2940a263-2a86-42ba-a033-9524728aa3b0', name: 'nav-chat.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/62f3531c-d4c2-429a-b9d0-ac3daae777a9', name: 'nav-settings.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/131e47a4-8d53-445c-8092-0dd120ec4b44', name: 'back.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/6cd8f830-0a27-412a-912e-2cc92e82c18b', name: 'search-icon.svg', type: 'icon' },
  
  // Images
  { url: 'https://www.figma.com/api/mcp/asset/2cf2f60d-d00d-4152-adff-d7ac97ae5f33', name: 'city.png', type: 'image' },
  { url: 'https://www.figma.com/api/mcp/asset/b5239a0d-16e2-4701-842f-fa559594c084', name: 'truck.png', type: 'image' },
  { url: 'https://www.figma.com/api/mcp/asset/1fce35bc-df13-4cc4-8c50-2a190b6eaa21', name: 'map-pin.png', type: 'image' },
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function downloadAssets() {
  console.log('Starting asset download...\n');
  
  const mappings = {};
  
  for (const asset of assets) {
    const dir = asset.type === 'icon' ? 'icons' : 'images';
    const localPath = path.join(rootDir, 'public', 'assets', dir, asset.name);
    const publicPath = `/assets/${dir}/${asset.name}`;
    
    try {
      console.log(`Downloading: ${asset.name}...`);
      await downloadFile(asset.url, localPath);
      mappings[asset.url] = publicPath;
      console.log(`✓ Saved to: ${publicPath}\n`);
    } catch (error) {
      console.error(`✗ Failed to download ${asset.name}: ${error.message}\n`);
    }
  }
  
  // Save mapping for reference
  const mappingPath = path.join(rootDir, 'scripts', 'asset-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mappings, null, 2));
  console.log(`\nAsset mapping saved to: ${mappingPath}`);
  console.log('\nDownload complete! Update App.tsx to use local paths.');
}

downloadAssets().catch(console.error);











