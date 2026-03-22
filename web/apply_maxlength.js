const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<textarea')) {
        let newContent = content.replace(/<textarea((?!maxLength)[\s\S])*?>/g, (match) => {
          if (match.includes('maxLength')) return match;
          return match.replace('<textarea', '<textarea maxLength={500}');
        });
        if (newContent !== content) {
          fs.writeFileSync(fullPath, newContent);
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  }
}

processDir('C:\\HANDI\\web\\components');
