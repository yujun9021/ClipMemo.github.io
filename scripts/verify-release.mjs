import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const release = JSON.parse(await readFile(join(root, 'public/release.json'), 'utf8'));
const files = await readdir(join(root, 'public/downloads'));
if (files.some(name => !/^ClipMemoSetup-v\d+\.\d+\.\d+-win-x64\.exe(\.sha256)?$/.test(name))) throw new Error('Unexpected public download file');
if (release.kind !== 'installer' || !/^\d+\.\d+\.\d+$/.test(release.version) || release.filename !== `ClipMemoSetup-v${release.version}-win-x64.exe` ||
    release.url !== '/downloads/' + release.filename || release.checksumUrl !== release.url + '.sha256') throw new Error('Invalid executable release metadata');
const bytes = await readFile(join(root, 'public', release.url));
const checksum = await readFile(join(root, 'public', release.checksumUrl), 'utf8');
if (bytes.length !== release.bytes || createHash('sha256').update(bytes).digest('hex') !== release.sha256 ||
    checksum.trim() !== `${release.sha256}  ${release.filename}`) throw new Error('Release verification failed');
const pe = bytes.length >= 64 ? bytes.readUInt32LE(0x3c) : -1;
if (bytes.toString('ascii', 0, 2) !== 'MZ' || pe < 64 || pe + 6 > bytes.length ||
    bytes.readUInt32LE(pe) !== 0x4550 || bytes.readUInt16LE(pe + 4) !== 0x8664) throw new Error('Expected a Windows x64 executable');
console.log(`Verified v${release.version}: executable size, SHA-256, x64 PE header and public download allowlist.`);
