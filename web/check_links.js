const fs = require('fs');
const path = require('path');

const webDir = path.join(__dirname);
const appDir = path.join(webDir, 'app');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  return arrayOfFiles;
}

const allTsxFiles = getAllFiles(webDir);
const links = new Map(); // target -> [files]

const hrefRegex = /href=["']([^"']+)["']/g;
const routerRegex = /router\.push\(["']([^"']+)["']/g;

allTsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
      if (!links.has(match[1])) links.set(match[1], []);
      links.get(match[1]).push(file);
  }
  while ((match = routerRegex.exec(content)) !== null) {
      if (!links.has(match[1])) links.set(match[1], []);
      links.get(match[1]).push(file);
  }
});

function doesRouteExist(routePath) {
    if (routePath === '/') return true;
    if (routePath.startsWith('http') || routePath.startsWith('tel:') || routePath.startsWith('mailto:') || routePath.startsWith('#')) return true;
    
    // Ignore query parameters and hashes for existence check
    let cleanPath = routePath.split('?')[0].split('#')[0];
    if (cleanPath === '') return true; // only hash or query
    
    // Convert e.g. /services/123 to /services/[id] logic check
    // Since it's hard to check dynamic routes programmatically, we'll just check if the base directory exists
    const parts = cleanPath.split('/').filter(Boolean);
    if (parts.length === 0) return true;

    // A simple heuristic: check if the first part exists as a folder or (group) folder inside appDir
    // Or just look through standard app directories
    const getAppDirs = (base) => {
        if(!fs.existsSync(base)) return [];
        let dirs = [];
        fs.readdirSync(base, {withFileTypes: true}).forEach(dirent => {
            if(dirent.isDirectory()) {
                if (dirent.name.startsWith('(') && dirent.name.endsWith(')')) {
                    dirs.push(...getAppDirs(path.join(base, dirent.name)));
                } else {
                    dirs.push(path.join(base, dirent.name));
                }
            }
        });
        return dirs;
    };
    
    let allRoutes = [];
    function scanRoutes(currentPath, currentRoutePath) {
        if(!fs.existsSync(currentPath)) return;
        const items = fs.readdirSync(currentPath, {withFileTypes: true});
        items.forEach(item => {
            if (item.isDirectory()) {
               if (item.name.startsWith('(') && item.name.endsWith(')')) {
                   scanRoutes(path.join(currentPath, item.name), currentRoutePath);
               } else if (item.name.startsWith('[') && item.name.endsWith(']')) {
                   allRoutes.push(currentRoutePath + '/[dynamic]');
                   scanRoutes(path.join(currentPath, item.name), currentRoutePath + '/[dynamic]');
               } else {
                   allRoutes.push(currentRoutePath + '/' + item.name);
                   scanRoutes(path.join(currentPath, item.name), currentRoutePath + '/' + item.name);
               }
            }
        });
    }
    
    scanRoutes(appDir, '');
    
    // Normalize cleanPath
    let checkPath = '';
    for(let i=0; i<parts.length; i++) {
        // Try exact match or dynamic match
        // For simplicity, let's just output ALL links and review manually, 
        // since Next.js routing is complex to fully resolve in a simple script.
    }
}

// Just output all internal links and we can eyeball the suspicious ones
const internalLinks = Array.from(links.keys()).filter(l => l.startsWith('/') && !l.startsWith('//'));
const suspicious = [];
internalLinks.forEach(l => {
    // Check if base path exists
    const base = l.split('/')[1].split('?')[0].split('#')[0];
    const knownBases = ['services', 'providers', 'cart', 'dashboard', 'settings', 'wishlist', 'search', 'deals', 'terms', 'privacy', 'safety', 'login', 'signup', 'help', 'api', 'images', 'official-stores', 'auth', 'vendor', 'admin', 'become-provider', 'forgot-password'];
    if (!knownBases.includes(base) && base !== '') {
        suspicious.push(l);
    }
});

console.log("=== All Internal Links Extracted ===");
internalLinks.sort().forEach(l => console.log(l));

console.log("\n=== Potentially Broken Links (Unknown Base Route) ===");
suspicious.forEach(l => {
    console.log(l, "-> found in:", Array.from(new Set(links.get(l))).map(f => path.basename(f)).join(', '));
});
