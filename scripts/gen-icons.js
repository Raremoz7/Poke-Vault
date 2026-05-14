// One-off: rasterizes the pokeball mark into PWA PNG icons.
// Run with: node scripts/gen-icons.js
import sharp from 'sharp'
import { writeFileSync } from 'fs'

const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" fill="#0a0a0f"/>
  <circle cx="32" cy="32" r="24" fill="#13131a" stroke="#2a2a3a" stroke-width="2"/>
  <path d="M8 32a24 24 0 0 1 48 0Z" fill="#e63946"/>
  <rect x="8" y="29.5" width="48" height="5" fill="#0a0a0f"/>
  <circle cx="32" cy="32" r="7" fill="#0a0a0f"/>
  <circle cx="32" cy="32" r="3.8" fill="#f0f0f5"/>
</svg>`

const targets = [
  ['public/pwa-192.png', 192],
  ['public/pwa-512.png', 512],
  ['public/apple-touch-icon.png', 180],
]

for (const [path, size] of targets) {
  const buf = await sharp(Buffer.from(svg(size))).resize(size, size).png().toBuffer()
  writeFileSync(path, buf)
  console.log('wrote', path)
}
