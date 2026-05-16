import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = resolve(__dirname, '../../sa-kata__web/app/api/data/data.csv');
const target = resolve(__dirname, '../public/data/words.json');

const csv = await readFile(source, 'utf8');
const words = csv
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split(',')[0]?.trim().toLowerCase() ?? '')
  .filter(Boolean);

const uniqueWords = [...new Set(words)].sort((a, b) => a.localeCompare(b));

await mkdir(dirname(target), { recursive: true });
await writeFile(target, `${JSON.stringify(uniqueWords)}\n`);

console.log(`Generated ${uniqueWords.length} words at ${target}`);
