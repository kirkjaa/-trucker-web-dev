const fs = require('fs');
const path = require('path');

const files = [
  'chat/chat/src/components/Chat.jsx',
  'chat/chat/src/components/PrivateChat.jsx',
  'chat/chat/src/components/GroupChat.jsx',
  'chat/chat/src/components/ChatSubMenu.jsx',
  'chat/chat/src/components/DeleteConversationDialog.jsx',
  'chat/chat/src/components/FilesAndVideos.jsx',
  'chat/chat/src/components/MemberList.jsx',
  'chat/chat/src/components/AddMember.jsx'
];

const urls = new Set();
const urlToVar = new Map();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach(line => {
    const urlMatch = line.match(/https:\/\/www\.figma\.com\/api\/mcp\/asset\/([a-f0-9-]+)/);
    if (urlMatch) {
      const url = urlMatch[0];
      urls.add(url);
      
      // Extract variable name
      const varMatch = line.match(/const\s+(\w+)\s*=\s*["']https:/);
      if (varMatch) {
        urlToVar.set(url, varMatch[1]);
      }
    }
  });
});

const assets = Array.from(urls).map(url => {
  const assetId = url.match(/\/([a-f0-9-]+)$/)[1];
  const varName = urlToVar.get(url) || `asset-${assetId.substring(0, 8)}`;
  return {
    url,
    id: assetId,
    varName,
    filename: `${varName}.svg` // Assuming SVG, might need to check
  };
});

fs.writeFileSync('scripts/chat-assets.json', JSON.stringify(assets, null, 2));
console.log(`Found ${assets.length} unique assets`);
console.log(JSON.stringify(assets.map(a => ({ id: a.id, varName: a.varName })), null, 2));










