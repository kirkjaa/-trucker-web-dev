const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = JSON.parse(fs.readFileSync('scripts/chat-assets.json', 'utf8'));

// Create directory if it doesn't exist
const outputDir = 'public/assets/icons/chat';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadAsset(asset, index, total) {
  return new Promise((resolve, reject) => {
    // Create unique filename based on asset ID
    const filename = `${asset.id}.svg`;
    const filepath = path.join(outputDir, filename);
    
    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`[${index + 1}/${total}] Skipped (exists): ${filename}`);
      resolve({ ...asset, localPath: `/assets/icons/chat/${filename}` });
      return;
    }

    const file = fs.createWriteStream(filepath);
    
    https.get(asset.url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[${index + 1}/${total}] Downloaded: ${filename}`);
          resolve({ ...asset, localPath: `/assets/icons/chat/${filename}` });
        });
      } else {
        file.close();
        fs.unlinkSync(filepath);
        console.error(`[${index + 1}/${total}] Failed: ${filename} (${response.statusCode})`);
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      console.error(`[${index + 1}/${total}] Error: ${filename}`, err.message);
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`Starting download of ${assets.length} assets...\n`);
  
  const results = [];
  const batchSize = 5; // Download 5 at a time to avoid overwhelming
  
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize);
    const promises = batch.map((asset, batchIndex) => 
      downloadAsset(asset, i + batchIndex, assets.length).catch(err => {
        console.error(`Failed to download asset ${asset.id}:`, err.message);
        return { ...asset, localPath: null, error: err.message };
      })
    );
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + batchSize < assets.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Save mapping file
  const mapping = {};
  results.forEach(result => {
    if (result.localPath) {
      // Map by variable name and also by original URL
      mapping[result.varName] = result.localPath;
      mapping[result.url] = result.localPath;
    }
  });
  
  fs.writeFileSync('scripts/chat-assets-mapping.json', JSON.stringify(mapping, null, 2));
  
  const successCount = results.filter(r => r.localPath).length;
  console.log(`\nDownload complete: ${successCount}/${assets.length} assets downloaded`);
  console.log(`Mapping saved to scripts/chat-assets-mapping.json`);
}

downloadAll().catch(console.error);










