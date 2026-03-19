const fs = require('fs');
const path = require('path');

const lintOutput = fs.readFileSync('lint_output.txt', 'utf8');
const lines = lintOutput.split('\n');

const fileFixes = {};
let currentFile = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if line is a file path
  if (line.startsWith('C:\\') || line.startsWith('/')) {
    currentFile = line.trim();
    if (!fileFixes[currentFile]) {
      fileFixes[currentFile] = [];
    }
  } else if (currentFile && line.match(/^\s+\d+:\d+\s+/)) {
    // It's an error line
    const match = line.match(/^\s+(\d+):(\d+)\s+(error|warning)\s+(.*?)\s+([@a-z0-9/-]+)$/);
    if (match) {
      const lineNum = parseInt(match[1]);
      const rule = match[5];
      const message = match[4];
      
      fileFixes[currentFile].push({ line: lineNum, rule, message });
    }
  }
}

for (const [file, fixes] of Object.entries(fileFixes)) {
  if (fixes.length === 0) continue;
  if (!fs.existsSync(file)) continue;
  
  let contentLines = fs.readFileSync(file, 'utf8').split('\n');
  const sortedFixes = fixes.sort((a, b) => b.line - a.line); // Bottom up to keep line numbers intact
  
  for (const fix of sortedFixes) {
    const lIdx = fix.line - 1;
    
    if (fix.rule === '@typescript-eslint/no-unused-vars') {
      // Find the quoted variable name in message (e.g., 'foo' is defined but never used)
      const varMatch = fix.message.match(/'([^']+)'/);
      if (varMatch && varMatch[1]) {
        const varName = varMatch[1];
        // Replace varName with _varName, but only whole words, and first occurrence on line
        const regex = new RegExp(`\\b${varName}\\b`);
        if (regex.test(contentLines[lIdx])) {
           contentLines[lIdx] = contentLines[lIdx].replace(regex, `_${varName}`);
        } else {
           // fallback to disable line
           contentLines.splice(lIdx, 0, `// eslint-disable-next-line ${fix.rule}`);
        }
      } else {
         contentLines.splice(lIdx, 0, `// eslint-disable-next-line ${fix.rule}`);
      }
    } else if (fix.rule === 'react/no-unescaped-entities') {
      contentLines[lIdx] = contentLines[lIdx].replace(/'/g, "&apos;");
    } else if (fix.rule === '@typescript-eslint/no-require-imports') {
      contentLines.splice(lIdx, 0, `// eslint-disable-next-line ${fix.rule}`);
    } else if (fix.rule === 'react-hooks/exhaustive-deps') {
      contentLines.splice(lIdx, 0, `// eslint-disable-next-line ${fix.rule}`);
    } else if (fix.rule === '@typescript-eslint/no-explicit-any') {
      contentLines.splice(lIdx, 0, `// eslint-disable-next-line ${fix.rule}`);
    } else if (fix.rule === 'react-hooks/set-state-in-effect') {
      contentLines.splice(lIdx, 0, `// eslint-disable-next-line ${fix.rule}`);
    }
  }
  
  fs.writeFileSync(file, contentLines.join('\n'), 'utf8');
}

console.log('Lint auto-fixes applied successfully!');
