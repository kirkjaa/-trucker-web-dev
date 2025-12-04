/**
 * Script to download all Figma assets and save them locally
 * Run with: node scripts/download-all-assets.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Asset mappings extracted from App.tsx
const assetMappings = [
  // Images
  { url: 'https://www.figma.com/api/mcp/asset/2cf2f60d-d00d-4152-adff-d7ac97ae5f33', name: 'city.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/b5239a0d-16e2-4701-842f-fa559594c084', name: 'truck.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/1fce35bc-df13-4cc4-8c50-2a190b6eaa21', name: 'map-pin.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/28646091-ff81-4489-9829-c6eba4cdfb9c', name: 'map.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/7b24b90d-87db-4ed8-9d81-d29613d0350a', name: 'control-hero-avatar.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/6da08625-03a4-45b0-bd47-0f8b5e590a6d', name: 'profile-avatar.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/7405a5da-d5f7-40f5-a241-75ca5e6add1c', name: 'profile-avatar-alt.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/9f90f157-0aba-41da-8239-4672cade554c', name: 'profile-banner.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/d4425c3c-73a1-4641-bed8-5ac1aebc220f', name: 'vehicle-registration.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/12c296a9-afa0-4f19-9026-02d85b55832f', name: 'vehicle-front.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/aaccb9ca-0b08-4075-a3c5-61a3855c564c', name: 'vehicle-side.png', dir: 'images' },
  { url: 'https://www.figma.com/api/mcp/asset/7e15a66b-ce65-4369-bbab-66ac0077b16e', name: 'vehicle-rear.png', dir: 'images' },
  
  // Icons
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
  { url: 'https://www.figma.com/api/mcp/asset/131e47a4-8d53-445c-8092-0dd120ec4b44', name: 'back.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/6cd8f830-0a27-412a-912e-2cc92e82c18b', name: 'search-icon.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/4b681578-c474-489d-9bf6-cdd7811cfa84', name: 'filter.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0cf562f0-624b-48f1-a416-e0dee7deb609', name: 'clock-icon.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0eeb1871-d32f-4d72-96f5-98ba3d576954', name: 'price-icon.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/48f12e46-9501-491f-b425-0d5ca1b7ca79', name: 'detail-route.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/db1457a6-37bd-4fef-b8a3-086451853d8a', name: 'detail-cargo.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/02b2adc4-46d2-400b-b7ae-7b84dfefbfaa', name: 'report.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/04f95dde-c392-41a5-bab7-9e2589f2847e', name: 'detail-call.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/55335d4f-7cdf-4905-bc8d-b6d7350195c9', name: 'detail-route-action.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/5501887c-9f37-401d-98cf-9c0417138802', name: 'detail-status.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0da1d93f-62ff-4ebb-b47d-92e4c7272db9', name: 'checkin.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/072fa0af-4fad-4d1a-8569-f6e3f515d290', name: 'check-icon.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/9e774361-63d4-4137-870d-666e8d098aff', name: 'success.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0a6b4b74-23f6-4935-8bef-88809f52d786', name: 'camera.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/9e1e3c55-df40-41b2-806c-bc06a55dfe48', name: 'box.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/98d5ffd1-5b6c-49b6-96a6-5f19558f2648', name: 'picker-camera.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/54570fb1-72a3-418b-91ef-be27125d4361', name: 'picker-gallery.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/7bd23998-7b55-459c-9b4e-b0c41d7ecb67', name: 'sop-dialog.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/d441315b-707f-4b87-91cb-cef4a3838932', name: 'sop-camera.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/deaf6753-6e88-4285-a2b6-2b013da5106f', name: 'view-expenses.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/d60e1a77-a0f1-462f-9962-b6ec711865fc', name: 'add-expense.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/9904d5fd-cbed-4eaf-8dc9-2c0289ad7c25', name: 'report-issue.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/7f2a0b8d-e353-4042-acb8-e548b44faa03', name: 'payment-mobile.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/7773317c-8ddc-4d70-93ea-631b5e60bc10', name: 'payment-qr.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/4d2aaeba-ca57-4e53-a2ad-d2ada4f09874', name: 'expenses-confirm.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/a9ad92c7-3d80-45b8-8666-cd6df1f75128', name: 'expenses-coins.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/4208a6b3-a34c-491e-aaaa-1b0d98e685a3', name: 'accept-job-confirm-check.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/82876103-f0f3-4dde-af45-198e0c168755', name: 'terms-close.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/29d08d13-882e-488b-b216-5403231439f3', name: 'terms-signal.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/79ec302e-79c2-4e70-b981-eba5ea655c9f', name: 'terms-wifi.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/dc32a603-ddb0-4921-9dfe-2ea71151f9d8', name: 'terms-battery.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/cbce3cd7-87ca-4c26-842e-50ec32936040', name: 'policy-signal.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/f0e7c079-01de-457f-ba21-c176c4918ffd', name: 'policy-wifi.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/40a43f59-61fc-4e78-8014-4136371d8161', name: 'policy-battery.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/7713e784-19c8-4e2b-a64f-65dbce0db966', name: 'policy-close.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/ef1fca37-f336-4d8a-85ac-4478d7edae13', name: 'settings-status-signal.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/b91c04f5-f22a-4273-a34c-63bbed21b2a8', name: 'settings-status-wifi.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/0f9ce5bc-c40c-427c-927a-9788f2dec939', name: 'settings-status-battery.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/262e0fce-2fac-4830-97ca-ca21d3a089b5', name: 'settings-back.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/10734ae5-80f6-4289-9379-286bc2d8c929', name: 'settings-next.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/d82314eb-cbe3-47e5-a4bb-6da2cf59d919', name: 'settings-profile.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/4386affc-f176-42a5-a9a0-0a4c7ac0ee2e', name: 'settings-delivery.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/d7c998a7-3e31-401b-b639-0c11a21d769c', name: 'settings-activity.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/5f01d1c8-4f2e-472b-a307-2b4fea13e5b5', name: 'settings-language.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/cfb23aaa-a89b-42c3-ae89-dc1aa7dea05b', name: 'settings-info.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/1ea78170-749d-4e03-9b9a-4cc7d39f06ed', name: 'settings-question.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/a9d1599a-08a1-48c8-ab47-2da4c8b62a79', name: 'settings-home-indicator.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/e03fa493-6b2f-498c-9d67-6250a7ef4c16', name: 'settings-logout-power.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/3505d284-8547-4acb-b1b6-a7a3a0b4760d', name: 'delete-account.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/c524407b-f996-468b-af17-3451b2a6e33d', name: 'vehicle-camera.svg', dir: 'icons' },
  { url: 'https://www.figma.com/api/mcp/asset/4693c784-2fe7-4ad2-bd21-7ea2ee935466', name: 'profile-camera.svg', dir: 'icons' },
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

async function downloadAssets() {
  console.log('Starting asset download...\n');
  
  const urlToPath = {};
  let successCount = 0;
  let failCount = 0;
  
  for (const asset of assetMappings) {
    const localPath = path.join(rootDir, 'public', 'assets', asset.dir, asset.name);
    const publicPath = `/assets/${asset.dir}/${asset.name}`;
    
    // Skip if already exists
    if (fs.existsSync(localPath)) {
      console.log(`⏭️  Skipping (exists): ${asset.name}`);
      urlToPath[asset.url] = publicPath;
      continue;
    }
    
    try {
      console.log(`⬇️  Downloading: ${asset.name}...`);
      await downloadFile(asset.url, localPath);
      urlToPath[asset.url] = publicPath;
      successCount++;
      console.log(`✅ Saved: ${publicPath}\n`);
    } catch (error) {
      console.error(`❌ Failed to download ${asset.name}: ${error.message}\n`);
      failCount++;
    }
  }
  
  // Save mapping for reference
  const mappingPath = path.join(rootDir, 'scripts', 'asset-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(urlToPath, null, 2));
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully downloaded: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📄 Asset mapping saved to: scripts/asset-mapping.json`);
  console.log('\nNext step: Update App.tsx to use local paths');
}

downloadAssets().catch(console.error);
