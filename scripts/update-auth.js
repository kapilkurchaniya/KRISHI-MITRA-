const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      getFiles(file, files);
    } else {
      if (file.endsWith('.ts')) files.push(file);
    }
  }
  return files;
}

const files = getFiles(path.join(__dirname, '../app/api'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('supabase.auth.getUser()')) {
    if (!content.includes('@clerk/nextjs/server')) {
      content = 'import { auth } from "@clerk/nextjs/server"\n' + content;
    }
    
    content = content.replace(/const\s*{\s*data\s*:\s*{\s*user\s*}\s*,?\s*}\s*=\s*await\s*supabase\.auth\.getUser\(\)/g, 'const { userId } = await auth()');
    
    content = content.replace(/user\?\.id/g, 'userId');
    content = content.replace(/user\.id/g, 'userId');
    content = content.replace(/if\s*\(\!user\)/g, 'if (!userId)');
    content = content.replace(/if\s*\(user\)/g, 'if (userId)');
    
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
