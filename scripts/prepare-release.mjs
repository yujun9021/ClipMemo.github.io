import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
// Publish only the setup and its checksum, never the payload directory or user data.
let sourcePath = process.argv[2];
if (!sourcePath) {
  const versionSource = await readFile(join(root, '../ClipMemo/src/AssemblyInfo.cs'), 'utf8');
  const current = /AssemblyInformationalVersion\("(\d+\.\d+\.\d+)"\)/.exec(versionSource);
  if (!current) throw new Error('App version is missing; provide the release EXE path explicitly.');
  sourcePath = join(root, `../ClipMemo/dist/ClipMemo-v${current[1]}-win-x64/ClipMemoSetup.exe`);
}
const source = resolve(sourcePath);
const match = /^ClipMemo-v(\d+\.\d+\.\d+)-win-x64$/.exec(basename(dirname(source)));
if (!match || basename(source) !== 'ClipMemoSetup.exe') throw new Error('Expected ClipMemo-vX.Y.Z-win-x64/ClipMemoSetup.exe');
const name = `ClipMemoSetup-v${match[1]}-win-x64.exe`;
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
  version: match[1], kind: 'installer', platform: 'Windows x64', bytes: bytes.length, sha256,
  filename: name, url: '/downloads/' + name, checksumUrl: '/downloads/' + name + '.sha256',
};
await writeFile(join(root, 'public/release.json'), JSON.stringify(metadata, null, 2) + '\n');
console.log(`Prepared ${name} (${bytes.length} bytes)\nSHA-256 ${sha256}`);
