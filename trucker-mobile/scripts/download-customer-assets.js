/**
 * Script to download customer dashboard assets from Figma
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
  { url: 'https://www.figma.com/api/mcp/asset/be830d3a-0f32-409c-bc0b-621fa9463462', name: 'customer-avatar-1.png', type: 'image' },
  { url: 'https://www.figma.com/api/mcp/asset/3b54f8ef-318e-4640-94e5-e81b36cad6d5', name: 'customer-avatar-2.png', type: 'image' },
  { url: 'https://www.figma.com/api/mcp/asset/ffdf7f03-68d1-4174-8aa0-0241d5bb9b74', name: 'customer-avatar-3.png', type: 'image' },
  { url: 'https://www.figma.com/api/mcp/asset/65594697-a14b-4512-ad2c-a610592c628a', name: 'customer-avatar-4.png', type: 'image' },
  { url: 'https://www.figma.com/api/mcp/asset/105504ad-ed22-43cb-956c-9c240e4d07ea', name: 'customer-avatar-5.png', type: 'image' },
  { url: 'https://www.figma.com/api/mcp/asset/366e4652-5542-4f32-9682-150474c87925', name: 'customer-bid-icon.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/0bfbf14b-fe18-4eb2-9b74-a70ce524f92a', name: 'customer-pie-0.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/c212ef2f-1012-4733-bfa2-c3e28e70184d', name: 'customer-pie-1.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/a4d8d4f5-f28e-409e-bafd-0f5126e9942d', name: 'customer-pie-2.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/8c36eaac-1660-4601-bdbc-67fe2ff7286c', name: 'customer-pie-3.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/2c71cbce-e4a6-4772-93ef-c7b3d8be35b9', name: 'customer-pie-4.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/035143c9-b89a-4ac7-9b14-8e83245028f2', name: 'customer-legend-dot-1.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/02bce0bd-3192-4f22-bb02-2398a5dffb6a', name: 'customer-legend-dot-2.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/6ce0db53-9c8a-412d-acca-6d11e80a0f10', name: 'customer-legend-dot-3.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/8b77fbb8-4598-49ff-b54f-1c77f6cb4517', name: 'customer-legend-dot-4.svg', type: 'icon' },
  { url: 'https://www.figma.com/api/mcp/asset/08c7c841-7b9f-4823-90f1-34a33423519b', name: 'customer-legend-dot-5.svg', type: 'icon' },
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
  console.log('Starting customer asset download...\n');
  
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











