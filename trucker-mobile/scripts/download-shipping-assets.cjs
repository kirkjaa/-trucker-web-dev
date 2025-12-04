const https = require('https');
const fs = require('fs');
const path = require('path');

// You can get your Figma token from https://www.figma.com/developers/api#access-tokens
// Set FIGMA_TOKEN environment variable before running this script
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
if (!FIGMA_TOKEN) {
  console.error('Error: FIGMA_TOKEN environment variable is required');
  process.exit(1);
}
const FILE_KEY = 'uKoCerq5o10oACndFqsyPw';

const nodes = {
  'card-finance': '3533:221401',      // Just the illustration group
  'card-bidding': '3533:221727',      // Just the character
  'card-shipping': '3533:221820',     // Just the truck illustration
  'card-customer': '3533:222036',     // Just the customer illustration
  'card-product': '3547:332924',      // Just the product illustration
  'card-vehicle': '3533:222221',      // Just the vehicle illustration
  'hero-truck': '3533:222698'         // Just the truck group
};

const outputDir = path.join(__dirname, '../public/assets/shipping');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`  ✓ Saved ${path.basename(filepath)}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function getImageUrls() {
  const nodeIds = Object.values(nodes).join(',');
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${nodeIds}&format=png&scale=2`;
  
  return new Promise((resolve, reject) => {
    const options = {
      headers: FIGMA_TOKEN ? { 'X-Figma-Token': FIGMA_TOKEN } : {}
    };
    
    https.get(url, options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.err) {
            reject(new Error(result.err));
          } else {
            resolve(result.images || {});
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching image URLs from Figma API...\n');
  
  if (!FIGMA_TOKEN) {
    console.log('⚠️  No FIGMA_TOKEN found. Set it as environment variable for better results.\n');
  }
  
  try {
    const imageUrls = await getImageUrls();
    
    if (Object.keys(imageUrls).length === 0) {
      console.log('❌ No image URLs returned. Make sure FIGMA_TOKEN is set.');
      console.log('   Get your token from: https://www.figma.com/developers/api#access-tokens\n');
      return;
    }
    
    console.log(`Found ${Object.keys(imageUrls).length} images. Downloading...\n`);
    
    for (const [name, nodeId] of Object.entries(nodes)) {
      const imageUrl = imageUrls[nodeId];
      if (imageUrl) {
        const filepath = path.join(outputDir, `${name}.png`);
        console.log(`Downloading ${name}...`);
        await downloadFile(imageUrl, filepath);
      } else {
        console.log(`  ✗ No URL for ${name} (${nodeId})`);
      }
    }
    
    console.log('\n✓ All done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();

