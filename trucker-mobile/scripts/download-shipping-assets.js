/**
 * Script to download shipping dashboard assets from Figma
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
  { url: 'https://www.figma.com/api/mcp/asset/8b7ce219-d515-4686-94aa-05aeecbfc9bc', name: 'shipping-home-indicator.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/b64e1a60-c068-4b05-9ab6-c21d4fe263c5', name: 'shipping-arrow-down.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/a1cef4d7-bfef-406c-b7fd-44531ce98731', name: 'shipping-signal.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/f117da0f-8b19-4159-9246-8e95c0ab68f2', name: 'shipping-wifi.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/148e5f96-ec23-41c9-bbda-a2a3b0c279f1', name: 'shipping-battery.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/02d09e57-ebf9-4999-bfd8-84be2b1fefe4', name: 'shipping-arrow-left.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/20fb45a4-39dc-4485-ba0f-b5a5d8fdf5f7', name: 'shipping-divider.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/8aff7a45-c9a5-4139-9161-af74e2d7c465', name: 'shipping-all-jobs-icon.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/c134706b-2841-4eda-92a0-4f0159361d34', name: 'shipping-arrow-up.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/20b37d43-af91-41d5-bad2-3a13899c96b0', name: 'shipping-success-icon.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/91e8ac4b-ebff-41db-b539-a7dc2819faba', name: 'shipping-truck-icon-1.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/15517ad1-a8f5-49e8-a219-03b86f118be6', name: 'shipping-truck-icon-2.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/9a0211e4-2b92-4a66-9575-5fd5a33be339', name: 'shipping-cancel-icon.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/cd467d22-9717-48b7-92e5-fb921e9f0a68', name: 'shipping-nav-before.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/7af8c116-7eae-401b-9449-e7472b59572f', name: 'shipping-nav-next.svg', type: 'icon' },
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
  console.log('Starting shipping asset download...\n');
  
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











