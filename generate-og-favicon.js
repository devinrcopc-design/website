import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAssets() {
  // 1. Create the SVG Favicon
  const faviconSvg = `<svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#051326"/>
      <stop offset="100%" stop-color="#082142"/>
    </linearGradient>
    <linearGradient id="p1" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="p2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="p3" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>
    <linearGradient id="p4" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="p5" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Rounded Container for Apple Icon & Favicon -->
  <rect width="128" height="128" rx="28" fill="url(#bg)"/>
  <rect width="126" height="126" x="1" y="1" rx="27" stroke="rgba(56, 189, 248, 0.3)" stroke-width="2"/>
  
  <!-- 5-Petal Radiant Lotus -->
  <g transform="translate(14, 16) scale(2.5)" filter="url(#glow)">
    <!-- Center petal -->
    <path d="M20 34 C18 25, 14 14, 20 6 C26 14, 22 25, 20 34 Z" fill="url(#p3)"/>
    <!-- Inner Left petal -->
    <path d="M20 34 C16 26, 9 19, 11 11 C18 13, 20 22, 20 34 Z" fill="url(#p2)"/>
    <!-- Inner Right petal -->
    <path d="M20 34 C24 26, 31 19, 29 11 C22 13, 20 22, 20 34 Z" fill="url(#p4)"/>
    <!-- Outer Left petal -->
    <path d="M20 34 C14 28, 4 24, 4 17 C11 17, 17 25, 20 34 Z" fill="url(#p1)"/>
    <!-- Outer Right petal -->
    <path d="M20 34 C26 28, 36 24, 36 17 C29 17, 23 25, 20 34 Z" fill="url(#p5)"/>
  </g>
</svg>`;

  fs.writeFileSync('assets/favicon.svg', faviconSvg);
  console.log('Saved assets/favicon.svg');

  // 2. Generate PNG Favicons & Apple Touch Icon from the SVG
  const svgBuffer = Buffer.from(faviconSvg);

  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('assets/favicon-32x32.png');
  console.log('Saved assets/favicon-32x32.png');

  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile('favicon.ico');
  console.log('Saved favicon.ico');

  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('assets/apple-touch-icon.png');
  console.log('Saved assets/apple-touch-icon.png');

  // 3. Build high-fidelity 1200x630 OpenGraph (OG) image
  // We composite:
  // - Background: Rich dark navy gradient with ambient cyan aura
  // - Left: DevinRC logo, Title, Tagline, Service pills, Google Partner badge
  // - Right: Lord Ganesha transparent artwork with glowing golden aura

  const ogWidth = 1200;
  const ogHeight = 630;

  // Resize ganesha hero image for the OG card right side (around 520px height)
  const ganeshaOgBuffer = await sharp('assets/ganesha-hero.png')
    .resize({ height: 530, fit: 'inside' })
    .png()
    .toBuffer();

  const ogVectorOverlay = `<svg width="${ogWidth}" height="${ogHeight}" viewBox="0 0 ${ogWidth} ${ogHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#030c18"/>
        <stop offset="35%" stop-color="#051326"/>
        <stop offset="70%" stop-color="#071b38"/>
        <stop offset="100%" stop-color="#0a254b"/>
      </linearGradient>
      <linearGradient id="txtGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#7dd3fc"/>
        <stop offset="50%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#60a5fa"/>
      </linearGradient>
      <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#051326" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="p1" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="p2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0ea5e9"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
      <linearGradient id="p3" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#2563eb"/>
        <stop offset="100%" stop-color="#60a5fa"/>
      </linearGradient>
      <linearGradient id="p4" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#2563eb"/>
        <stop offset="100%" stop-color="#0ea5e9"/>
      </linearGradient>
      <linearGradient id="p5" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#1d4ed8"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bgGrad)"/>

    <!-- Subtle accent flow wave -->
    <path d="M-50 560 C300 520, 600 440, 1250 540" stroke="rgba(56, 189, 248, 0.2)" stroke-width="2.5" fill="none"/>
    <path d="M-50 590 C400 560, 800 480, 1250 580" stroke="rgba(37, 99, 235, 0.25)" stroke-width="2" fill="none"/>

    <!-- Golden halo behind Ganesha area -->
    <circle cx="910" cy="315" r="280" fill="url(#auraGlow)"/>

    <!-- Left Content Box -->
    <g transform="translate(80, 75)">
      <!-- Top Lotus Mark & Brand -->
      <g transform="translate(0, 0)">
        <!-- 5 Petal Lotus -->
        <g transform="translate(0, 0) scale(1.2)">
          <path d="M20 34 C18 25, 14 14, 20 6 C26 14, 22 25, 20 34 Z" fill="url(#p3)"/>
          <path d="M20 34 C16 26, 9 19, 11 11 C18 13, 20 22, 20 34 Z" fill="url(#p2)"/>
          <path d="M20 34 C24 26, 31 19, 29 11 C22 13, 20 22, 20 34 Z" fill="url(#p4)"/>
          <path d="M20 34 C14 28, 4 24, 4 17 C11 17, 17 25, 20 34 Z" fill="url(#p1)"/>
          <path d="M20 34 C26 28, 36 24, 36 17 C29 17, 23 25, 20 34 Z" fill="url(#p5)"/>
        </g>
        <text x="60" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="-1">devin<tspan fill="url(#txtGrad)">rc</tspan></text>
        <text x="60" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="1">IT · DIGITAL MARKETING · GOOGLE ADS</text>
      </g>

      <!-- Kicker -->
      <text x="0" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" letter-spacing="2">YOUR GROWTH | OUR TECHNOLOGY | TOGETHER</text>

      <!-- Main Headline -->
      <text x="0" y="172" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="900" fill="#ffffff" letter-spacing="-1.5">IT &amp; Digital Marketing</text>
      <text x="0" y="228" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" fill="url(#txtGrad)" letter-spacing="-1">Services Provider</text>

      <!-- Subtext -->
      <text x="0" y="280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="400" fill="#cbd5e1">Delivering high-performance IT solutions, Google Ads campaigns,</text>
      <text x="0" y="308" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="400" fill="#cbd5e1">and digital marketing strategies that drive real business growth.</text>

      <!-- Service Badges -->
      <g transform="translate(0, 345)">
        <!-- Badge 1: Web & App Dev -->
        <rect x="0" y="0" width="165" height="42" rx="21" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(56, 189, 248, 0.3)"/>
        <text x="18" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">⚡ Web &amp; App Dev</text>

        <!-- Badge 2: Google Ads -->
        <rect x="177" y="0" width="150" height="42" rx="21" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(56, 189, 248, 0.3)"/>
        <text x="195" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">🎯 Google Ads</text>

        <!-- Badge 3: SEO & Growth -->
        <rect x="339" y="0" width="165" height="42" rx="21" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(56, 189, 248, 0.3)"/>
        <text x="357" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">📈 SEO &amp; Growth</text>
      </g>

      <!-- Bottom verification footer on card -->
      <g transform="translate(0, 422)">
        <circle cx="10" cy="10" r="8" fill="#10b981"/>
        <path d="M6 10 L9 13 L14 7" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="26" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#ffffff">Certified Google Ads Partner</text>
        <text x="260" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#94a3b8">·  Global &amp; India Enterprise Support</text>
        <text x="560" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#38bdf8">devinrc.com</text>
      </g>
    </g>

    <!-- Clean glass border framing the card -->
    <rect x="2" y="2" width="${ogWidth - 4}" height="${ogHeight - 4}" rx="0" stroke="rgba(56, 189, 248, 0.25)" stroke-width="2" fill="none"/>
  </svg>`;

  // Composite the base card with Lord Ganesha artwork
  const ogBaseBuffer = await sharp(Buffer.from(ogVectorOverlay))
    .png()
    .toBuffer();

  const ganeshaMetadata = await sharp(ganeshaOgBuffer).metadata();
  // Align Ganesha vertically centered on the right
  const ganeshaLeft = ogWidth - ganeshaMetadata.width - 40;
  const ganeshaTop = Math.round((ogHeight - ganeshaMetadata.height) / 2);

  await sharp(ogBaseBuffer)
    .composite([
      {
        input: ganeshaOgBuffer,
        left: ganeshaLeft,
        top: ganeshaTop,
      }
    ])
    .png()
    .toFile('assets/og-image.png');
  console.log('Saved assets/og-image.png (1200x630)');

  await sharp('assets/og-image.png')
    .webp({ quality: 90 })
    .toFile('assets/og-image.webp');
  console.log('Saved assets/og-image.webp (1200x630)');
}

generateAssets().catch(console.error);
