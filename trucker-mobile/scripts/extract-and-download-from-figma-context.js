/**
 * Script to extract asset URLs from Figma design context code and download them
 * 
 * Usage:
 * 1. Copy the design context code from the Figma MCP tool output
 * 2. Save it to a file (e.g., figma-design-context.txt) in the scripts folder
 * 3. Run: node scripts/extract-and-download-from-figma-context.js
 * 
 * Or, if you have the asset URLs directly, update the assetUrls object below.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Mapping of asset names to constants and paths
const assetMapping = {
  // From Login screen (2715:146877):
  'city.png': { dir: 'images', constant: 'CITY_IMAGE', nodeId: '2715:146877' },
  'truck.png': { dir: 'images', constant: 'TRUCK_IMAGE', nodeId: '2715:146877' },
  'map-pin.png': { dir: 'images', constant: 'MAP_PIN_IMAGE', nodeId: '2715:146877' },
  
  // From Home screen (2812:213004):
  'current-jobs.svg': { dir: 'icons', constant: 'HOME_SHORTCUT_CURRENT_ICON', nodeId: '2812:213004' },
  'bid.svg': { dir: 'icons', constant: 'HOME_SHORTCUT_BID_ICON', nodeId: '2812:213004' },
  'revenue.svg': { dir: 'icons', constant: 'HOME_SHORTCUT_REVENUE_ICON', nodeId: '2812:213004' },
  'history.svg': { dir: 'icons', constant: 'HOME_SHORTCUT_HISTORY_ICON', nodeId: '2812:213004' },
  'search.svg': { dir: 'icons', constant: 'HOME_SEARCH_ICON', nodeId: '2812:213004' },
  'clock.svg': { dir: 'icons', constant: 'HOME_CLOCK_ICON', nodeId: '2812:213004' },
  'route-start.svg': { dir: 'icons', constant: 'HOME_ROUTE_START_ICON', nodeId: '2812:213004' },
  'route-stops.svg': { dir: 'icons', constant: 'HOME_ROUTE_STOPS_ICON', nodeId: '2812:213004' },
  'route-dest.svg': { dir: 'icons', constant: 'HOME_ROUTE_DEST_ICON', nodeId: '2812:213004' },
  'price.svg': { dir: 'icons', constant: 'HOME_PRICE_ICON', nodeId: '2812:213004' },
  'nav-home.svg': { dir: 'icons', constant: 'HOME_NAV_HOME_ICON', nodeId: '2812:213004' },
  'nav-chat.svg': { dir: 'icons', constant: 'HOME_NAV_CHAT_ICON', nodeId: '2812:213004' },
  'nav-settings.svg': { dir: 'icons', constant: 'HOME_NAV_SETTINGS_ICON', nodeId: '2812:213004' },
};

// TODO: Update this with asset URLs extracted from Figma design context
// The URLs should be in format: https://www.figma.com/api/mcp/asset/[asset-id]
const assetUrls = {
  // Paste the asset URLs here after extracting from Figma design context code
  // Example: 'city.png': 'https://www.figma.com/api/mcp/asset/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
};

// Try to extract URLs from a design context file if it exists
function extractUrlsFromDesignContext() {
  const contextFile = path.join(__dirname, 'figma-design-context.txt');
  if (fs.existsSync(contextFile)) {
    console.log('Reading design context file...');
    const content = fs.readFileSync(contextFile, 'utf8');
    const urlPattern = /https:\/\/www\.figma\.com\/api\/mcp\/asset\/[a-f0-9-]+/gi;
    const urls = content.match(urlPattern) || [];
    console.log(`Found ${urls.length} asset URLs in design context file`);
    return urls;
  }
  return [];
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
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
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(new Error('Request timeout'));
    });
  });
}

async function downloadAssets() {
  console.log('Extracting and downloading assets from Figma...\n');
  
  // Try to extract URLs from design context file
  const extractedUrls = extractUrlsFromDesignContext();
  
  // Map extracted URLs to asset files (this is a simplified mapping - 
  // you may need to manually match URLs to files based on the design context code)
  const urlsToDownload = { ...assetUrls };
  
  // For now, we'll need manual mapping
  if (extractedUrls.length > 0) {
    console.log(`\nFound ${extractedUrls.length} URLs. Please manually map them to asset files.`);
    console.log('\nExtracted URLs:');
    extractedUrls.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    console.log('\nPlease update the assetUrls object in this script with the correct mappings.\n');
  }
  
  const results = { success: [], failed: [] };
  
  for (const [filename, mapping] of Object.entries(assetMapping)) {
    const url = urlsToDownload[filename];
    if (!url) {
      console.log(`⏭️  Skipping ${filename} - URL not provided`);
      continue;
    }
    
    const localPath = path.join(rootDir, 'public', 'assets', mapping.dir, filename);
    const publicPath = `/assets/${mapping.dir}/${filename}`;
    
    // Skip if already exists
    if (fs.existsSync(localPath)) {
      console.log(`⏭️  Already exists: ${filename}`);
      results.success.push({ filename, path: publicPath, constant: mapping.constant });
      continue;
    }
    
    try {
      console.log(`⬇️  Downloading: ${filename}...`);
      await downloadFile(url, localPath);
      results.success.push({ filename, path: publicPath, constant: mapping.constant });
      console.log(`✅ Saved: ${publicPath}\n`);
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}\n`);
      results.failed.push({ filename, error: error.message, url });
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Successfully downloaded: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.success.length > 0) {
    console.log('\n📝 Next step: Update App.tsx to use local paths');
    console.log('\nReplacements needed in App.tsx:');
    results.success.forEach(({ filename, path: publicPath, constant }) => {
      console.log(`  ${constant}: Change from Figma URL to '${publicPath}'`);
    });
  }
}

downloadAssets().catch(console.error);











