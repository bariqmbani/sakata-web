import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';

export function wordsVersion(): Plugin {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const wordsPath = resolve(__dirname, 'public/data/words.json');
  const versionPath = resolve(__dirname, 'public/data/words.version.json');
  let lastMtime = 0;

  function generate() {
    try {
      const stat = statSync(wordsPath);
      if (stat.mtimeMs === lastMtime) return;
      lastMtime = stat.mtimeMs;
      const content = readFileSync(wordsPath);
      const hash = createHash('sha256').update(content).digest('hex');
      writeFileSync(versionPath, JSON.stringify({ hash }));
    } catch {
      // words.json doesn't exist yet — skip
    }
  }

  return {
    name: 'words-version',
    buildStart() {
      generate();
    },
    handleHotUpdate({ file }) {
      if (file === wordsPath) generate();
    }
  };
}
