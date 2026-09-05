import * as THREE from 'three';
import { ProfileSettings } from '../types';

/**
 * Creates a high-resolution CanvasTexture for the 3D Card
 * Layout based on kartu.glb UV coordinates:
 * - Left half (U: 0.0 - 0.5): Front Face (Photo, Name, Role, Status)
 * - Right half (U: 0.5 - 1.0): Back Face (Tech details, QR/Barcode, Verified)
 */
export function createProfileCardTexture(
  profile: ProfileSettings,
  photoImg?: HTMLImageElement | null
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Clear background
  ctx.fillStyle = '#060910';
  ctx.fillRect(0, 0, 2048, 2048);

  // ==========================================
  // FRONT FACE: Left Half (x: 40 to 984, y: 40 to 1480)
  // ==========================================
  const frontX = 50;
  const frontY = 50;
  const frontW = 924;
  const frontH = 1440;
  const cornerRadius = 56;

  // Front Card Background
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frontX, frontY, frontW, frontH, cornerRadius);
  ctx.clip();

  // Gradient background
  const bgGrad = ctx.createLinearGradient(frontX, frontY, frontX + frontW, frontY + frontH);
  bgGrad.addColorStop(0, '#0c121e');
  bgGrad.addColorStop(0.5, '#070a12');
  bgGrad.addColorStop(1, '#04060a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(frontX, frontY, frontW, frontH);

  // If photo is loaded, draw full portrait photo covering the entire card
  if (photoImg && photoImg.complete && photoImg.naturalWidth > 0) {
    const photoH = frontH;
    const photoY = frontY;
    
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(frontX, photoY, frontW, photoH, cornerRadius);
    ctx.clip();
    
    // Draw photo maintaining aspect ratio
    const imgRatio = photoImg.naturalWidth / photoImg.naturalHeight;
    const boxRatio = frontW / photoH;
    let sW = photoImg.naturalWidth;
    let sH = photoImg.naturalHeight;
    let sX = 0;
    let sY = 0;

    if (imgRatio > boxRatio) {
      sW = sH * boxRatio;
      sX = (photoImg.naturalWidth - sW) / 2;
    } else {
      sH = sW / boxRatio;
      sY = (photoImg.naturalHeight - sH) / 2;
    }

    ctx.drawImage(photoImg, sX, sY, sW, sH, frontX, photoY, frontW, photoH);

    // Smooth dark vignette at the bottom for typography contrast
    const photoVignette = ctx.createLinearGradient(frontX, photoY + photoH * 0.45, frontX, photoY + photoH);
    photoVignette.addColorStop(0, 'rgba(4, 6, 10, 0)');
    photoVignette.addColorStop(0.6, 'rgba(4, 6, 10, 0.75)');
    photoVignette.addColorStop(0.85, 'rgba(4, 6, 10, 0.95)');
    photoVignette.addColorStop(1, '#04060a');
    ctx.fillStyle = photoVignette;
    ctx.fillRect(frontX, photoY, frontW, photoH);

    ctx.restore();
  }

  // Front Typography at the bottom matching reference image
  const textCenterY = frontY + frontH - 180;
  
  // Title: "FullStack"
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 88px "Inter", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 24;
  ctx.fillText('FullStack', frontX + frontW / 2, textCenterY);

  // Subtitle: "Web Developer"
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 50px "Inter", "Segoe UI", sans-serif';
  ctx.shadowBlur = 18;
  ctx.fillText('Web Developer', frontX + frontW / 2, textCenterY + 68);
  ctx.shadowBlur = 0;

  ctx.restore();

  // Front Card Outer Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(frontX, frontY, frontW, frontH, cornerRadius);
  ctx.stroke();

  // ==========================================
  // BACK FACE: Right Half (x: 1084 to 1988, y: 50 to 1490)
  // ==========================================
  const backX = 1074;
  const backY = 50;
  const backW = 924;
  const backH = 1440;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(backX, backY, backW, backH, cornerRadius);
  ctx.clip();

  // Back Card Background
  const backGrad = ctx.createLinearGradient(backX, backY, backX + backW, backY + backH);
  backGrad.addColorStop(0, '#0a101d');
  backGrad.addColorStop(0.5, '#070a12');
  backGrad.addColorStop(1, '#04060a');
  ctx.fillStyle = backGrad;
  ctx.fillRect(backX, backY, backW, backH);

  // Ornate tech geometric pattern
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.12)';
  ctx.lineWidth = 2;
  for (let r = 50; r < 500; r += 50) {
    ctx.beginPath();
    ctx.arc(backX + backW / 2, backY + backH / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Back Header: DEV ID PASS
  ctx.fillStyle = '#34d399';
  ctx.font = '900 34px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DEV ID PASS • 2026', backX + backW / 2, backY + 160);

  // Name & Handle
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 54px "Inter", sans-serif';
  ctx.fillText(profile.name || 'Jupri Eka Pratama', backX + backW / 2, backY + 260);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 30px "Courier New", monospace';
  ctx.fillText(profile.handle || '@juprieka', backX + backW / 2, backY + 315);

  // Decorative Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(backX + 80, backY + 365);
  ctx.lineTo(backX + backW - 80, backY + 365);
  ctx.stroke();

  // Core Tech Skills Pills
  const skills = ['React', 'TypeScript', 'Node.js', 'Go', 'PostgreSQL', 'Docker', 'Three.js', 'Tailwind'];
  ctx.font = 'bold 24px "Courier New", monospace';
  let pillX = backX + 80;
  let pillY = backY + 425;

  skills.forEach((sk) => {
    const textW = ctx.measureText(sk).width;
    const pW = textW + 38;
    if (pillX + pW > backX + backW - 80) {
      pillX = backX + 80;
      pillY += 65;
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pW, 48, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'left';
    ctx.fillText(sk, pillX + 19, pillY + 33);

    pillX += pW + 16;
  });

  // Location & Contact box
  const infoBoxY = backY + 710;
  ctx.fillStyle = 'rgba(9, 13, 22, 0.85)';
  ctx.beginPath();
  ctx.roundRect(backX + 80, infoBoxY, backW - 160, 210, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('LOC : ' + (profile.location || 'Sangatta, East Kalimantan (WITA)'), backX + 110, infoBoxY + 68);
  ctx.fillText('MAIL: ' + (profile.email || 'jupriekapratama@gmail.com'), backX + 110, infoBoxY + 125);
  ctx.fillText('SPEC: Cloud, Full-stack & High-Scale Systems', backX + 110, infoBoxY + 172);

  // Stylized Barcode at bottom
  const barY = backY + backH - 240;
  const barH = 75;
  const barStartX = backX + 120;
  
  ctx.fillStyle = '#ffffff';
  let curX = barStartX;
  const barPattern = [4, 2, 8, 3, 2, 6, 2, 4, 10, 2, 3, 6, 4, 2, 8, 4, 3, 2, 7, 3, 4, 2, 9, 2, 4, 6, 3];
  barPattern.forEach((w, idx) => {
    if (idx % 2 === 0) {
      ctx.fillRect(curX, barY, w * 2.8, barH);
    }
    curX += w * 2.8 + 4;
  });

  ctx.fillStyle = '#64748b';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AUTH #8829-OPS-VERIFIED-SYSTEM', backX + backW / 2, barY + barH + 38);

  ctx.restore();

  // Back Card Outer Border
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(backX, backY, backW, backH, cornerRadius);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** One eight-unit print run, with an unprinted fabric section at the clip. */
export function createLanyardBandTexture(brandText = 'JUPRI EKA PRATAMA'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = '#181d20';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Low-contrast weave and inset edge stitching remain legible without shimmer.
  ctx.fillStyle = '#202629';
  for (let x = 0; x < canvas.width; x += 12) ctx.fillRect(x, 0, 2, canvas.height);
  ctx.strokeStyle = '#454c50';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([12, 9]);
  for (const y of [9, canvas.height - 9]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#e5e9e9';
  ctx.font = '600 54px "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Print starts 0.7 world units above the ring, clear of the folded tab.
  // Separate full names by fixed distances; never tile or clip a name at the seam.
  for (const start of [0.7, 3.4, 6.1]) {
    let x = canvas.width * start / 8;
    for (const letter of brandText.trim()) {
      ctx.fillText(letter, x, canvas.height / 2);
      x += ctx.measureText(letter).width + 5;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
