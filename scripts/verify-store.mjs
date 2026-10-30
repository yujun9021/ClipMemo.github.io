import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const store = JSON.parse(await readFile(new URL('public/store.json', root), 'utf8'));
assert.equal(store.url, 'https://apps.microsoft.com/detail/9pkrmzp1pbtk?hl=ko-KR&gl=KR');
const html = await readFile(new URL('index.html', root), 'utf8');
assert.equal((html.match(/href="\{\{STORE_URL\}\}"/g) || []).length, 2);
assert.ok(!/RELEASE_|ClipMemoSetup|data-checksum|\sdownload[=\s>]/.test(html));
console.log('Verified both Microsoft Store links and Store installation instructions.');
