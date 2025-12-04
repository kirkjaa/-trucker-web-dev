/**
 * Script to download assets for Report Issue page from Figma
 * Extracts asset URLs from the design context file and downloads them
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Asset mappings: URL -> local path and name
const assets = [
  // Main image asset (map/location image for partial delivery)
  { 
    url: 'https://www.figma.com/api/mcp/asset/e9ea4b55-f560-43d0-858b-d642b6d7ae5e', 
    name: 'partial-delivery-map.png', 
    type: 'image' 
  },
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function downloadAssets() {
  console.log('Starting asset download for Report Issue page...\n');
  
  const dir = path.join(rootDir, 'public', 'assets');
  const imagesDir = path.join(dir, 'images');
  const iconsDir = path.join(dir, 'icons');
  
  // Ensure directories exist
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
  
  const mappings = {};
  
  for (const asset of assets) {
    const dir = asset.type === 'icon' ? iconsDir : imagesDir;
    const localPath = path.join(dir, asset.name);
    const publicPath = `/assets/${asset.type === 'icon' ? 'icons' : 'images'}/${asset.name}`;
    
    try {
      console.log(`Downloading: ${asset.name}...`);
      await downloadFile(asset.url, localPath);
      mappings[asset.url] = publicPath;
      console.log(`✓ Saved to: ${publicPath}\n`);
    } catch (error) {
      console.error(`✗ Failed to download ${asset.name}: ${error.message}\n`);
    }
  }
  
  console.log('\nDownload complete!');
  console.log('\nNote: Some SVG assets (icons) may need to be extracted separately.');
  console.log('The component will use existing icons from the project where possible.');
  
  return mappings;
}

downloadAssets().catch(console.error);

