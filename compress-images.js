const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets', 'images');

// Images to compress (large JPGs)
const imagesToCompress = [
  'onboarding-1.jpg',
  'onboarding-2.jpg',
  'onboarding-3.jpg',
  'onboarding-client-1.jpg',
  'onboarding-client-2.jpg',
  'onboarding-client-3.jpg',
  'onboarding-artisan-1.jpg',
  'onboarding-artisan-2.jpg',
  'onboarding-artisan-3.jpg',
  'onboarding-business-1.jpg',
  'onboarding-business-2.jpg',
  'onboarding-business-3.jpg',
  'client-onboarding1.jpg',
];

async function compressImages() {
  for (const imageName of imagesToCompress) {
    const imagePath = path.join(imagesDir, imageName);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`Skipping ${imageName} - file not found`);
      continue;
    }

    const stats = fs.statSync(imagePath);
    const originalSize = stats.size;
    
    console.log(`Compressing ${imageName}... (${(originalSize / 1024).toFixed(0)}KB)`);
    
    try {
      const buffer = await sharp(imagePath)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 60 })
        .toBuffer();
      
      fs.writeFileSync(imagePath, buffer);
      
      const newStats = fs.statSync(imagePath);
      const newSize = newStats.size;
      const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`  -> ${(newSize / 1024).toFixed(0)}KB (saved ${saved}%)`);
    } catch (err) {
      console.error(`Error compressing ${imageName}:`, err.message);
    }
  }
  
  console.log('\nDone!');
}

compressImages();
