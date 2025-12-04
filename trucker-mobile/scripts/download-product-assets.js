/**
 * Script to download product dashboard assets from Figma
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Asset mappings from Figma design
const assets = [
  { url: 'https://www.figma.com/api/mcp/asset/5b04a815-6a15-493b-b6e1-2d0a8de36b78', name: 'product-pie-0.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/45f9cbd5-7cd1-43a0-9223-1e1b3efe417a', name: 'product-pie-1.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/a98ba61f-d3ba-473b-b300-9516e37497ab', name: 'product-pie-2.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/703d2ce6-cff4-45db-b366-c051ed4a0c4c', name: 'product-pie-3.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/690b4cf9-215c-411a-9507-3e53b1fe06bb', name: 'product-pie-4.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/8bca5dc5-3cd2-48a1-bb4f-8c75725cdd1f', name: 'product-legend-dot-1.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/bd708c30-1380-4030-9924-54db2d449485', name: 'product-legend-dot-2.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/0658cf76-b927-4000-a715-002a85f16da6', name: 'product-legend-dot-3.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/a071c87e-69f6-4368-a7e5-609e0d35eacb', name: 'product-legend-dot-4.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/aebd4a05-f37b-46a7-89ab-211ce8ca40ed', name: 'product-legend-dot-5.svg', type: 'icon' },
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
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
  console.log('Starting product asset download...\n');
  
  for (const asset of assets) {
    const dir = asset.type === 'icon' ? 'icons' : 'images';
    const localPath = path.join(rootDir, 'public', 'assets', dir, asset.name);
    
    // Ensure directory exists
    const dirPath = path.dirname(localPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    try {
      console.log(`Downloading: ${asset.name}...`);
      await downloadFile(asset.url, localPath);
      console.log(`✓ Saved to: ${localPath}\n`);
    } catch (error) {
      console.error(`✗ Failed to download ${asset.name}: ${error.message}\n`);
    }
  }
  
  console.log('\nDownload complete!');
}

downloadAssets().catch(console.error);











