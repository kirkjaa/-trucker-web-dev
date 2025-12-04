/**
 * Script to extract fresh asset URLs from Figma design nodes
 * The Figma MCP tool generates code with asset URLs - this script helps extract them
 * 
 * To use: After calling get_design_context on the Figma nodes, manually copy
 * the asset URLs from the generated code and update this script, then run it.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// TODO: Update these URLs with fresh ones extracted from Figma design context
// The URLs should be in the format: https://www.figma.com/api/mcp/asset/[asset-id]
// These come from the get_design_context output for nodes 2715:146877 and 2812:213004

const freshAssetUrls = {
  // From Login screen (2715:146877):
  'city.png': '',  // Extract from design context for node 2715:146877
  'truck.png': '', // Extract from design context for node 2715:146877  
  'map-pin.png': '', // Extract from design context for node 2715:146877
  
  // From Home screen (2812:213004):
  'current-jobs.svg': '',  // Extract from design context for node 2812:213004
  'bid.svg': '',           // Extract from design context for node 2812:213004
  'revenue.svg': '',       // Extract from design context for node 2812:213004
  'history.svg': '',       // Extract from design context for node 2812:213004
  'search.svg': '',        // Extract from design context for node 2812:213004
  'clock.svg': '',         // Extract from design context for node 2812:213004
  'route-start.svg': '',   // Extract from design context for node 2812:213004
  'route-stops.svg': '',   // Extract from design context for node 2812:213004
  'route-dest.svg': '',    // Extract from design context for node 2812:213004
  'price.svg': '',         // Extract from design context for node 2812:213004
  'nav-home.svg': '',      // Extract from design context for node 2812:213004
  'nav-chat.svg': '',      // Extract from design context for node 2812:213004
  'nav-settings.svg': '',  // Extract from design context for node 2812:213004
};

const assetMapping = {
  // Images (from node 2715:146877)
  'city.png': { dir: 'images', constant: 'CITY_IMAGE' },
  'truck.png': { dir: 'images', constant: 'TRUCK_IMAGE' },
  'map-pin.png': { dir: 'images', constant: 'MAP_PIN_IMAGE' },
  
  // Icons (from node 2812:213004)
  'current-jobs.svg': { dir: 'icons', constant: 'HOME_SHORTCUT_CURRENT_ICON' },
  'bid.svg': { dir: 'icons', constant: 'HOME_SHORTCUT_BID_ICON' },
  'revenue.svg': { dir: 'icons', constant: 'HOME_SHORTCUT_REVENUE_ICON' },
  'history.svg': { dir: 'icons', constant: 'HOME_SHORTCUT_HISTORY_ICON' },
  'search.svg': { dir: 'icons', constant: 'HOME_SEARCH_ICON' },
  'clock.svg': { dir: 'icons', constant: 'HOME_CLOCK_ICON' },
  'route-start.svg': { dir: 'icons', constant: 'HOME_ROUTE_START_ICON' },
  'route-stops.svg': { dir: 'icons', constant: 'HOME_ROUTE_STOPS_ICON' },
  'route-dest.svg': { dir: 'icons', constant: 'HOME_ROUTE_DEST_ICON' },
  'price.svg': { dir: 'icons', constant: 'HOME_PRICE_ICON' },
  'nav-home.svg': { dir: 'icons', constant: 'HOME_NAV_HOME_ICON' },
  'nav-chat.svg': { dir: 'icons', constant: 'HOME_NAV_CHAT_ICON' },
  'nav-settings.svg': { dir: 'icons', constant: 'HOME_NAV_SETTINGS_ICON' },
};

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    if (!url || url.trim() === '') {
      reject(new Error('URL is empty - please update freshAssetUrls with URLs from Figma design context'));
      return;
    }
    
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
  console.log('Extracting and downloading assets from Figma nodes...\n');
  
  const results = { success: [], failed: [] };
  
  for (const [filename, url] of Object.entries(freshAssetUrls)) {
    if (!url || url.trim() === '') {
      console.log(`⏭️  Skipping ${filename} - URL not provided (needs to be extracted from Figma design context)`);
      continue;
    }
    
    const mapping = assetMapping[filename];
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
  
  if (results.failed.length > 0) {
    console.log('\nFailed assets:');
    results.failed.forEach(({ filename, error, url }) => {
      console.log(`  - ${filename}: ${error}`);
      if (url) console.log(`    URL: ${url}`);
    });
  }
  
  if (results.success.length > 0) {
    console.log('\n✅ Successfully downloaded assets:');
    results.success.forEach(({ filename, path: publicPath, constant }) => {
      console.log(`  - ${filename} → ${publicPath}`);
      console.log(`    Constant: ${constant}`);
    });
    
    console.log('\n📝 Next step: Update App.tsx to use local paths instead of Figma URLs');
  }
}

downloadAssets().catch(console.error);











