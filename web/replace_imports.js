// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

const replacements = [
  { search: '@\/app\/context\/AuthContext', replace: '@/context/AuthContext' },
  { search: '@\/app\/context\/CartContext', replace: '@/context/CartContext' },
  { search: '@\/components\/layout\/Navbar', replace: '@/components/landing-page/Navbar' }
];

let changedFiles = 0;

walkDir(path.join(__dirname, 'app'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  replacements.forEach(r => {
    content = content.split(r.search).join(r.replace);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
    changedFiles++;
  }
});

console.log(`Total files updated: ${changedFiles}`);
