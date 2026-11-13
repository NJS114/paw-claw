import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const source = 'public/assets/branding/paw-claw-icon-source.webp';
if (!fs.existsSync(source)) throw new Error('Missing committed app icon source');
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
// Packaging only: retain the artwork and encode each platform's declared dimensions.
for (const filename of files('android/app/src/main/res').filter(file => /ic_launcher.*\.png$|splash\.png$/.test(file)).concat(files('ios/App/App/Assets.xcassets').filter(file => /\.png$/.test(file)))) {
  const { width, height } = await sharp(filename).metadata();
  if (!width || !height) throw new Error(`Invalid dimensions: ${filename}`);
  const isSplash = /splash/i.test(filename);
  const iconSize = Math.round(Math.min(width, height) * (isSplash ? .3 : /foreground/.test(filename) ? .68 : 1));
  const icon = await sharp(source).resize(iconSize, iconSize).flatten({ background: '#f4e5c6' }).png().toBuffer();
  await sharp({ create: { width, height, channels: 3, background: '#f4e5c6' } }).composite([{ input: icon, gravity: 'centre' }]).png({ palette: true, quality: 90, effort: 8 }).toFile(`${filename}.tmp`);
  fs.renameSync(`${filename}.tmp`, filename);
}
await sharp(source).resize(256,256).webp({quality:88}).toFile('public/assets/branding/paw-claw-icon.webp');
console.log('Paw & Claw native launcher icons and splash screens packaged.');
