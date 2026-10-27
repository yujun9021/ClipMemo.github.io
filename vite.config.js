import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

export default defineConfig({
  server: { watch: { ignored: ['**/.capture/**', '**/docs/previews/**'] } },
  plugins: [{
    name: 'clipmemo-release',
    transformIndexHtml(html) {
      const release = JSON.parse(readFileSync(new URL('./public/release.json', import.meta.url), 'utf8'));
      if (!/^\d+\.\d+\.\d+$/.test(release.version) ||
          release.url !== `/downloads/ClipMemo-v${release.version}-win-x64.exe` ||
          release.checksumUrl !== release.url + '.sha256' ||
          !Number.isSafeInteger(release.bytes) || release.bytes < 1 ||
          !/^[a-f0-9]{64}$/.test(release.sha256)) throw new Error('Invalid ClipMemo release metadata');
      const values = {
        RELEASE_VERSION: release.version,
        RELEASE_URL: release.url,
        RELEASE_CHECKSUM_URL: release.checksumUrl,
        RELEASE_SIZE: (release.bytes / 1_000_000).toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + ' MB',
      };
      return html.replace(/\{\{(RELEASE_[A-Z_]+)\}\}/g, (_, key) => {
        if (!(key in values)) throw new Error('Unknown release template key: ' + key);
        return values[key];
      });
    },
  }],
});
