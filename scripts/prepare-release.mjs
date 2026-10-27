import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
// Copy the executable alone; generate its checksum without exposing the app folder.
const source = resolve(process.argv[2] || join(root, '../ClipMemo/dist/ClipMemo-v1.5.0-win-x64/ClipMemo.exe'));
const match = /^ClipMemo-v(\d+\.\d+\.\d+)-win-x64$/.exec(basename(dirname(source)));
if (!match || basename(source) !== 'ClipMemo.exe') throw new Error('Expected ClipMemo-vX.Y.Z-win-x64/ClipMemo.exe');
const name = `ClipMemo-v${match[1]}-win-x64.exe`;
const bytes = await readFile(source);
const pe = bytes.length >= 64 ? bytes.readUInt32LE(0x3c) : -1;
if (bytes.toString('ascii', 0, 2) !== 'MZ' || pe < 64 || pe + 6 > bytes.length ||
    bytes.readUInt32LE(pe) !== 0x4550 || bytes.readUInt16LE(pe + 4) !== 0x8664) throw new Error('Expected a Windows x64 executable');
const sha256 = createHash('sha256').update(bytes).digest('hex');
const destination = join(root, 'public/downloads');
await mkdir(destination, { recursive: true });
await copyFile(source, join(destination, name));
await writeFile(join(destination, name + '.sha256'), `${sha256}  ${name}\n`);
const metadata = {
  version: match[1], platform: 'Windows x64', bytes: bytes.length, sha256,
  filename: name, url: '/downloads/' + name, checksumUrl: '/downloads/' + name + '.sha256',
};
await writeFile(join(root, 'public/release.json'), JSON.stringify(metadata, null, 2) + '\n');
console.log(`Prepared ${name} (${bytes.length} bytes)\nSHA-256 ${sha256}`);
