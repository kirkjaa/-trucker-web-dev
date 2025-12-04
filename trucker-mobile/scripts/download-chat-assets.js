import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all chat component files and extract Figma asset URLs
const chatComponentsDir = path.join(__dirname, '../chat/chat/src/components');
const files = fs.readdirSync(chatComponentsDir).filter(f => f.endsWith('.jsx'));

const assetUrls = new Set();

files.forEach(file => {
  const content = fs.readFileSync(path.join(chatComponentsDir, file), 'utf-8');
  const matches = content.matchAll(/https:\/\/www\.figma\.com\/api\/mcp\/asset\/([a-f0-9-]+)/g);
  for (const match of matches) {
    assetUrls.add(match[0]);
  }
});

// Write asset URLs to a file for reference
const outputFile = path.join(__dirname, '../chat-assets-urls.txt');
fs.writeFileSync(outputFile, Array.from(assetUrls).join('\n'));

console.log(`Found ${assetUrls.size} unique asset URLs`);
console.log(`Asset URLs written to: ${outputFile}`);

