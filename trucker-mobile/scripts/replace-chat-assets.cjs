const fs = require('fs');
const path = require('path');

const mapping = JSON.parse(fs.readFileSync('scripts/chat-assets-mapping.json', 'utf8'));

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

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Replace all Figma URLs with local paths
  Object.keys(mapping).forEach(key => {
    if (key.startsWith('https://')) {
      const localPath = mapping[key];
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(key)) {
        content = content.replace(regex, localPath);
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  } else {
    console.log(`No changes: ${file}`);
  }
});

console.log('\nAll files processed!');










