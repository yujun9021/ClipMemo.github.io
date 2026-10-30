import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const pagesPath = (process.env.PAGES_BASE_PATH || '').replace(/^\/+|\/+$/g, '');
const base = pagesPath ? `/${pagesPath}/` : '/';

export default defineConfig({
  base,
  server: { watch: { ignored: ['**/.capture/**', '**/docs/previews/**'] } },
  plugins: [{
    name: 'clipmemo-store',
    transformIndexHtml(html) {
      const store = JSON.parse(readFileSync(new URL('./public/store.json', import.meta.url), 'utf8'));
      const url = new URL(store.url);
      if (url.protocol !== 'https:' || url.hostname !== 'apps.microsoft.com' ||
          url.pathname !== '/detail/9pkrmzp1pbtk') throw new Error('Invalid ClipMemo Store URL');
      return html.replaceAll('{{STORE_URL}}', store.url.replaceAll('&', '&amp;'));
    },
  }],
});
