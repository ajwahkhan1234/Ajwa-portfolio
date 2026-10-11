import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/ajwamalik/inovista/node_modules/');
const sharp = require('sharp');
const dir = new URL('./shots/', import.meta.url).pathname;
const files = fs.readdirSync(dir).filter((f) => f.endsWith(process.env.SUF || '-d.png')).sort();
const W = process.env.SUF ? 200 : 360, H = process.env.SUF ? 400 : 225, cols = process.env.SUF ? 9 : 5;
const tiles = await Promise.all(files.map((f) => sharp(dir + f).resize(W, H, { fit: 'cover', position: 'top' }).toBuffer()));
const rows = Math.ceil(files.length / cols);
await sharp({ create: { width: W * cols, height: (H + 20) * rows, channels: 3, background: '#fff' } })
  .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * W, top: Math.floor(i / cols) * (H + 20) + 20 })).concat(files.map((f, i) => ({ input: { text: { text: f, dpi: 90 } }, left: (i % cols) * W + 4, top: Math.floor(i / cols) * (H + 20) + 2 }))))
  .jpeg().toFile(process.argv[2]);
console.log(files.length);
