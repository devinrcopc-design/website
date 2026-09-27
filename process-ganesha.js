import sharp from 'sharp';
import fs from 'fs';

async function processGanesha() {
  const inputPath = 'src/assets/images/ganesha_hero_1790477520612.jpg';
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  
  // Create RGBA buffer
  const rgba = new Uint8Array(width * height * 4);
  
  // Background reference color from corners
  const bgR = 1, bgG = 6, bgB = 16;
  
  // Visited array for BFS
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0, qTail = 0;
  
  function getDiff(idx) {
    const r = data[idx * 3];
    const g = data[idx * 3 + 1];
    const b = data[idx * 3 + 2];
    return Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
  }

  function isBg(idx) {
    const r = data[idx * 3];
    const g = data[idx * 3 + 1];
    const b = data[idx * 3 + 2];
    const diff = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
    const maxVal = Math.max(r, g, b);
    // Background threshold
    return diff < 45 && maxVal < 48;
  }

  // Seed BFS from all borders
  for (let x = 0; x < width; x++) {
    const idxTop = x;
    if (isBg(idxTop) && !visited[idxTop]) { visited[idxTop] = 1; queue[qTail++] = idxTop; }
    const idxBottom = (height - 1) * width + x;
    if (isBg(idxBottom) && !visited[idxBottom]) { visited[idxBottom] = 1; queue[qTail++] = idxBottom; }
  }
  for (let y = 0; y < height; y++) {
    const idxLeft = y * width;
    if (isBg(idxLeft) && !visited[idxLeft]) { visited[idxLeft] = 1; queue[qTail++] = idxLeft; }
    const idxRight = y * width + (width - 1);
    if (isBg(idxRight) && !visited[idxRight]) { visited[idxRight] = 1; queue[qTail++] = idxRight; }
  }

  // BFS flood-fill for outer background
  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1
    ];

    for (const n of neighbors) {
      if (n >= 0 && !visited[n] && isBg(n)) {
        visited[n] = 1;
        queue[qTail++] = n;
      }
    }
  }

  // Build initial binary mask
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    mask[i] = visited[i] ? 0 : 255;
  }

  // Also handle soft transition on borders of the mask (antialiasing)
  // For pixels in the mask boundary, ramp alpha smoothly based on color distance / brightness
  const finalAlpha = new Uint8Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (visited[idx]) {
        finalAlpha[idx] = 0;
      } else {
        // Check if near background
        const r = data[idx * 3];
        const g = data[idx * 3 + 1];
        const b = data[idx * 3 + 2];
        const diff = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
        const maxVal = Math.max(r, g, b);
        
        // If close to transition threshold, compute soft alpha
        if (diff < 65 && maxVal < 68) {
          const t = Math.max(0, Math.min(1, (diff - 25) / 40));
          finalAlpha[idx] = Math.round(t * 255);
        } else {
          finalAlpha[idx] = 255;
        }

        // Fade bottom 15 rows smoothly if needed
        if (y > height - 20) {
          const fade = (height - 1 - y) / 20;
          finalAlpha[idx] = Math.min(finalAlpha[idx], Math.round(fade * 255));
        }
      }
    }
  }

  // Construct RGBA
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = finalAlpha[i];
  }

  // Save as high-res PNG and optimized WebP
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png()
    .toFile('assets/ganesha-hero.png');

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 90 })
    .toFile('assets/ganesha-hero.webp');

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .resize(600)
    .webp({ quality: 85, alphaQuality: 85 })
    .toFile('assets/ganesha-hero-mobile.webp');

  console.log('Successfully saved transparent ganesha-hero images!');
}

processGanesha().catch(console.error);
