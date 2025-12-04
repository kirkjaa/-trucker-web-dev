/**
 * Find assets that are still using Figma URLs
 * Run with: node scripts/find-missing-assets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const appTsxPath = path.join(rootDir, 'src', 'App.tsx');
const appContent = fs.readFileSync(appTsxPath, 'utf-8');

// Find all Figma URLs
const figmaUrlRegex = /'https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^']+'/g;
const matches = appContent.match(figmaUrlRegex) || [];

console.log('Assets still using Figma URLs:\n');
console.log(`Total: ${matches.length}\n`);

const assetMap = new Map();

matches.forEach((match) => {
  const url = match.replace(/'/g, '');
  const assetId = url.split('/').pop();
  
  // Try to find the constant name before this URL
  const lines = appContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(url)) {
      // Look backwards for const declaration
      for (let j = i; j >= Math.max(0, i - 5); j--) {
        const constMatch = lines[j].match(/const\s+([A-Z_]+)\s*=/);
        if (constMatch) {
          assetMap.set(assetId, {
            constName: constMatch[1],
            url: url,
            line: i + 1
          });
          break;
        }
      }
      break;
    }
  }
});

// Display results
for (const [assetId, info] of assetMap.entries()) {
  console.log(`${info.constName}`);
  console.log(`  URL: ${info.url}`);
  console.log(`  Line: ${info.line}`);
  console.log(`  Asset ID: ${assetId}\n`);
}

// Save to file
const outputPath = path.join(rootDir, 'scripts', 'missing-assets.json');
fs.writeFileSync(outputPath, JSON.stringify(Array.from(assetMap.entries()).map(([id, info]) => ({
  assetId: id,
  ...info
})), null, 2));

console.log(`\nMissing assets list saved to: ${outputPath}`);
console.log('\nThese assets need to be manually downloaded from Figma.');

