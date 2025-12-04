/**
 * Update App.tsx to use local asset paths instead of Figma URLs
 * Run with: node scripts/update-asset-paths.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const mappingPath = path.join(rootDir, 'scripts', 'asset-mapping.json');
const appTsxPath = path.join(rootDir, 'src', 'App.tsx');

if (!fs.existsSync(mappingPath)) {
  console.error('Error: asset-mapping.json not found. Please run download-all-assets.js first.');
  process.exit(1);
}

const mappings = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
let appContent = fs.readFileSync(appTsxPath, 'utf-8');

console.log('Updating asset paths in App.tsx...\n');

let updateCount = 0;

// Create reverse mapping: URL -> local path
const urlToPath = {};
for (const [url, data] of Object.entries(mappings)) {
  urlToPath[url] = data.localPath;
}

// Replace each Figma URL with local path
for (const [url, localPath] of Object.entries(urlToPath)) {
  // Escape special regex characters in URL
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match the URL with quotes around it
  const regex = new RegExp(`'${escapedUrl}'`, 'g');
  
  if (appContent.includes(url)) {
    appContent = appContent.replace(regex, `'${localPath}'`);
    updateCount++;
    console.log(`✓ Updated: ${url.split('/').pop()} → ${localPath}`);
  }
}

// Write updated content
fs.writeFileSync(appTsxPath, appContent);

console.log(`\n=== Update Summary ===`);
console.log(`✓ Updated ${updateCount} asset paths in App.tsx`);
console.log(`\nDone! Assets are now using local paths.`);

