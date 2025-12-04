/**
 * Script to download only the missing/failed Figma assets
 * Run with: node scripts/download-missing-assets.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Only the assets that are still using Figma URLs in App.tsx (the failed ones)
const missingAssets = [
  // Images
  { url: 'https://www.figma.com/api/mcp/asset/2cf2f60d-d00d-4152-adff-d7ac97ae5f33', name: 'city.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/b5239a0d-16e2-4701-842f-fa559594c084', name: 'truck.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/1fce35bc-df13-4cc4-8c50-2a190b6eaa21', name: 'map-pin.png', dir: 'images' },
  
  // Icons - Home shortcuts
  { url: 'https://www.figma.com/api/mcp/asset/f75d41e3-eb12-4b48-ad04-3324c2f76beb', name: 'check.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/8b346984-2039-491c-a9f7-062556f14acd', name: 'current-jobs.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0562a504-935f-48a2-be75-73df57c6b04a', name: 'bid.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/ccd02ee9-de64-4e63-ae1b-f465ea7a924e', name: 'revenue.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0fb0bfc5-7fcd-4940-92f8-2848dc25712f', name: 'history.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/3ec529c7-bd38-418f-9631-14876af1286f', name: 'search.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0a6b0846-f9c6-4499-a416-364395381992', name: 'clock.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/a1b71ec0-5eca-47ed-9e61-b2545fa999a4', name: 'route-start.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/7b36cda2-8cc5-4e7f-9e4f-e0a439ebb7ad', name: 'route-stops.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/c3bc2d9c-a88e-4d2f-91f6-0b44353267ab', name: 'route-dest.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/cbe49b46-8559-4750-b4c2-fbb6d3fb8d9d', name: 'price.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/25ac085f-fc0e-4a8a-99da-83bec1c9c5e8', name: 'nav-home.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/2940a263-2a86-42ba-a033-9524728aa3b0', name: 'nav-chat.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/62f3531c-d4c2-429a-b9d0-ac3daae777a9', name: 'nav-settings.svg', dir: 'icons' },
  
  // Current Jobs icons
  { url: 'https://www.figma.com/api/mcp/asset/131e47a4-8d53-445c-8092-0dd120ec4b44', name: 'back.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/6cd8f830-0a27-412a-912e-2cc92e82c18b', name: 'search-icon.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/4b681578-c474-489d-9bf6-cdd7811cfa84', name: 'filter.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0cf562f0-624b-48f1-a416-e0dee7deb609', name: 'clock-icon.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0eeb1871-d32f-4d72-96f5-98ba3d576954', name: 'price-icon.svg', dir: 'icons' },
  
  // Terms & Policy icons
  { url: 'https://www.figma.com/api/mcp/asset/82876103-f0f3-4dde-af45-198e0c168755', name: 'terms-close.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/29d08d13-882e-488b-b216-5403231439f3', name: 'terms-signal.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/79ec302e-79c2-4e70-b981-eba5ea655c9f', name: 'terms-wifi.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/dc32a603-ddb0-4921-9dfe-2ea71151f9d8', name: 'terms-battery.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/cbce3cd7-87ca-4c26-842e-50ec32936040', name: 'policy-signal.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/f0e7c079-01de-457f-ba21-c176c4918ffd', name: 'policy-wifi.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/40a43f59-61fc-4e78-8014-4136371d8161', name: 'policy-battery.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/7713e784-19c8-4e2b-a64f-65dbce0db966', name: 'policy-close.svg', dir: 'icons' },
  
  // Settings
  { url: 'https://www.figma.com/api/mcp/asset/b91c04f5-f22a-4273-a34c-63bbed21b2a8', name: 'settings-status-wifi.svg', dir: 'icons' },
  
  // Profile
  { url: 'https://www.figma.com/api/mcp/asset/4693c784-2fe7-4ad2-bd21-7ea2ee935466', name: 'profile-camera.svg', dir: 'icons' },
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    const request = https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    
    request.on('error', (err) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(new Error('Request timeout'));
    });
  });
}

async function downloadMissingAssets() {
  console.log(`Downloading ${missingAssets.length} missing assets...\n`);
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const asset of missingAssets) {
    const localPath = path.join(rootDir, 'public', 'assets', asset.dir, asset.name);
    const publicPath = `/assets/${asset.dir}/${asset.name}`;
    
    // Skip if already exists
    if (fs.existsSync(localPath)) {
      console.log(`⏭️  Already exists: ${asset.name}`);
      results.success.push({ asset, path: publicPath });
      continue;
    }
    
    try {
      console.log(`⬇️  Downloading: ${asset.name}...`);
      await downloadFile(asset.url, localPath);
      results.success.push({ asset, path: publicPath });
      console.log(`✅ Saved: ${publicPath}\n`);
    } catch (error) {
      console.error(`❌ Failed: ${asset.name} - ${error.message}\n`);
      results.failed.push({ asset, error: error.message });
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Successfully downloaded: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed assets:');
    results.failed.forEach(({ asset, error }) => {
      console.log(`  - ${asset.name}: ${error}`);
      console.log(`    URL: ${asset.url}`);
    });
  }
  
  // Generate replacement mapping for App.tsx
  const replacements = {};
  results.success.forEach(({ asset, path: publicPath }) => {
    replacements[asset.url] = publicPath;
  });
  
  const mappingPath = path.join(rootDir, 'scripts', 'missing-assets-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(replacements, null, 2));
  console.log(`\n📄 Replacement mapping saved to: scripts/missing-assets-mapping.json`);
}

downloadMissingAssets().catch(console.error);











