const https = require('https');
const fs = require('fs');
const path = require('path');

const fileKey = 'uKoCerq5o10oACndFqsyPw';
const nodeIds = {
  'hero-truck': '3533:222285',
  'card-finance': '3533:221390',
  'card-bidding': '3533:221659',
  'card-shipping': '3533:221783',
  'card-customer': '3533:222009',
  'card-product': '3547:332915',
  'card-vehicle': '3533:222184'
};

const outputDir = path.join(__dirname, '../public/assets/shipping');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlinkSync(filepath);
        reject(err);
      });
    }).on('error', reject);
  });
}

async function getFigmaImageUrl(nodeId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png&scale=2`;
    
    https.get(url, {
      headers: {
        'X-Figma-Token': process.env.FIGMA_TOKEN || ''
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.images && result.images[nodeId]) {
            resolve(result.images[nodeId]);
          } else {
            reject(new Error(`No image URL for node ${nodeId}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading shipping graphics from Figma...\n');
  
  for (const [name, nodeId] of Object.entries(nodeIds)) {
    try {
      console.log(`Processing ${name}...`);
      const imageUrl = await getFigmaImageUrl(nodeId);
      const filepath = path.join(outputDir, `${name}.png`);
      await downloadImage(imageUrl, filepath);
    } catch (error) {
      console.error(`✗ Error downloading ${name}:`, error.message);
    }
  }
  
  console.log('\nDone!');
}

main().catch(console.error);

